import {onUserCreated} from "firebase-functions/v2/auth";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

/**
 * Handles the creation of a new user.
 * 1. Sets a default custom claim 'customer' for role-based access control.
 * 2. Creates a user profile document in Firestore.
 */
export const handleNewUser = onUserCreated(async (event) => {
  const user = event.data;
  const {uid, email} = user;

  // 1. Set custom claim
  const defaultRole = "customer";
  try {
    await admin.auth().setCustomUserClaims(uid, {role: defaultRole});
    logger.info(`Custom claim '${defaultRole}' set for user ${uid}`);
  } catch (error) {
    logger.error(`Failed to set custom claim for user ${uid}`, {error});
    // We might want to stop here if claims are critical
    return;
  }

  // 2. Create user profile in Firestore
  const userProfile = {
    email: email || null,
    role: defaultRole,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    const db = admin.firestore();
    await db.collection("users").doc(uid).set(userProfile);
    logger.info(`Firestore profile created for user ${uid}`);
  } catch (error) {
    logger.error(`Failed to create Firestore profile for user ${uid}`, {
      error,
    });
  }
});
