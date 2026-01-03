import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import { games } from "@/data/games";
import { Library as LibraryIcon, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Library = () => {
  // 예시: 라이브러리에 있는 게임들 (실제로는 사용자가 구매한 게임 목록)
  const libraryGames = games.slice(0, 4); // 예시로 처음 4개 게임을 라이브러리에 표시

  return (
    <>
      <Helmet>
        <title>라이브러리 - VORTEX</title>
        <meta 
          name="description" 
          content="내 게임 라이브러리를 확인하고 플레이하세요."
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
                  <LibraryIcon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                    <span className="gradient-text">내 라이브러리</span>
                  </h1>
                  <p className="text-muted-foreground font-body">
                    보유한 게임 {libraryGames.length}개
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Library Games Grid */}
          <section className="py-12 relative">
            <div className="container mx-auto px-4 relative">
              {libraryGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {libraryGames.map((game, index) => (
                    <div key={game.id} className="relative group">
                      <GameCard game={game} index={index} showCartButton={false} />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-3 z-10">
                        <Button variant="neon" size="lg" className="gap-2">
                          <Play className="w-5 h-5" />
                          플레이
                        </Button>
                        <Button variant="outline" size="lg" className="gap-2">
                          <Download className="w-5 h-5" />
                          다운로드
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <LibraryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">라이브러리가 비어있습니다</h3>
                  <p className="text-muted-foreground mb-6">게임을 구매하여 라이브러리에 추가하세요.</p>
                  <Button variant="neon" asChild>
                    <a href="/">스토어로 이동</a>
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

export default Library;

