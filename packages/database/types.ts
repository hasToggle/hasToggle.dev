import type { ObjectId } from "mongodb";

export interface Digest {
  _id: ObjectId;
  content: string;
  createdAt: Date;
  misconception: string;
  scheduledFor: Date | null;
  sentAt: Date | null;
  series?: {
    name: string;
    part: number;
  };
  status: "draft" | "scheduled" | "sent";
  title: string;
  updatedAt: Date;
}

export interface Subscriber {
  _id: string;
  createdAt: Date | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  name: string | null;
  role: string;
  token: string | null;
  tokenExpiresAt: Date | null;
  /**
   * Durable per-subscriber capability minted at confirmation, stored in
   * the clear on purpose: digest senders must be able to render each
   * recipient's unsubscribe link, and the token grants nothing but
   * removal from the list.
   */
  unsubscribeToken: string | null;
}

export type SubscriberInsert = Omit<
  Subscriber,
  "role" | "createdAt" | "emailVerified" | "image" | "name" | "unsubscribeToken"
> & {
  role?: string;
  createdAt?: Date | null;
  emailVerified?: Date | null;
  image?: string | null;
  name?: string | null;
  unsubscribeToken?: string | null;
};
