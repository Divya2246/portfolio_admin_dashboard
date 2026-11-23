import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from '../config';

export async function uploadPortfolioFile(file: File, pathPrefix = 'portfolio'): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage is not configured');
  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const path = `${pathPrefix}/${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytesResumable(storageRef, file);
  return getDownloadURL(storageRef);
}

export function getFileTypeFromFile(file: File): 'image' | 'pdf' | 'video' {
  const t = file.type.toLowerCase();
  if (t.startsWith('image/')) return 'image';
  if (t === 'application/pdf') return 'pdf';
  if (t.startsWith('video/')) return 'video';
  if (file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'image';
}
