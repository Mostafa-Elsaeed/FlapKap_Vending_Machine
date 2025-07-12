export const authConfig = () => ({
  auth: {
    authSecret: process.env.AUTH_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  },
});
