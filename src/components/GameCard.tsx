import { useRef, useState } from "react";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import type { Game } from "@/data/games";

interface GameCardProps {
  game: Game;
  index?: number;
  showCartButton?: boolean;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

const GameCard = ({ game, index = 0, showCartButton = true }: GameCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, cartItems } = useCart();
  
  const isInCart = cartItems.some(item => item.id === game.id);
  
  // 이미지 로드 실패 시 대체 이미지
  const imageUrl = imageError 
    ? `https://via.placeholder.com/800x1200/1a1a1a/ffffff?text=${encodeURIComponent(game.title)}`
    : game.coverImage;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / (rect.width / 2)) * 15;
    const rotateX = -(mouseY / (rect.height / 2)) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const discount = game.originalPrice 
    ? Math.round((1 - game.price / game.originalPrice) * 100)
    : null;

  return (
    <div
      ref={cardRef}
      className="group relative holographic-card animate-fade-in"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow Effect */}
      <div 
        className="card-glow"
        style={{ opacity: isHovered ? 0.3 : 0 }}
      />
      
      {/* Card Content */}
      <div className="glass-card overflow-hidden relative">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={imageUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Holographic Shine */}
          <div 
            className="holographic-shine"
            style={{ 
              opacity: isHovered ? 1 : 0,
              transform: `translateX(${rotation.y * 10}px)`,
            }}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-accent text-accent-foreground text-xs font-display font-bold">
              -{discount}%
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded glass">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-xs font-display font-bold">{game.rating}</span>
          </div>
          
          {/* Quick Add Button */}
          {showCartButton && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Button 
                variant={isInCart ? "outline" : "neon"} 
                className="w-full gap-2" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(game);
                }}
                disabled={isInCart}
              >
                <Plus className="w-4 h-4" />
                {isInCart ? "이미 담김" : "장바구니 담기"}
              </Button>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {game.genre.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                to={`/search?genre=${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-body font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {tag}
                {game.genre.indexOf(tag) < Math.min(game.genre.length - 1, 1) && " •"}
              </Link>
            ))}
          </div>
          
          <h3 className="font-display font-bold text-lg mb-3 line-clamp-1 group-hover:text-primary transition-colors">
            {game.title}
          </h3>
          
          <div className="flex items-center gap-2">
            {game.originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-body">
                {formatPrice(game.originalPrice)}
              </span>
            )}
            <span className="text-xl font-display font-bold text-foreground">
              {formatPrice(game.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
