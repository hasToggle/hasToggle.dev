import { redirect } from "next/navigation";
import { LATEST } from "../lab/syllabus";

/**
 * /latest always points at the newest shipped chapter — a stable handle
 * for waitlist updates and for anyone sharing "whatever landed last".
 * The registry decides where it goes; shipping a chapter moves it.
 */
export function GET(): never {
  redirect(`/lab/${LATEST.slug}`);
}
