// pages/admin/index.js
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPanel({ adminData }) {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        {/* Render admin dashboard content here */}
        <p>Welcome to the admin dashboard. Here is some secured admin data:</p>
        <pre className="bg-gray-100 p-4 rounded mt-4">
          {JSON.stringify(adminData, null, 2)}
        </pre>
      </div>
    </AdminLayout>
  );
}

// Example of server-side protection
export async function getServerSideProps(context) {
  // Assume you have a helper function to verify if the user is authenticated
  // and check if they have admin privileges (e.g., via Firebase custom claims).
  const { req, res } = context;

  // Replace this with your actual authentication and admin check logic.
  const user = await getUserFromRequest(req); // your custom function
  if (!user || !user.isAdmin) {
    // Redirect non-admin or unauthenticated users to login or home page.
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Optionally, fetch any admin-specific data from Firestore or your API.
  const adminData = await fetchAdminData(); // your custom function

  return {
    props: { adminData },
  };
}

// Dummy functions for illustration. Replace with your real implementations.
async function getUserFromRequest(req) {
  // For example, verify a token or cookie and check custom claims.
  // You might use Firebase Admin SDK here.
  // Return an object like { uid: '...', isAdmin: true, ... } if valid.
  return { uid: "12345", isAdmin: true };
}

async function fetchAdminData() {
  // Fetch any admin-specific data from Firestore or an external API.
  return { totalUsers: 100, totalTransactions: 250 };
}
