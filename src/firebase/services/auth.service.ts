import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type User,
  type UserCredential,
  type ConfirmationResult,
} from 'firebase/auth';
import { getFirebaseAuth } from '../config';

export type { ConfirmationResult };

export async function signIn(email: string, password: string): Promise<UserCredential | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string): Promise<UserCredential | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await sendPasswordResetEmail(auth, email);
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) await firebaseSignOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): (() => void) | null {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  const unsubscribe = onAuthStateChanged(auth, callback);
  return () => unsubscribe();
}

/** Create reCAPTCHA verifier for phone auth. Container must exist in DOM and be empty. */
export function createRecaptchaVerifier(containerIdOrElement: string | HTMLElement): RecaptchaVerifier | null {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  return new RecaptchaVerifier(auth, containerIdOrElement, {
    size: 'invisible',
    callback: () => {},
  });
}

export async function sendPhoneVerificationCode(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export async function verifyPhoneCode(confirmationResult: ConfirmationResult, code: string): Promise<UserCredential | null> {
  return confirmationResult.confirm(code);
}
