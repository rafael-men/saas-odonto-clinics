'use server'

import { signIn } from "@/lib/auth";

export async function login(provider: string) {
  await signIn(provider, { redirectTo: '/dashboard' });
}

export async function loginWithCredentials(email: string, password: string) {
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error: any) {
    if (error?.type === 'CredentialsSignin') {
      return { error: 'Email ou senha inválidos' };
    }
    throw error;
  }
}
