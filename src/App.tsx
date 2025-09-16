import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import AdminDocumentsPage from "../pages/admin/AdminDocumentsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Home</h1>
        <Link to="/admin/documents">Admin Documents</Link>
      </div>
    ),
  },
  {
    path: "/admin/documents",
    element: <AdminDocumentsPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
