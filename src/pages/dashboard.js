import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">👋 স্বাগতম, {user.displayName}!</h1>
      <p className="text-gray-600">{user.email}</p>
      <button
        onClick={logout}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        লগ আউট করুন
      </button>
    </div>
  );
}
