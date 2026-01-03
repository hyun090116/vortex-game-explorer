import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  ArrowRight,
  X
} from "lucide-react";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
  game: string;
  content?: string;
}

const Community = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [postLikes, setPostLikes] = useState<Record<number, number>>({});
  const { toast } = useToast();

  // 예시 커뮤니티 게시물 데이터
  const posts: Post[] = [
    {
      id: 1,
      title: "사이버 넥서스 2088 최신 업데이트 공유",
      author: "네온게이머",
      date: "2시간 전",
      likes: 124,
      comments: 23,
      category: "토론",
      game: "사이버 넥서스 2088",
      content: `안녕하세요! 사이버 넥서스 2088의 최신 업데이트에 대해 공유하고 싶어서 글을 올립니다.

오늘 새로 출시된 업데이트에서는 다음과 같은 내용이 추가되었습니다:

1. 새로운 사이버펑크 스킨 추가
   - 네온 스트리트 테마
   - 홀로그램 아머 세트
   - 사이버펑크 무기 스킨

2. 멀티플레이어 모드 개선
   - 매칭 시스템 최적화
   - 새로운 협동 미션 추가
   - PvP 밸런스 조정

3. 버그 수정
   - 메모리 누수 문제 해결
   - 그래픽 렌더링 성능 개선
   - 네트워크 연결 안정성 향상

특히 새로운 사이버펑크 스킨들이 정말 멋지네요! 홀로그램 아머는 야간 전투에서 정말 인상적입니다.

다른 분들도 업데이트 후 느낀 점이나 의견을 공유해주시면 좋을 것 같습니다!`
    },
    {
      id: 2,
      title: "스텔라 오디세이 엔딩 스포일러 주의!",
      author: "우주탐험가",
      date: "5시간 전",
      likes: 89,
      comments: 45,
      category: "토론",
      game: "스텔라 오디세이",
      content: `⚠️ 스포일러 주의 ⚠️

이 글은 스텔라 오디세이의 엔딩에 대한 내용을 다루고 있습니다. 아직 게임을 완료하지 않으신 분들은 주의해주세요!

---

정말 놀라운 엔딩이었습니다. 마지막 선택지에서 제가 선택한 것은...

[스포일러 내용]

정말 감동적인 스토리였고, 특히 마지막 장면에서의 음악과 연출이 정말 인상적이었습니다. 

다른 분들은 어떤 엔딩을 보셨나요? 여러 엔딩이 있다고 들었는데, 다른 분들의 선택도 궁금합니다!`
    },
    {
      id: 3,
      title: "보이드 워커 공략 팁 모음",
      author: "서바이벌마스터",
      date: "1일 전",
      likes: 256,
      comments: 67,
      category: "공략",
      game: "보이드 워커",
      content: `보이드 워커를 플레이하면서 알게 된 유용한 팁들을 정리해봤습니다!

📌 필수 팁

1. 자원 관리
   - 초반에는 탄약을 아껴서 사용하세요
   - 의료 키트는 위급 상황에만 사용
   - 배터리는 항상 여유 있게 보관

2. 적 대처법
   - 어둠 속에서 움직일 때는 조용히 이동
   - 소음이 나는 행동은 피하기
   - 적의 패턴을 파악하면 회피가 쉬워짐

3. 맵 활용
   - 숨을 수 있는 장소 미리 파악
   - 탈출 경로 항상 확인
   - 아이템 위치 기억하기

4. 무기 선택
   - 조용한 무기 우선 사용
   - 근접 무기는 최후의 수단
   - 탄약이 많은 무기 선호

이 팁들이 도움이 되셨다면 좋아요 부탁드립니다! 추가 팁이 있으시면 댓글로 공유해주세요.`
    },
    {
      id: 4,
      title: "메카 어썰트 멀티플레이 파티 모집",
      author: "메카파일럿",
      date: "1일 전",
      likes: 42,
      comments: 18,
      category: "파티",
      game: "메카 어썰트: 타이탄",
      content: `메카 어썰트: 타이탄 멀티플레이 파티를 모집합니다!

🎮 파티 정보
- 게임: 메카 어썰트: 타이탄
- 모드: 협동 미션
- 난이도: 하드
- 시간: 오늘 저녁 8시

👥 모집 인원
- 현재: 2명
- 필요: 2명 더

📋 조건
- 레벨 20 이상
- 마이크 필수
- 팀워크 중요

💬 연락처
- 디스코드: 메카파일럿#1234
- 게임 내 ID: MechPilot2024

함께 플레이하고 싶으신 분들은 댓글이나 메시지 주세요!`
    },
    {
      id: 5,
      title: "디지털 프론티어 건설 전략 공유",
      author: "건축가",
      date: "2일 전",
      likes: 178,
      comments: 34,
      category: "토론",
      game: "디지털 프론티어",
      content: `디지털 프론티어에서 효율적인 건설 전략을 공유합니다!

🏗️ 초반 건설 순서

1단계: 자원 수집 시설
   - 광산 3개 우선 건설
   - 발전소 2개 건설
   - 저장소 확장

2단계: 생산 시설
   - 제조 공장 건설
   - 연구소 건설
   - 주민 주거지 확장

3단계: 방어 시설
   - 방어 타워 배치
   - 벽 건설
   - 감시 시스템 설치

💡 효율적인 레이아웃
- 자원 시설은 중앙에 배치
- 생산 시설은 자원 시설 근처에
- 방어 시설은 외곽에 배치

이 전략으로 초반을 빠르게 넘기고 후반에 집중할 수 있습니다!`
    },
    {
      id: 6,
      title: "퀀텀 브레이크 퍼즐 해결법",
      author: "퍼즐러버",
      date: "3일 전",
      likes: 203,
      comments: 56,
      category: "공략",
      game: "퀀텀 브레이크",
      content: `퀀텀 브레이크의 어려운 퍼즐들을 해결하는 방법을 정리했습니다!

🧩 퍼즐 1: 시간 역행 퍼즐
해결법:
1. 시간을 역행시켜서 과거 상태 확인
2. 미래의 장애물 위치 파악
3. 과거에서 미래 장애물 제거
4. 시간을 정상으로 돌려서 통과

🧩 퍼즐 2: 중력 조작 퍼즐
해결법:
1. 중력을 역전시켜 천장으로 이동
2. 중력 조작으로 물체 이동
3. 정상 중력으로 복귀
4. 통로 열기

🧩 퍼즐 3: 시간 정지 퍼즐
해결법:
1. 시간 정지로 움직이는 플랫폼 고정
2. 플랫폼 위로 이동
3. 시간 재개
4. 플랫폼과 함께 이동

더 어려운 퍼즐이 있으면 댓글로 질문해주세요!`
    },
    {
      id: 7,
      title: "네온 드리프트 레이싱 팁",
      author: "스피드킹",
      date: "4시간 전",
      likes: 95,
      comments: 12,
      category: "공략",
      game: "네온 드리프트",
      content: `네온 드리프트에서 빠른 레이싱을 위한 팁입니다!

🏎️ 드리프트 기술

1. 드리프트 타이밍
   - 코너 진입 전 미리 브레이크
   - 드리프트 각도 조절로 속도 유지
   - 드리프트 종료 시 가속

2. 부스터 활용
   - 직선 구간에서 사용
   - 드리프트 후 부스터로 가속
   - 부스터 게이지 관리

3. 코스 외곽 활용
   - 코너에서 외곽 라인 활용
   - 최단 거리 유지
   - 벽 충돌 주의

4. 차량 커스터마이징
   - 가속력 우선 설정
   - 핸들링 조절
   - 부스터 용량 증가

이 팁들로 레이스 타임을 단축할 수 있습니다!`
    },
    {
      id: 8,
      title: "섀도우 프로토콜 스텔스 전략 토론",
      author: "그림자",
      date: "6시간 전",
      likes: 134,
      comments: 28,
      category: "토론",
      game: "섀도우 프로토콜",
      content: `섀도우 프로토콜의 스텔스 전략에 대해 토론해봅시다!

🤔 스텔스 vs 액션

저는 완전 스텔스 플레이를 선호하는데, 다른 분들은 어떤가요?

완전 스텔스의 장점:
- 도전적인 플레이
- 보상이 더 좋음
- 성취감이 큼

액션 플레이의 장점:
- 빠른 진행
- 스트레스 적음
- 다양한 무기 활용

💡 스텔스 팁
- 어둠 활용하기
- 소음 최소화
- 적의 시야각 파악
- 대체 경로 찾기

어떤 플레이 스타일을 선호하시나요? 토론해봅시다!`
    },
    {
      id: 9,
      title: "보이드 워커 공포 모드 플레이 파티",
      author: "무서운게이머",
      date: "8시간 전",
      likes: 67,
      comments: 15,
      category: "파티",
      game: "보이드 워커",
      content: `보이드 워커 공포 모드를 함께 플레이할 파티원을 모집합니다!

😱 공포 모드 정보
- 난이도: 나이트메어
- 모드: 협동
- 인원: 4명
- 시간: 오늘 밤 10시

🎯 목표
- 공포 모드 클리어
- 숨겨진 엔딩 발견
- 모든 수집품 획득

👥 모집 조건
- 공포 게임 경험자 우대
- 마이크 필수
- 팀워크 중요
- 밤늦게 플레이 가능한 분

💬 연락
- 디스코드: ScaryGamer#5678
- 게임 ID: VoidWalker2024

무서워도 함께 플레이하고 싶으신 분들 환영합니다!`
    },
    {
      id: 10,
      title: "사이버 넥서스 멀티플레이 파티 모집",
      author: "팀플레이어",
      date: "10시간 전",
      likes: 88,
      comments: 22,
      category: "파티",
      game: "사이버 넥서스 2088",
      content: `사이버 넥서스 2088 멀티플레이 파티를 모집합니다!

🎮 파티 정보
- 게임: 사이버 넥서스 2088
- 모드: 레이드
- 난이도: 엘리트
- 시간: 매일 저녁 8시

👥 현재 상황
- 탱커: 1명
- 딜러: 2명
- 힐러: 1명
- 필요: 딜러 1명

📋 요구사항
- 레벨 50 이상
- 레이드 경험자
- 마이크 필수
- 정기 참여 가능

💬 연락처
- 디스코드: TeamPlayer#9012
- 게임 ID: CyberNexus2024

함께 레이드를 클리어하고 보상을 획득해봅시다!`
    },
    {
      id: 11,
      title: "스텔라 오디세이 행성 탐사 공략",
      author: "탐험가",
      date: "12시간 전",
      likes: 156,
      comments: 41,
      category: "공략",
      game: "스텔라 오디세이",
      content: `스텔라 오디세이의 행성 탐사 공략을 정리했습니다!

🪐 행성별 탐사 가이드

1. 화성 (Mars)
   - 산소 공급 필수
   - 낮은 중력 활용
   - 화성 기지에서 자원 획득

2. 목성 위성 (Europa)
   - 얼음 동굴 탐사
   - 숨겨진 연구소 발견
   - 특수 장비 필요

3. 토성 (Saturn)
   - 고리 탐사
   - 중력 조작 퍼즐
   - 희귀 광물 발견

4. 외계 행성 (Exoplanet)
   - 외계 생명체 조우
   - 언어 해독 미니게임
   - 우정 엔딩 조건

💡 탐사 팁
- 연료 항상 확인
- 산소 탱크 여유 있게
- 지도 미리 확인
- 자원 수집 우선

모든 행성을 탐사하면 특별 보상을 받을 수 있습니다!`
    },
    {
      id: 12,
      title: "게임 밸런스에 대한 토론",
      author: "밸런서",
      date: "1일 전",
      likes: 201,
      comments: 89,
      category: "토론",
      game: "일반",
      content: `게임 밸런스에 대해 토론해봅시다!

⚖️ 밸런스 논란

최근 업데이트로 인해 여러 게임의 밸런스가 변경되었는데, 여러분의 의견은 어떤가요?

1. 무기 밸런스
   - 일부 무기가 너무 강한가?
   - 약한 무기는 어떻게 버프해야 할까?
   - 메타 무기 다양화 필요?

2. 캐릭터 밸런스
   - 특정 캐릭터가 과도하게 강한가?
   - 약한 캐릭터는 어떻게 개선할까?
   - 팀 조합의 다양성은?

3. 난이도 밸런스
   - 쉬운 난이도는 너무 쉬운가?
   - 어려운 난이도는 공정한가?
   - 중간 난이도는 적절한가?

여러분의 의견을 댓글로 공유해주세요! 개발팀도 이 토론을 보고 있을 수 있습니다.`
    }
  ];

  const categories = [
    { id: "all", label: "전체", icon: MessageSquare, count: posts.length },
    { id: "토론", label: "토론", icon: Users, count: posts.filter(p => p.category === "토론").length },
    { id: "공략", label: "공략", icon: TrendingUp, count: posts.filter(p => p.category === "공략").length },
    { id: "파티", label: "파티", icon: Calendar, count: posts.filter(p => p.category === "파티").length }
  ];

  // 선택된 카테고리에 따라 게시물 필터링
  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // 표시할 게시물 수 제한
  const displayedPosts = filteredPosts.slice(0, displayCount);
  const hasMore = displayCount < filteredPosts.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedPost(null);
  };

  const handleLike = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setPostLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: (prevLikes[postId] || posts.find(p => p.id === postId)?.likes || 0) - 1,
        }));
      } else {
        newSet.add(postId);
        setPostLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: (prevLikes[postId] || posts.find(p => p.id === postId)?.likes || 0) + 1,
        }));
      }
      return newSet;
    });
  };

  const handleComment = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "댓글 기능",
      description: "댓글 기능은 준비 중입니다.",
    });
  };

  const handleShare = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content?.substring(0, 100) || '',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "링크가 복사되었습니다!",
          description: "게시물 링크를 클립보드에 복사했습니다.",
        });
      }).catch(() => {
        toast({
          title: "복사 실패",
          description: "링크 복사에 실패했습니다.",
          variant: "destructive",
        });
      });
    }
  };

  const getPostLikes = (postId: number) => {
    const baseLikes = posts.find(p => p.id === postId)?.likes || 0;
    return postLikes[postId] !== undefined ? postLikes[postId] : baseLikes;
  };

  const isPostLiked = (postId: number) => {
    return likedPosts.has(postId);
  };

  return (
    <>
      <Helmet>
        <title>커뮤니티 - VORTEX</title>
        <meta 
          name="description" 
          content="게이머들과 소통하고 게임 정보를 공유하세요."
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="container mx-auto px-4 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                    <span className="gradient-text">커뮤니티</span>
                  </h1>
                  <p className="text-muted-foreground font-body">
                    게이머들과 함께 소통하고 정보를 공유하세요
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-8 relative">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body font-medium text-sm uppercase tracking-wider transition-all ${
                      selectedCategory === cat.id
                        ? "bg-primary/20 text-primary border border-primary/30 glass"
                        : "glass border border-glass-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                    <span className="text-xs opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Posts Grid */}
          <section className="py-12 relative">
            <div className="container mx-auto px-4">
              {displayedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="glass-card hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => handlePostClick(post)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-body font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <CardTitle className="font-display text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {post.game}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-1 h-auto p-0 ${isPostLiked(post.id) ? 'text-accent' : 'text-muted-foreground'}`}
                            onClick={(e) => handleLike(post.id, e)}
                          >
                            <Heart className={`w-4 h-4 ${isPostLiked(post.id) ? 'fill-accent' : ''}`} />
                            <span>{getPostLikes(post.id)}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 h-auto p-0 text-muted-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostClick(post);
                            }}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          onClick={(e) => handleShare(post, e)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-glass-border/20">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta" />
                          <span className="text-sm font-body text-muted-foreground">{post.author}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">게시물이 없습니다</h3>
                  <p className="text-muted-foreground">
                    선택한 카테고리에 게시물이 없습니다.
                  </p>
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button 
                    onClick={handleLoadMore}
                    variant="outline" 
                    className="gap-2 glass border-glass-border/30"
                  >
                    <span>더 많은 게시물 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Create Post CTA */}
          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <Card className="glass-card border-primary/30">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">새로운 게시물 작성하기</h3>
                  <p className="text-muted-foreground mb-6">
                    게이머들과 경험을 공유하고 토론에 참여하세요
                  </p>
                  <Button variant="neon" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    게시물 작성
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />

        {/* Post Detail Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            {selectedPost && (
              <>
                <SheetHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-body font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                          {selectedPost.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{selectedPost.date}</span>
                      </div>
                      <SheetTitle className="font-display text-2xl mb-2">
                        {selectedPost.title}
                      </SheetTitle>
                      <SheetDescription className="text-base">
                        {selectedPost.game}
                      </SheetDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseSheet}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-glass-border/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                      <span className="text-sm font-display font-bold text-primary-foreground">
                        {selectedPost.author[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-body font-medium text-foreground">{selectedPost.author}</p>
                      <p className="text-sm text-muted-foreground">{selectedPost.date}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="prose prose-invert max-w-none">
                    <div className="text-foreground font-body leading-relaxed whitespace-pre-line">
                      {selectedPost.content || "게시물 내용이 없습니다."}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-glass-border/20">
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-2 ${isPostLiked(selectedPost.id) ? 'text-accent' : ''}`}
                        onClick={(e) => handleLike(selectedPost.id, e)}
                      >
                        <Heart className={`w-4 h-4 ${isPostLiked(selectedPost.id) ? 'fill-accent' : ''}`} />
                        <span>{getPostLikes(selectedPost.id)}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={(e) => handleComment(selectedPost.id, e)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{selectedPost.comments}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={(e) => handleShare(selectedPost, e)}
                      >
                        <Share2 className="w-4 h-4" />
                        공유
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="pt-6 border-t border-glass-border/20">
                    <h3 className="font-display font-bold text-lg mb-4">댓글 ({selectedPost.comments})</h3>
                    <div className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>댓글 기능은 준비 중입니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Community;

