import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };
export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

export function err<E>(error: E) {
  return { ok: false, error } as const;
}

export async function optimistic<T>(
  applyLocal: () => void,
  rollback: () => void,
  performRemote: () => Promise<{ ok: boolean; data?: T; error?: string }>
): Promise<T | null> {
  applyLocal();
  // const result = await performRemote();
  // if (!result.ok) {
  //   rollback();
  //   return null;
  // }
  // return result.data ?? null;
  // return blank until remote is ready
  return null;
}
