import type { Config } from "@react-router/dev/config";

export default {
  // Disable SSR for static SPA deployment on Vercel/Netlify
  ssr: false,
} satisfies Config;

