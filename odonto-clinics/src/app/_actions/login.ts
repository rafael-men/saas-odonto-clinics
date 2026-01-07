'use server'

import { signIn } from "@/lib/auth";

export async function login(provider: string) {
  await signIn(provider,{redirectTo: '/dashboard'});
}