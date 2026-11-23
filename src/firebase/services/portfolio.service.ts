import { serverTimestamp } from 'firebase/firestore';
import { getDocument, setDocument, deleteDocument } from './firestore.service';
import type { PortfolioData } from '../../redux/slices/portfolioSlice';

const COLLECTION = 'portfolios';

/** Firestore does not allow undefined. Remove undefined so setDoc succeeds. */
function stripUndefined<T>(value: T): T {
  if (value === undefined) return null as T;
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as T;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v === undefined) continue;
    out[k] = stripUndefined(v);
  }
  return out as T;
}

export async function getPortfolio(userId: string): Promise<PortfolioData | null> {
  const doc = await getDocument<PortfolioData & { id?: string; updatedAt?: unknown }>(COLLECTION, userId);
  if (!doc) return null;
  const { id: _id, updatedAt: _updatedAt, ...data } = doc;
  return data as PortfolioData;
}

export async function setPortfolioDoc(userId: string, data: PortfolioData): Promise<void> {
  const cleaned = stripUndefined({
    ...data,
    updatedAt: serverTimestamp(),
  });
  await setDocument(COLLECTION, userId, cleaned as PortfolioData & { updatedAt: unknown });
}

export async function deletePortfolioDoc(userId: string): Promise<void> {
  await deleteDocument(COLLECTION, userId);
}
