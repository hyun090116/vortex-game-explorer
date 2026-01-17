import { loadTossPayments } from "@tosspayments/sdk";

const FALLBACK_CLIENT_KEY = "test_ck_KNbdOvk5rkWX19R4L5Knrn07xlzm";

const clientKey =
  import.meta.env.VITE_TOSS_CLIENT_KEY?.trim() || FALLBACK_CLIENT_KEY;

let tossPaymentsPromise: ReturnType<typeof loadTossPayments> | null = null;

const getTossPayments = () => {
  if (!clientKey) {
    throw new Error("토스페이먼츠 클라이언트 키가 설정되지 않았습니다.");
  }

  if (!tossPaymentsPromise) {
    tossPaymentsPromise = loadTossPayments(clientKey);
  }

  return tossPaymentsPromise;
};

interface RequestPaymentOptions {
  amount: number;
  orderName: string;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  successUrl?: string;
  failUrl?: string;
}

const buildOrderId = () => {
  const random =
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return `VORTEX-${Date.now()}-${random}`;
};

export const requestTossPayment = async ({
  amount,
  orderName,
  orderId,
  customerEmail,
  customerName,
  successUrl,
  failUrl,
}: RequestPaymentOptions) => {
  if (amount <= 0) {
    throw new Error("결제 금액이 올바르지 않습니다.");
  }

  const tossPayments = await getTossPayments();
  const baseUrl = window.location.origin;

  return tossPayments.requestPayment("CARD", {
    amount,
    orderId: orderId || buildOrderId(),
    orderName,
    customerEmail,
    customerName,
    successUrl: successUrl || `${baseUrl}/payment/success`,
    failUrl: failUrl || `${baseUrl}/payment/fail`,
  });
};


