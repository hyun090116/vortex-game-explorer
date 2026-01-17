import { Play, Plus, Star, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { usePurchasedGames } from "@/hooks/usePurchasedGames";
import { featuredGame } from "@/data/games";
import { useAuth } from "@/contexts/AuthContext";
import { requestPayment } from "@/lib/tossPayments";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

const HeroSection = () => {
  const { addToCart, cartItems } = useCart();
  const { isPurchased } = usePurchasedGames();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isInCart = cartItems.some(item => item.id === featuredGame.id);
  const isOwned = isPurchased(featuredGame.id, featuredGame.title);
  
  const imageUrl = imageError 
    ? `https://placehold.co/1920x1080/1a1a1a/ffffff?text=${encodeURIComponent(featuredGame.title)}`
    : featuredGame.coverImage;

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      // 게임 정보를 sessionStorage에 저장
      sessionStorage.setItem(
        "pending_gameInfos",
        JSON.stringify([
          {
            title: featuredGame.title,
            developer: featuredGame.developer,
            description: featuredGame.description,
            coverImage: featuredGame.coverImage,
            releaseDate: featuredGame.releaseDate,
            genre: featuredGame.genre,
            rating: featuredGame.rating,
            price: featuredGame.price,
          },
        ])
      );

      await requestPayment({
        amount: featuredGame.price,
        orderName: featuredGame.title,
        customerEmail: user.email ?? undefined,
        customerName: user.email ?? undefined,
      });
    } catch (error) {
      console.error("결제 호출 실패:", error);
      alert(error instanceof Error ? error.message : "결제창을 열 수 없습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={featuredGame.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-hero-gradient" />
      </div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--neon-cyan) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--neon-cyan) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {featuredGame.genre.map((tag) => (
              <Link
                key={tag}
                to={`/search?genre=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider rounded-full border border-primary/30 text-primary bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 
            className="font-display text-5xl md:text-7xl font-bold mb-4 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="gradient-text">{featuredGame.title.split(' ')[0]}</span>
            <br />
            <span className="text-foreground">{featuredGame.title.split(' ').slice(1).join(' ')}</span>
          </h1>

          {/* Rating */}
          <div 
            className="flex items-center gap-4 mb-6 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="font-display font-bold text-primary">{featuredGame.rating}</span>
            </div>
            <span className="text-muted-foreground font-body">
              {featuredGame.developer}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-body">
              {new Date(featuredGame.releaseDate).toLocaleDateString('ko-KR', { 
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>

          {/* Description */}
          <p 
            className="text-lg text-muted-foreground mb-8 max-w-xl font-body animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {featuredGame.description}
          </p>

          {/* Price & Actions */}
          <div 
            className="flex flex-wrap items-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-baseline gap-3">
              {featuredGame.originalPrice && (
                <span className="text-xl text-muted-foreground line-through font-body">
                  {formatPrice(featuredGame.originalPrice)}
                </span>
              )}
              <span className="text-4xl font-display font-bold text-foreground">
                {formatPrice(featuredGame.price)}
              </span>
            </div>
            
            {isOwned ? (
              <Button 
                variant="outline" 
                size="xl" 
                className="gap-3 bg-green-500/20 border-green-500/50 text-green-500 hover:bg-green-500/30"
                disabled
              >
                <CheckCircle2 className="w-5 h-5" />
                이미 구매한 게임
              </Button>
            ) : (
              <Button 
                variant={isInCart ? "outline" : "neon"} 
                size="xl" 
                className="gap-3"
                onClick={() => addToCart(featuredGame)}
                disabled={isInCart}
              >
                <Plus className="w-5 h-5" />
                {isInCart ? "이미 담김" : "장바구니 담기"}
              </Button>
            )}

            {!isOwned && (
              <Button
                variant="default"
                size="xl"
                className="gap-3"
                onClick={handleBuyNow}
                disabled={isProcessing}
              >
                <ShoppingBag className="w-5 h-5" />
                {isProcessing ? "처리 중..." : "구매하기"}
              </Button>
            )}

            <Button variant="outline" size="xl" className="gap-3">
              <Play className="w-5 h-5" />
              트레일러 보기
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block animate-float">
        <div className="w-64 h-64 rounded-full bg-neon-cyan/10 blur-3xl" />
      </div>
      <div className="absolute top-1/3 right-1/4 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-32 h-32 rounded-full bg-neon-magenta/10 blur-2xl" />
      </div>
    </section>
  );
};

export default HeroSection;
