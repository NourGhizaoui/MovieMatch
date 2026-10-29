import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

export const fbApp = initializeApp(environment.firebase);
export const auth = getAuth(fbApp);
export const db = getFirestore(fbApp);
