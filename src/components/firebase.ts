import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, getDocFromServer, collection, addDoc } from 'firebase/firestore';

// Load local Firebase config
import firebaseConfig from '../../firebase-applet-config.json';

const isPlaceholder = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('placeholder');

let app;
let db: any = null;
let auth: any = null;

if (!isPlaceholder) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { db, auth, isPlaceholder };

async function testConnection() {
  if (isPlaceholder || !db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function saveDocument(collectionPath: string, docId: string, data: any) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString() // local backup string
  };

  if (isPlaceholder || !db) {
    console.warn(`Firestore is currently not provisioned. Mocking save for ${collectionPath}/${docId}:`, payload);
    const localKey = `offline_${collectionPath}`;
    try {
      const stored = JSON.parse(localStorage.getItem(localKey) || '[]');
      stored.push(payload);
      localStorage.setItem(localKey, JSON.stringify(stored));
    } catch (e) {
      console.error('Fallback store error', e);
    }
    return;
  }

  try {
    const colRef = collection(db, collectionPath);
    await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/(auto-id)`);
  }
}
