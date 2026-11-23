import { serverTimestamp } from 'firebase/firestore';
import { addDocument, getCollection, where, orderBy, limit } from './firestore.service';

const COLLECTION = 'contactSubmissions';

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactSubmission extends ContactSubmissionPayload {
  id?: string;
  portfolioUserId: string;
  createdAt?: unknown; // Firestore Timestamp
}

/** Submit a contact form message for a portfolio owner. Call from preview/public portfolio. */
export async function submitContactMessage(
  portfolioUserId: string,
  payload: ContactSubmissionPayload
): Promise<string> {
  const data = {
    portfolioUserId,
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
    createdAt: serverTimestamp(),
  };
  return addDocument(COLLECTION, data);
}

/** Fetch contact form submissions for a portfolio owner (e.g. to show in dashboard). */
export async function getContactSubmissions(portfolioUserId: string): Promise<ContactSubmission[]> {
  return getCollection<ContactSubmission & { id: string }>(
    COLLECTION,
    where('portfolioUserId', '==', portfolioUserId),
    orderBy('createdAt', 'desc'),
    limit(200)
  );
}
