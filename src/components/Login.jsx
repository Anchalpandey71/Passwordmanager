import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login({ setSession }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // With Firestore, we just need the authenticated user
      setSession({
        user: result.user,
      });
    } catch (error) {
      console.error("Login Error:", error);
      alert("Authentication failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-neo-pink border-4 border-black p-8 shadow-brutal-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-black mb-6 uppercase">
          Access Your Vault
        </h2>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-black text-xl py-4 border-4 border-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {loading ? "INITIALIZING..." : "LOGIN WITH GOOGLE"}
        </button>
      </div>
    </div>
  );
}
