import rateLimit from "express-rate-limit";
// Apply to all requests
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." }
});