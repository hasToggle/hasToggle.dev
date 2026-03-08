import type { ObjectId } from "mongodb";

export interface Digest {
  _id: ObjectId;
  title: string;
  misconception: string;
  content: string;
  series?: {
    name: string;
    part: number;
  };
  status: "draft" | "scheduled" | "sent";
  sentAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
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
}

export type SubscriberInsert = Omit<
  Subscriber,
  "role" | "createdAt" | "emailVerified" | "image" | "name"
> & {
  role?: string;
  createdAt?: Date | null;
  emailVerified?: Date | null;
  image?: string | null;
  name?: string | null;
};
