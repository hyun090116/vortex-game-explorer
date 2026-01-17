import { Helmet } from "react-helmet";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import { games } from "@/data/games";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const selectedGenre = searchParams.get("genre") || "";

  // 검색어 및 장르로 게임 필터링
  const filteredGames = useMemo(() => {
    let filtered = games;

    // 장르 필터링
    if (selectedGenre) {
      filtered = filtered.filter((game) =>
        game.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((game) => {
        const titleMatch = game.title.toLowerCase().includes(query);
        const developerMatch = game.developer.toLowerCase().includes(query);
        const genreMatch = game.genre.some((g) => g.toLowerCase().includes(query));
        const descriptionMatch = game.description.toLowerCase().includes(query);

        return titleMatch || developerMatch || genreMatch || descriptionMatch;
      });
    }

    return filtered;
  }, [searchQuery, selectedGenre]);

  // URL 파라미터와 동기화
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (selectedGenre) {
        setSearchParams({ q: searchQuery.trim(), genre: selectedGenre });
      } else {
        setSearchParams({ q: searchQuery.trim() });
      }
    }
  };

  // 검색어 초기화
  const handleClear = () => {
    setSearchQuery("");
    if (selectedGenre) {
      setSearchParams({ genre: selectedGenre });
    } else {
      setSearchParams({});
    }
  };

  // 장르 필터 제거
  const handleRemoveGenre = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {selectedGenre
            ? `${selectedGenre} 장르 게임 - VORTEX`
            : searchQuery
            ? `"${searchQuery}" 검색 결과 - VORTEX`
            : "게임 검색 - VORTEX"}
        </title>
        <meta
          name="description"
          content="VORTEX에서 게임을 검색하고 발견하세요."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          {/* Search Section */}
          <section className="relative py-12 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                    <SearchIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                      <span className="gradient-text">
                        {selectedGenre ? `${selectedGenre} 장르` : "게임 검색"}
                      </span>
                    </h1>
                    <p className="text-muted-foreground font-body">
                      {selectedGenre
                        ? `${selectedGenre} 장르의 게임을 찾아보세요`
                        : "원하는 게임을 찾아보세요"}
                    </p>
                  </div>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="게임 제목, 개발사, 장르로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-12 h-14 text-lg glass border-glass-border/30"
                      />
                      {searchQuery && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={handleClear}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Button
                      type="submit"
                      variant="neon"
                      size="lg"
                      className="h-14 px-8"
                    >
                      검색
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* Search Results */}
          <section className="py-12 relative">
            <div className="container mx-auto px-4 relative">
              {searchQuery || selectedGenre ? (
                <>
                  <div className="mb-6 flex items-center gap-3 flex-wrap">
                    <p className="text-muted-foreground font-body">
                      <span className="font-display font-bold text-foreground">
                        {filteredGames.length}
                      </span>
                      개의 게임을 찾았습니다
                      {searchQuery && (
                        <>
                          {" "}
                          <span className="text-primary">"{searchQuery}"</span>
                        </>
                      )}
                    </p>
                    {selectedGenre && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-display font-medium">
                          {selectedGenre}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveGenre}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {filteredGames.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredGames.map((game, index) => (
                        <GameCard key={game.id} game={game} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display text-2xl font-bold mb-2">
                        검색 결과가 없습니다
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        다른 검색어로 시도해보세요.
                      </p>
                      <Button variant="neon" onClick={handleClear}>
                        검색어 초기화
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">
                    게임을 검색해보세요
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    게임 제목, 개발사, 장르로 검색하거나 게임 카드의 장르 태그를 클릭해보세요.
                  </p>
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

export default Search;

