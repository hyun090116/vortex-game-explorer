import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_FUNCTION_URL =
  import.meta.env.VITE_SUPABASE_FUNCTION_URL?.replace(/\/$/, "") ||
  "https://qqmcbmpuexduxglvhcvu.functions.supabase.co";

type ConfirmStatus = "idle" | "loading" | "success" | "error";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useAuth();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amountParam = searchParams.get("amount");
  const amount = useMemo(
    () => (amountParam ? Number(amountParam) : undefined),
    [amountParam],
  );

  const [confirmStatus, setConfirmStatus] = useState<ConfirmStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setErrorMessage("결제 정보가 누락되었습니다. 다시 시도해주세요.");
      setConfirmStatus("error");
      return;
    }

    let isMounted = true;

    const confirmPayment = async () => {
      setConfirmStatus("loading");
      setErrorMessage(null);

      try {
        const response = await fetch(`${DEFAULT_FUNCTION_URL}/approve-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
            customerEmail: user?.email,
            customerName:
              (user?.user_metadata as { full_name?: string } | undefined)
                ?.full_name ?? user?.email,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(
            errorBody?.message ||
              "결제 승인을 완료할 수 없습니다. 관리자에게 문의해주세요.",
          );
        }

        if (!isMounted) return;

        setConfirmStatus("success");
        clearCart();
      } catch (error) {
        if (!isMounted) return;
        setConfirmStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "결제 승인 처리 중 오류가 발생했습니다.",
        );
      }
    };

    confirmPayment();

    return () => {
      isMounted = false;
    };
  }, [paymentKey, orderId, amount, user, clearCart]);

  const renderStatusMessage = () => {
    if (confirmStatus === "loading") {
      return (
        <div className="mt-6 inline-flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          결제 승인 처리 중입니다...
        </div>
      );
    }

    if (confirmStatus === "error" && errorMessage) {
      return (
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-destructive font-medium">{errorMessage}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            이전 페이지로 돌아가기
          </Button>
        </div>
      );
    }

    return null;
  };

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
            {amount ? new Intl.NumberFormat("ko-KR").format(amount) + "원" : "-"}
          </p>

          {renderStatusMessage()}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="neon"
              size="lg"
              onClick={() => navigate("/library")}
              disabled={confirmStatus === "loading"}
            >
              라이브러리로 이동
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
              disabled={confirmStatus === "loading"}
            >
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

