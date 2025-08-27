// @ts-nocheck
/**
 * Sample Cloud Function (Node/TypeScript) to set default user role on new user creation.
 * This file is a template — place it under functions/src in a Firebase Functions project and adjust imports.
 */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Option A: write a users/{uid} document with role
export const onUserCreate_writeProfile = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();
  const role = 'customer'; // default
  await db.collection('users').doc(user.uid).set({
    email: user.email || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    role,
  }, { merge: true });
});

// Option B: set a custom claim (requires elevated permissions to read client-side)
export const onUserCreate_setCustomClaim = functions.auth.user().onCreate(async (user) => {
  const defaultRole = 'customer';
  try {
    await admin.auth().setCustomUserClaims(user.uid, { role: defaultRole });
  } catch (e) {
    console.error('Failed to set custom claim for user', user.uid, e);
  }
});
