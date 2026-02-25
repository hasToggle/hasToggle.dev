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
