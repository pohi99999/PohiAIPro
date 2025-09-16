import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

// IMPORTANT: You need to download your Firebase service account key JSON file
// and place it in the project root.
// DO NOT COMMIT THIS FILE TO GIT.
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// --- Mock Data ---
// Using readFileSync to load the JSON data.
const mockProducts = JSON.parse(
  readFileSync("./exports/mock-products.json", "utf-8"),
);

// --- Firebase Admin SDK Initialization ---
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
console.log("Firebase Admin SDK initialized.");

// --- Data Migration Logic ---
async function migrateStockItems() {
  console.log("Starting stockItems migration...");
  const stockCollection = db.collection("stockItems");
  let migratedCount = 0;

  for (const product of mockProducts) {
    try {
      // Use the product 'id' from the JSON as the document ID in Firestore
      const docRef = stockCollection.doc(product.id);

      // Map the JSON data to the StockItem structure from types.ts
      const stockItem = {
        id: product.id,
        productName: product.name,
        price: String(product.price), // Convert price to string as in the type definition
        status: "Available", // Set a default status
        uploadDate: new Date().toISOString(),
        // Add other fields with default values as needed based on StockItem interface
        diameterType: "Unknown",
        diameterFrom: "0",
        diameterTo: "0",
        length: "0",
        quantity: "0",
      };

      await docRef.set(stockItem);
      console.log(
        `Successfully migrated product: ${product.name} (ID: ${product.id})`,
      );
      migratedCount++;
    } catch (error) {
      console.error(`Error migrating product ${product.name}:`, error);
    }
  }

  console.log(
    `\nMigration complete. Migrated ${migratedCount} out of ${mockProducts.length} products.`,
  );
}

// --- Execution ---
// Check for a dry-run flag
const isDryRun = process.argv.includes("--dry-run");

if (isDryRun) {
  console.log("--- DRY RUN ---");
  console.log("This script would attempt to migrate the following data:");
  console.log(JSON.stringify(mockProducts, null, 2));
  console.log("No actual data will be written to Firestore.");
} else {
  migrateStockItems().catch(console.error);
}
