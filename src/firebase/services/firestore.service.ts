import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config';

export async function getDocument<T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const ref = doc(db, collectionName, documentId);
  const snap = await getDoc(ref);
  return (snap.exists() ? { id: snap.id, ...snap.data() } : null) as T | null;
}

export async function getCollection<T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const ref = collection(db, collectionName);
  const q = constraints.length ? query(ref, ...constraints) : ref;
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

export async function setDocument(
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, collectionName, documentId), data);
}

export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not initialized');
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
}

export async function updateDocument(
  collectionName: string,
  documentId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, collectionName, documentId), data);
}

export async function deleteDocument(collectionName: string, documentId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, collectionName, documentId));
}

// Re-export common constraint builders for convenience
export { where, orderBy, limit };
