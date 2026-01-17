import { loadTossPayments } from "@tosspayments/sdk";

const CLIENT_KEY = "test_ck_KNbdOvk5rkWX19R4L5Knrn07xlzm";

let tossPaymentsPromise: ReturnType<typeof loadTossPayments> | null = null;

const getTossPayments = () => {
  if (!tossPaymentsPromise) {
    tossPaymentsPromise = loadTossPayments(CLIENT_KEY);
  }
  return tossPaymentsPromise;
};

interface RequestPaymentOptions {
  amount: number;
  orderName: string;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
}

const buildOrderId = () => {
  return `VORTEX-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const requestPayment = async ({
  amount,
  orderName,
  orderId,
  customerEmail,
  customerName,
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
    successUrl: `${baseUrl}/payment/success`,
    failUrl: `${baseUrl}/payment/fail`,
  });
};

