import admin from 'firebase-admin';
import creds from '../../../../gcpcreds.json' assert { type: 'json' };

export const app = admin.initializeApp({
	credential: admin.credential.cert(creds as admin.ServiceAccount)
});
