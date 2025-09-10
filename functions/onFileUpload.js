import functions from "firebase-functions";
import admin from "firebase-admin";
import { GoogleAuth } from "google-auth-library";
import * as genai from "@google/genai";

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Initialize Gemini
const genAI = new genai.GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const processFileUpload = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  // Exit if this is triggered on a file that is not a PDF.
  if (!contentType.startsWith("application/pdf")) {
    return functions.logger.log("This is not a PDF.");
  }

  // Get the file
  const bucket = admin.storage().bucket(fileBucket);
  const file = bucket.file(filePath);
  const [fileBuffer] = await file.download();

  // Call Gemini API
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = "Extract all text from this PDF document.";

  const imageParts = [
    {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: "application/pdf"
      }
    }
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Save the extracted text to Firestore
    const fileName = filePath.split("/").pop();
    const docId = fileName.replace(".pdf", "");
    const firestore = admin.firestore();
    await firestore.collection("processedDocuments").doc(docId).set({
      originalPath: filePath,
      extractedText: text,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return functions.logger.log(`Text extracted from ${fileName} and saved to Firestore.`);

  } catch (error) {
    return functions.logger.error("Error processing file with Gemini:", error);
  }
});
