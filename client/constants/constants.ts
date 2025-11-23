const LOCAL = {
  PAYMENT: "http://localhost:4003",
  ORDER: "http://localhost:4002",
  AUTH: "http://localhost:4000",
  PRODUCT: "http://localhost:4001",
};

const PROD = {
  PAYMENT: "https://payment-service-itru.onrender.com",
  ORDER: "https://soundio-nfng.onrender.com",
  AUTH: "https://soundio.onrender.com",
  PRODUCT: "https://product-service-fsp5.onrender.com",
};

const BASE = process.env.NODE_ENV === "production" ? PROD : LOCAL;

export const PAYMENT_BASE_URL = BASE.PAYMENT;
export const ORDER_BASE_URL = BASE.ORDER;
export const AUTH_BASE_URL = BASE.AUTH;
export const PRODUCT_BASE_URL = BASE.PRODUCT;
