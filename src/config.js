export const API_BASE  = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const WS_URL    = import.meta.env.VITE_WS_URL || "ws://localhost:3001";
export const COGNITO   = {
  region:     import.meta.env.VITE_COGNITO_REGION     || "us-east-1",
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "",
  clientId:   import.meta.env.VITE_COGNITO_CLIENT_ID  || "",
};
