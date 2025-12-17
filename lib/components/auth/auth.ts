import { betterAuth } from 'better-auth';
import { Pool } from '@neondatabase/serverless';

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),
  experimental: {
    joins: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Remove or simplify these to reduce token size
      // accessType: "offline",
      // prompt: "select_account consent",
    },
  },
  // Add this to reduce cookie/header size
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});
