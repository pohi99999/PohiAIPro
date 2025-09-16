import functions from "firebase-functions";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Creates a new agent task.
 * This function is triggered by an HTTP POST request.
 */
export const createAgentTask = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { task_type, payload } = req.body;

    if (!task_type || !payload) {
      return res.status(400).send("Bad Request: Missing task_type or payload.");
    }

    const taskId = `${task_type.toLowerCase()}-task-${uuidv4()}`;

    const taskData = {
      taskId,
      task_type,
      status: "PENDING",
      payload,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      result: null,
      error: null,
    };

    await db.collection("agent_tasks").doc(taskId).set(taskData);

    return res.status(202).json({ task_id: taskId });
  } catch (error) {
    console.error("Error creating agent task:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Gets the status of an agent task.
 * This function is triggered by an HTTP GET request.
 */
export const getAgentTaskStatus = functions.https.onRequest(
  async (req, res) => {
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      // The task_id is expected to be the last part of the path
      const pathParts = req.path.split("/");
      const taskId = pathParts.pop() || "";

      if (!taskId) {
        return res.status(400).send("Bad Request: Missing task_id in URL.");
      }

      const taskDoc = await db.collection("agent_tasks").doc(taskId).get();

      if (!taskDoc.exists) {
        return res
          .status(404)
          .send("Not Found: No task found with the given ID.");
      }

      return res.status(200).json(taskDoc.data());
    } catch (error) {
      console.error("Error getting agent task status:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
);
