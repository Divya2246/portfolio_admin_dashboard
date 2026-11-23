import { logEvent as firebaseLogEvent, type Analytics } from 'firebase/analytics';
import { getFirebaseAnalytics } from '../config';

export function logEvent(eventName: string, params?: Record<string, unknown>): void {
  const analytics = getFirebaseAnalytics();
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
}

export function getAnalyticsInstance(): Analytics | null {
  return getFirebaseAnalytics();
}
