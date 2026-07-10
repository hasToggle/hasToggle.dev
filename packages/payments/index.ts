import "server-only";
import Stripe from "stripe";
import { keys } from "./keys";

// No pinned apiVersion: the SDK defaults to the exact version its types
// target, so Renovate bumps of `stripe` cannot desync the two again.
export const stripe = new Stripe(keys().STRIPE_SECRET_KEY);

export type { Stripe } from "stripe";
