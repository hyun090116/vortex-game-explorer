import { AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="mb-4 font-display text-4xl font-bold text-destructive">
            결제가 실패했습니다
          </h1>
          <p className="mb-2 text-muted-foreground">오류 코드: {code || "-"}</p>
          <p className="mb-6 text-muted-foreground">{message || "다시 시도해주세요."}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="neon" size="lg" onClick={() => navigate("/")}>
              홈으로
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
              이전 페이지로
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFail;

