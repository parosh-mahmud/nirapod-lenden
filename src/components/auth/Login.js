import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function Login() {
  const { user, googleLogin, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          নিরাপদ লেনদেন
        </h1>

        {!user ? (
          <button
            onClick={googleLogin}
            className="w-full py-3 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            <img src="/google-icon.svg" alt="Google" className="w-6 h-6 mr-3" />
            Google দিয়ে লগইন করুন
          </button>
        ) : (
          <div className="text-center">
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mx-auto mb-3"
            />
            <h2 className="text-xl font-semibold">{user.displayName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <button
              onClick={logout}
              className="mt-4 w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition"
            >
              লগ আউট করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
