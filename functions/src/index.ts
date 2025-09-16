import {setGlobalOptions} from "firebase-functions/v2";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as express from "express";
import {getFirestore} from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = getFirestore();

// Set global options for all functions
setGlobalOptions({region: "europe-west1"});

const app = express();

// Middleware for CORS
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a new agent task
app.post("/agent-task", async (req, res) => {
  logger.info("Received request to create agent task", {body: req.body});

  // eslint-disable-next-line camelcase
  const {task_type, payload} = req.body;

  // eslint-disable-next-line camelcase
  if (!task_type || !payload) {
    logger.error("Validation failed: task_type and payload are required.", {
      body: req.body,
    });
    res.status(400).json({error: "task_type and payload are required."});
    return;
  }

  try {
    const taskRef = await db.collection("agentTasks").add({
      // eslint-disable-next-line camelcase
      task_type,
      payload,
      status: "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info(`Successfully created task ${taskRef.id}`);
    res.status(201).json({task_id: taskRef.id});
  } catch (error) {
    logger.error("Error creating task in Firestore:", {error});
    res.status(500).json({error: "Failed to create task."});
  }
});

// Route to get the status of an agent task
app.get("/agent-task-status/:taskId", async (req, res) => {
  const {taskId} = req.params;
  logger.info(`Received request for task status: ${taskId}`);

  if (!taskId) {
    res.status(400).json({error: "Task ID is required."});
    return;
  }

  try {
    const taskDoc = await db.collection("agentTasks").doc(taskId).get();

    if (!taskDoc.exists) {
      logger.warn(`Task not found: ${taskId}`);
      res.status(404).json({error: "Task not found."});
      return;
    }

    const taskData = taskDoc.data();
    logger.info(`Returning status for task ${taskId}`, {
      status: taskData?.status,
    });

    res.status(200).json({
      task_id: taskDoc.id,
      status: taskData?.status || "UNKNOWN",
      result: taskData?.result || null,
      error: taskData?.error || null,
      updatedAt: taskData?.updatedAt,
    });
  } catch (error) {
    logger.error(`Error fetching task ${taskId}:`, {error});
    res.status(500).json({error: "Failed to retrieve task status."});
  }
});

// Export the Express app as a single Cloud Function
export const api = onRequest(app);

// Export auth triggers
export * from "./auth";
