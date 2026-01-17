import { games } from "@/data/games";
import GameCard from "./GameCard";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "trending", label: "인기", icon: TrendingUp },
  { id: "new", label: "신작", icon: Sparkles },
  { id: "coming", label: "출시 예정", icon: Clock },
];

const GameGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("trending");
  const [displayCount, setDisplayCount] = useState(8);

  // 현재 날짜
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // 카테고리별 게임 필터링 및 정렬
  const getFilteredGames = () => {
    const nonFeaturedGames = games.filter(g => !g.featured);
    
    switch (selectedCategory) {
      case "trending":
        // 인기: rating이 높은 순서
        return [...nonFeaturedGames].sort((a, b) => b.rating - a.rating);
      
      case "new":
        // 신작: 최근 출시된 순서 (releaseDate 기준 내림차순)
        return [...nonFeaturedGames].sort((a, b) => {
          const dateA = new Date(a.releaseDate);
          const dateB = new Date(b.releaseDate);
          return dateB.getTime() - dateA.getTime();
        });
      
      case "coming":
        // 출시 예정: 미래 날짜의 게임
        return nonFeaturedGames.filter(game => {
          const releaseDate = new Date(game.releaseDate);
          releaseDate.setHours(0, 0, 0, 0);
          return releaseDate > currentDate;
        }).sort((a, b) => {
          const dateA = new Date(a.releaseDate);
          const dateB = new Date(b.releaseDate);
          return dateA.getTime() - dateB.getTime();
        });
      
      default:
        return nonFeaturedGames;
    }
  };

  const filteredGames = getFilteredGames();
  const displayedGames = filteredGames.slice(0, displayCount);
  const hasMore = displayCount < filteredGames.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDisplayCount(8); // 카테고리 변경 시 표시 개수 초기화
  };

  return (
    <section className="py-20 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">게임</span> 탐색
            </h2>
            <p className="text-muted-foreground font-body">
              엄선된 프리미엄 타이틀 컬렉션을 만나보세요
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1 glass rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body font-medium text-sm uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
        
        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={handleLoadMore}
              className="group flex items-center gap-3 px-8 py-3 glass rounded-xl border border-glass-border/30 hover:border-primary/30 transition-all"
            >
              <span className="font-body font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                더 많은 게임 보기
              </span>
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                <span className="text-lg leading-none">↓</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GameGrid;
