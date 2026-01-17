import { useEffect, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qqmcbmpuexduxglvhcvu.supabase.co";
const FUNCTION_URL = SUPABASE_URL.replace(".supabase.co", ".functions.supabase.co") + "/payments";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const processedRef = useRef(false);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount || !user?.id || processedRef.current) {
      return;
    }

    processedRef.current = true;

    const confirmPayment = async () => {
      try {
        // sessionStorage에서 게임 정보 복원
        const storedGameInfos = sessionStorage.getItem("pending_gameInfos");
        if (!storedGameInfos) {
          console.error("게임 정보를 찾을 수 없습니다.");
          return;
        }

        const gameInfos = JSON.parse(storedGameInfos);

        // Supabase 세션에서 토큰 가져오기
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // 토큰이 있으면 Authorization 헤더 추가
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(FUNCTION_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            userId: user.id,
            gameInfos,
            customerEmail: user.email,
            customerName: user.email,
          }),
        });

        if (response.ok) {
          clearCart();
          sessionStorage.removeItem("pending_gameInfos");
        } else {
          const errorData = await response.json();
          console.error("결제 승인 실패:", errorData);
        }
      } catch (error) {
        console.error("결제 처리 오류:", error);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount, user, clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-4 font-display text-4xl font-bold gradient-text">
            결제가 완료되었습니다
          </h1>
          <p className="mb-6 text-muted-foreground">
            주문 번호: {orderId || "-"}
            <br />
            결제 금액: {amount ? new Intl.NumberFormat("ko-KR").format(Number(amount)) + "원" : "-"}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="neon" size="lg" onClick={() => navigate("/library")}>
              라이브러리로 이동
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/")}>
              홈으로
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;

