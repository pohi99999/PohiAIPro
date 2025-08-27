import React from 'react';
import { useGooglePicker } from '../../lib/hooks';

// TODO: Replace with your actual Google Cloud project credentials
const DEVELOPER_KEY = 'YOUR_DEVELOPER_KEY';
const CLIENT_ID = 'YOUR_CLIENT_ID';

const AdminDocumentsPage: React.FC = () => {
  const onPicked = (data: any) => {
    if (data.action === 'picked') {
      const doc = data.docs[0];
      alert(`Document picked: ${doc.name}`);
      // TODO: Handle the picked document (e.g., save to Firestore)
    }
  };

  const { handleAuthClick } = useGooglePicker({
    developerKey: DEVELOPER_KEY,
    clientId: CLIENT_ID,
    onPicked,
  });

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
