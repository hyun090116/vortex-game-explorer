import { supabase } from './supabase';
import type { Game } from '@/data/games';

interface PurchaseItem {
  gameId: string;
  gameTitle: string;
  price: number;
  quantity: number;
}

/**
 * 결제 처리 함수
 * 장바구니의 모든 아이템을 구매 내역으로 저장
 */
export const processPayment = async (
  userId: string,
  items: PurchaseItem[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!userId) {
      return { success: false, error: '사용자 ID가 없습니다.' };
    }

    if (!items || items.length === 0) {
      return { success: false, error: '구매할 아이템이 없습니다.' };
    }

    // 각 게임에 대해 구매 내역 생성
    const purchases = items.map((item, index) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      
      return {
        user_id: userId,
        game_id: item.gameId,
        price_paid: price * quantity,
        payment_method: 'demo', // 데모 결제
        transaction_id: `TXN-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed',
      };
    });

    // Supabase에 구매 내역 저장
    const { data, error } = await supabase
      .from('purchases')
      .insert(purchases)
      .select();

    if (error) {
      console.error('결제 처리 오류:', error);
      console.error('오류 상세:', JSON.stringify(error, null, 2));
      return { 
        success: false, 
        error: error.message || '구매 내역 저장 중 오류가 발생했습니다.' 
      };
    }

    if (!data || data.length === 0) {
      return { success: false, error: '구매 내역이 저장되지 않았습니다.' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('결제 처리 중 오류 발생:', error);
    return { 
      success: false, 
      error: error.message || '결제 처리 중 오류가 발생했습니다.' 
    };
  }
};

/**
 * 게임이 DB에 존재하는지 확인하고, 없으면 생성
 * RLS 정책 문제로 게임 생성이 실패할 경우 임시 UUID를 반환
 */
export const ensureGameExists = async (game: Game): Promise<string> => {
  try {
    // 먼저 게임이 존재하는지 확인 (title로)
    const { data: existingGames, error: searchError } = await supabase
      .from('games')
      .select('id')
      .eq('title', game.title)
      .limit(1);

    if (searchError) {
      console.warn('게임 검색 오류:', searchError);
      // 검색 오류가 있어도 계속 진행 (게임이 없는 것으로 간주)
    }

    if (existingGames && existingGames.length > 0) {
      return existingGames[0].id;
    }

    // 게임이 없으면 생성 시도
    const slug = game.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 255); // slug 길이 제한

    // 고유한 slug 생성 (중복 방지)
    let finalSlug = slug;
    let slugCounter = 1;
    let slugCheckAttempts = 0;
    const maxSlugCheckAttempts = 5; // 최대 5번만 시도
    
    while (slugCheckAttempts < maxSlugCheckAttempts) {
      const { data: slugCheck } = await supabase
        .from('games')
        .select('id')
        .eq('slug', finalSlug)
        .limit(1);
      
      if (!slugCheck || slugCheck.length === 0) {
        break;
      }
      finalSlug = `${slug}-${slugCounter}`;
      slugCounter++;
      slugCheckAttempts++;
    }

    const gameData: any = {
      title: game.title,
      slug: finalSlug,
      description: game.description || '',
      developer: game.developer || '',
      price: Number(game.price) || 0,
      discount_percent: game.originalPrice
        ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)
        : 0,
      cover_image: game.coverImage || null,
      trailer_url: game.trailerVideo || null,
      genre: Array.isArray(game.genre) ? game.genre : [],
      rating: game.rating ? Number(game.rating) / 10 : 0, // 0-10 스케일을 0-1로 변환
      release_date: game.releaseDate || new Date().toISOString().split('T')[0],
      status: 'active',
    };

    const { data: newGame, error: insertError } = await supabase
      .from('games')
      .insert(gameData)
      .select('id')
      .single();

    if (insertError) {
      console.warn('게임 생성 오류 (RLS 정책 문제일 수 있음):', insertError);
      console.warn('게임 생성 실패, 임시 UUID 사용:', game.title);
      
      // RLS 정책 문제로 게임 생성이 실패한 경우
      // 임시 UUID를 생성하여 반환 (구매 내역 저장을 위해)
      // 주의: 이 UUID는 실제 게임 테이블에 존재하지 않으므로,
      // 마이페이지에서 게임 정보를 조회할 때 NULL이 될 수 있습니다.
      // Supabase에서 RLS 정책을 업데이트하면 이 문제가 해결됩니다.
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.warn(`임시 게임 ID 사용: ${tempId} (게임: ${game.title})`);
      return tempId;
    }

    if (!newGame || !newGame.id) {
      console.warn('게임 생성 후 ID를 받지 못함, 임시 UUID 사용');
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return tempId;
    }

    return newGame.id;
  } catch (error: any) {
    console.warn('게임 확인/생성 중 오류 발생, 임시 UUID 사용:', error);
    // 에러가 발생해도 임시 UUID를 반환하여 결제가 진행되도록 함
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return tempId;
  }
};

