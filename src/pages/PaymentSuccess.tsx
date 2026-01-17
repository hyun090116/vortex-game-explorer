import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
            주문 번호 {orderId || "-"} / 결제 금액{" "}
            {amount ? new Intl.NumberFormat("ko-KR").format(Number(amount)) + "원" : "-"}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="neon" size="lg" onClick={() => navigate("/library")}>
              라이브러리로 이동
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/")}>
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;


