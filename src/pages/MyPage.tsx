import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { User, ShoppingBag, Settings, LogOut } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface Purchase {
  id: string;
  game_id: string;
  price_paid: number;
  purchase_date: string;
  status: string;
  game: {
    title: string;
    cover_image: string;
    developer: string;
  } | null;
}

const MyPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfile();
    loadPurchases();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          display_name: data.display_name || '',
          bio: data.bio || '',
        });
      } else {
        // 프로필이 없으면 생성
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || null,
            display_name: user.email?.split('@')[0] || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (newProfile) {
          setProfile(newProfile);
          setFormData({
            username: newProfile.username || '',
            display_name: newProfile.display_name || '',
            bio: newProfile.bio || '',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: '프로필 로드 실패',
        description: error.message || '프로필을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPurchases = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          game:games (
            title,
            cover_image,
            developer
          )
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      // 게임 정보가 없는 경우(임시 UUID 사용한 경우)를 처리
      const purchasesWithFallback = (data || []).map((purchase: any) => {
        if (!purchase.game && purchase.game_id?.startsWith('temp-')) {
          // 임시 ID인 경우, 구매 내역에서 게임 정보 추출 시도
          return {
            ...purchase,
            game: {
              title: '게임 정보 없음',
              cover_image: null,
              developer: '알 수 없음',
            },
          };
        }
        return purchase;
      });

      setPurchases(purchasesWithFallback);
    } catch (error: any) {
      toast({
        title: '구매 내역 로드 실패',
        description: error.message || '구매 내역을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: formData.username || null,
          display_name: formData.display_name || null,
          bio: formData.bio || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: '프로필 업데이트 성공',
        description: '프로필이 성공적으로 업데이트되었습니다.',
      });

      setIsEditing(false);
      loadProfile();
    } catch (error: any) {
      toast({
        title: '프로필 업데이트 실패',
        description: error.message || '프로필 업데이트에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-20 mt-16 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">마이페이지</h1>
          <p className="text-muted-foreground">계정 정보와 구매 내역을 관리하세요</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              프로필
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <ShoppingBag className="w-4 h-4 mr-2" />
              구매 내역
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="glass border-glass-border/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      회원 정보
                    </CardTitle>
                    <CardDescription>
                      계정 정보를 수정할 수 있습니다
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      수정하기
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    이메일은 변경할 수 없습니다
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">사용자명</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    placeholder="사용자명을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">표시 이름</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    disabled={!isEditing}
                    placeholder="표시할 이름을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">소개</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="자기소개를 입력하세요"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="neon"
                      onClick={handleUpdateProfile}
                      className="flex-1"
                    >
                      저장하기
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        loadProfile();
                      }}
                      className="flex-1"
                    >
                      취소
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-glass-border/30 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogOut className="w-5 h-5" />
                  계정 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="mt-6">
            <Card className="glass border-glass-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  구매 내역
                </CardTitle>
                <CardDescription>
                  구매한 게임 목록입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">구매한 게임이 없습니다</p>
                    <Button
                      variant="neon"
                      onClick={() => navigate('/')}
                    >
                      게임 둘러보기
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-start gap-4 p-4 glass rounded-lg border border-glass-border/30 hover:border-primary/30 transition-colors"
                      >
                        {purchase.game?.cover_image && (
                          <img
                            src={purchase.game.cover_image}
                            alt={purchase.game.title}
                            className="w-20 h-28 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-lg mb-1">
                            {purchase.game?.title || '알 수 없는 게임'}
                          </h3>
                          {purchase.game?.developer && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {purchase.game.developer}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              구매일: {formatDate(purchase.purchase_date)}
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="font-display font-bold text-primary">
                              {formatPrice(purchase.price_paid)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            purchase.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : purchase.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {purchase.status === 'completed' ? '완료' : 
                             purchase.status === 'pending' ? '대기중' : '환불됨'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;

