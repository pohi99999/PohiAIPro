#!/usr/bin/env node
// Simple check that firebase-admin can initialize using GOOGLE_APPLICATION_CREDENTIALS
(async function(){
  try{
    if(!process.env.GOOGLE_APPLICATION_CREDENTIALS){
      console.error('ERROR: Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path');
      process.exit(1);
    }
    const admin = await import('firebase-admin');
    admin.initializeApp();
    const db = admin.firestore();
    const collections = await db.listCollections();
    console.log('Connected to Firestore. Collections (first 10):', collections.slice(0,10).map(c=>c.id));
    process.exit(0);
  }catch(e){
    console.error('firebase-admin check failed:', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
