import { Search, ShoppingCart, User, Menu, X, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { requestPayment } from "@/lib/tossPayments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { user, signOut } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      setIsCartOpen(false);
      return;
    }

    if (cartItems.length === 0 || isProcessing) {
      return;
    }

    const totalAmount = getTotalPrice();
    if (totalAmount <= 0) {
      return;
    }

    setIsProcessing(true);
    try {
      // 장바구니의 모든 게임 정보 저장
      const gameInfos = cartItems.map((item) => ({
        title: item.title,
        developer: item.developer,
        description: item.description,
        coverImage: item.coverImage,
        releaseDate: item.releaseDate,
        genre: item.genre,
        rating: item.rating,
        price: item.price,
      }));

      sessionStorage.setItem("pending_gameInfos", JSON.stringify(gameInfos));

      const orderName =
        cartItems.length > 1
          ? `${cartItems[0].title} 외 ${cartItems.length - 1}건`
          : cartItems[0].title;

      await requestPayment({
        amount: totalAmount,
        orderName,
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-lg">V</span>
            </div>
            <span className="font-display font-bold text-xl tracking-wider gradient-text hidden sm:block">
              VORTEX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" active={location.pathname === "/"}>스토어</NavLink>
            <NavLink to="/library" active={location.pathname === "/library"}>라이브러리</NavLink>
            <NavLink to="/community" active={location.pathname === "/community"}>커뮤니티</NavLink>
            <NavLink to="/news" active={location.pathname === "/news"}>뉴스</NavLink>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchClick}
              className="relative"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>장바구니</SheetTitle>
                  <SheetDescription>
                    장바구니에 담긴 게임 목록입니다.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">장바구니가 비어있습니다</p>
                      <Button 
                        variant="neon" 
                        className="mt-4"
                        onClick={() => {
                          setIsCartOpen(false);
                          window.location.href = '/';
                        }}
                      >
                        쇼핑하러 가기
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-4 p-4 glass rounded-lg border border-glass-border/30"
                          >
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-20 h-28 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-display font-bold text-lg mb-1">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.developer}
                              </p>
                              <p className="font-display font-bold text-lg">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-glass-border/30 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-display font-bold text-xl">총 금액</span>
                          <span className="font-display font-bold text-2xl text-primary">
                            {formatPrice(getTotalPrice())}
                          </span>
                        </div>
                        <Button 
                          variant="neon" 
                          className="w-full" 
                          size="lg"
                          onClick={handleCheckout}
                          disabled={isProcessing || cartItems.length === 0}
                        >
                          {isProcessing ? "처리 중..." : "구매하기"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <User className="w-4 h-4 mr-2" />
                    마이페이지
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">계정</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/mypage')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>마이페이지</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="hidden sm:flex"
              >
                로그인
              </Button>
            )}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/mypage')}
                className="sm:hidden"
              >
                <User className="w-5 h-5" />
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-glass-border/20 animate-fade-in">
            <div className="flex flex-col gap-2">
              <NavLink to="/" active={location.pathname === "/"}>스토어</NavLink>
              <NavLink to="/library" active={location.pathname === "/library"}>라이브러리</NavLink>
              <NavLink to="/community" active={location.pathname === "/community"}>커뮤니티</NavLink>
              <NavLink to="/news" active={location.pathname === "/news"}>뉴스</NavLink>
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate("/search");
                  setIsMenuOpen(false);
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start text-left"
                    onClick={() => {
                      navigate("/mypage");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    마이페이지
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-left"
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="justify-start text-left"
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

const NavLink = ({ 
  to, 
  children, 
  active = false 
}: { 
  to: string; 
  children: React.ReactNode; 
  active?: boolean;
}) => (
  <Link
    to={to}
    className={`font-body font-medium text-sm uppercase tracking-wider transition-colors py-2 ${
      active 
        ? "text-primary neon-text" 
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
