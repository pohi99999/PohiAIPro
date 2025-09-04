import React, { useCallback } from 'react';
import { useGooglePicker } from '../../lib/hooks';

// IMPORTANT: These values must be set in your .env.local file
// VITE_GOOGLE_DEVELOPER_KEY=your_developer_key
// VITE_GOOGLE_CLIENT_ID=your_client_id
const DEVELOPER_KEY = import.meta.env.VITE_GOOGLE_DEVELOPER_KEY as string;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const AdminDocumentsPage: React.FC = () => {
  const onPicked = useCallback((data: any) => {
    if (data.action === 'picked') {
      const doc = data.docs[0];
      alert(`Document picked: ${doc.name}`);
      // TODO: Handle the picked document (e.g., save to Firestore)
      console.log('Picked document:', doc);
    }
  }, []);

  const { handleAuthClick } = useGooglePicker({
    developerKey: DEVELOPER_KEY,
    clientId: CLIENT_ID,
    onPicked,
  });

  if (!DEVELOPER_KEY || !CLIENT_ID) {
    return (
      <div>
        <h1>Document Management</h1>
        <p className="text-red-500">
          Google API keys are not configured. Please set VITE_GOOGLE_DEVELOPER_KEY and VITE_GOOGLE_CLIENT_ID in your .env.local file.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Document Management</h1>
      <p>Import and manage documents from Google Drive.</p>
      <button onClick={handleAuthClick}>
        Import from Google Drive
      </button>
    </div>
  );
};

export default AdminDocumentsPage;
