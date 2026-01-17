import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 사용자가 구매한 게임 ID 목록을 반환하는 훅
 */
export const usePurchasedGames = () => {
  const { user } = useAuth();
  const [purchasedGameIds, setPurchasedGameIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadPurchasedGames = useCallback(async () => {
    if (!user) {
      setPurchasedGameIds(new Set());
      setLoading(false);
      return;
    }

    try {
      // 구매 내역과 게임 정보를 함께 조회
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          game_id,
          game:games (
            id,
            title
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (error) {
        console.error('구매한 게임 로드 오류:', error);
        setPurchasedGameIds(new Set());
        return;
      }

      // 게임 ID와 게임 제목을 모두 저장 (로컬 ID와 DB ID 모두 매칭 가능하도록)
      const gameIds = new Set<string>();
      const gameTitles = new Set<string>();
      
      (data || []).forEach((purchase: any) => {
        if (purchase.game_id) {
          gameIds.add(purchase.game_id);
        }
        if (purchase.game?.title) {
          gameTitles.add(purchase.game.title);
        }
      });

      // Set에 저장 (game_id와 title 모두 저장)
      const allIds = new Set([...gameIds, ...gameTitles]);
      setPurchasedGameIds(allIds);
    } catch (error) {
      console.error('구매한 게임 로드 중 오류:', error);
      setPurchasedGameIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPurchasedGames();

    // 구매 내역 변경 감지를 위한 실시간 구독
    if (user) {
      const channel = supabase
        .channel('purchases-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchases',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // 구매 내역이 변경되면 자동으로 새로고침
            loadPurchasedGames();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, loadPurchasedGames]);

  const isPurchased = useCallback((gameId: string, gameTitle?: string): boolean => {
    // gameId로 확인 (DB UUID 또는 로컬 ID)
    if (purchasedGameIds.has(gameId)) {
      return true;
    }
    // gameTitle로도 확인 (로컬 데이터의 ID와 DB ID가 다를 수 있음)
    if (gameTitle && purchasedGameIds.has(gameTitle)) {
      return true;
    }
    return false;
  }, [purchasedGameIds]);

  return { isPurchased, purchasedGameIds, loading, refresh: loadPurchasedGames };
};

