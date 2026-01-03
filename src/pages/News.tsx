import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Newspaper, 
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Tag
} from "lucide-react";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(6);

  // 예시 뉴스 데이터
  const news = [
    {
      id: 1,
      title: "사이버 넥서스 2088 대규모 업데이트 출시",
      excerpt: "새로운 스토리 확장과 멀티플레이어 모드가 추가되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-20",
      time: "2시간 전",
      category: "업데이트",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      featured: true,
      views: 1523
    },
    {
      id: 2,
      title: "스텔라 오디세이 DLC '우주의 끝' 출시 예고",
      excerpt: "2024년 12월에 출시될 새로운 확장 콘텐츠의 첫 트레일러가 공개되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-19",
      time: "1일 전",
      category: "출시 소식",
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80",
      featured: true,
      views: 2341
    },
    {
      id: 3,
      title: "보이드 워커 할인 이벤트 진행 중",
      excerpt: "한정 기간 동안 30% 할인된 가격으로 구매할 수 있습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-18",
      time: "2일 전",
      category: "이벤트",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      featured: false,
      views: 987
    },
    {
      id: 4,
      title: "메카 어썰트: 타이탄 경쟁 모드 업데이트",
      excerpt: "새로운 PvP 모드와 리더보드 시스템이 추가되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-17",
      time: "3일 전",
      category: "업데이트",
      image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80",
      featured: false,
      views: 1456
    },
    {
      id: 5,
      title: "디지털 프론티어 모드 에디터 베타 테스트 시작",
      excerpt: "커뮤니티가 직접 모드를 만들 수 있는 에디터가 공개되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-16",
      time: "4일 전",
      category: "업데이트",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      featured: false,
      views: 1123
    },
    {
      id: 7,
      title: "네온 드리프트 신규 맵 추가 업데이트",
      excerpt: "3개의 새로운 레이싱 맵이 추가되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-14",
      time: "6일 전",
      category: "업데이트",
      image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=80",
      featured: false,
      views: 876
    },
    {
      id: 8,
      title: "섀도우 프로토콜 신규 캐릭터 출시",
      excerpt: "새로운 플레이어블 캐릭터가 추가되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-13",
      time: "7일 전",
      category: "출시 소식",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=800&q=80",
      featured: false,
      views: 1234
    },
    {
      id: 9,
      title: "사이버 넥서스 2088 할인 이벤트",
      excerpt: "블랙프라이데이 특가로 50% 할인 진행 중입니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-12",
      time: "8일 전",
      category: "이벤트",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      featured: false,
      views: 2100
    },
    {
      id: 10,
      title: "스텔라 오디세이 멀티플레이어 업데이트",
      excerpt: "협동 모드와 경쟁 모드가 추가되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-11",
      time: "9일 전",
      category: "업데이트",
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80",
      featured: false,
      views: 1654
    },
    {
      id: 11,
      title: "보이드 워커 시즌 2 출시 예고",
      excerpt: "새로운 스토리와 무기가 추가될 예정입니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-10",
      time: "10일 전",
      category: "출시 소식",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      featured: false,
      views: 1890
    },
    {
      id: 6,
      title: "퀀텀 브레이크 시즌 패스 발표",
      excerpt: "4개의 새로운 스토리 챕터와 추가 무기들이 포함됩니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-15",
      time: "5일 전",
      category: "출시 소식",
      image: "https://images.unsplash.com/photo-1493711662062-fa541f7f76bf?w=800&q=80",
      featured: false,
      views: 1890
    },
    {
      id: 12,
      title: "메카 어썰트: 타이탄 신규 스킨 이벤트",
      excerpt: "한정 스킨을 획득할 수 있는 특별 이벤트가 시작되었습니다.",
      author: "VORTEX 편집팀",
      date: "2024-11-09",
      time: "11일 전",
      category: "이벤트",
      image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80",
      featured: false,
      views: 1456
    }
  ];

  const categories = [
    { id: "all", label: "전체", icon: Newspaper },
    { id: "update", label: "업데이트", icon: TrendingUp },
    { id: "release", label: "출시 소식", icon: Sparkles },
    { id: "event", label: "이벤트", icon: Calendar }
  ];

  // 카테고리 ID를 실제 뉴스 데이터의 category 필드로 매핑
  const categoryMap: Record<string, string> = {
    "all": "all",
    "update": "업데이트",
    "release": "출시 소식",
    "event": "이벤트"
  };

  // 선택된 카테고리에 따라 뉴스 필터링
  const filteredNews = selectedCategory === "all" 
    ? news 
    : news.filter(item => item.category === categoryMap[selectedCategory]);

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);
  
  // 표시할 뉴스 수 제한
  const displayedRegularNews = regularNews.slice(0, displayCount);
  const hasMore = displayCount < regularNews.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  return (
    <>
      <Helmet>
        <title>뉴스 - VORTEX</title>
        <meta 
          name="description" 
          content="최신 게임 뉴스, 업데이트, 출시 소식을 확인하세요."
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
                  <Newspaper className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                    <span className="gradient-text">뉴스</span>
                  </h1>
                  <p className="text-muted-foreground font-body">
                    최신 게임 소식과 업데이트를 확인하세요
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
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <section className="py-12 relative">
              <div className="container mx-auto px-4">
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span className="gradient-text">주요 뉴스</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {featuredNews.map((item) => (
                    <Card 
                      key={item.id}
                      className="glass-card hover:border-primary/30 transition-all cursor-pointer group overflow-hidden"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="text-xs font-body font-medium uppercase tracking-wider text-primary bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                            {item.category}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <CardTitle className="font-display text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mb-3">
                            {item.excerpt}
                          </CardDescription>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{item.views.toLocaleString()} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Regular News Grid */}
          <section className="py-12 relative">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold mb-6">
                <span className="gradient-text">최신 뉴스</span>
              </h2>
              {displayedRegularNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedRegularNews.map((item) => (
                  <Card 
                    key={item.id}
                    className="glass-card hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-body font-medium uppercase tracking-wider text-primary bg-primary/20 px-2 py-1 rounded border border-primary/30">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="font-display text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </div>
                        <span>{item.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-glass-border/20">
                        <span className="text-sm font-body text-muted-foreground">{item.author}</span>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <span className="text-xs">자세히</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">뉴스가 없습니다</h3>
                  <p className="text-muted-foreground">
                    선택한 카테고리에 뉴스가 없습니다.
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
                    <span>더 많은 뉴스 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default News;

