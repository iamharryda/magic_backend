import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment');
}

// Omitting apiVersion uses your account default. Pin one in production once
// tested, e.g. { apiVersion: '2024-06-20' }.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const CURRENCY = process.env.CURRENCY || 'usd';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/** Stripe works in the smallest currency unit (cents): 25.00 -> 2500. */
export const toMinorUnits = (amount) => Math.round(Number(amount) * 100);