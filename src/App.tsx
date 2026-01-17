import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { initSmoothScroll, scrollToHashOnLoad } from "@/utils/smoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Community from "./pages/Community";
import News from "./pages/News";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";

const queryClient = new QueryClient();

// 부드러운 스크롤을 처리하는 컴포넌트
const SmoothScrollHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // 부드러운 스크롤 초기화
    const cleanup = initSmoothScroll(80);

    // 페이지 로드 시 해시가 있으면 스크롤
    scrollToHashOnLoad(80);

    // 라우트 변경 시 해시가 있으면 스크롤
    if (location.hash) {
      setTimeout(() => {
        scrollToHashOnLoad(80);
      }, 100);
    }

    return cleanup;
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SmoothScrollHandler />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/community" element={<Community />} />
              <Route path="/news" element={<News />} />
              <Route path="/search" element={<Search />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/fail" element={<PaymentFail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
