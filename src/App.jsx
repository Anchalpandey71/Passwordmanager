import React, { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import VaultDashboard from "./components/VaultDashboard";

export default function App() {
  const [session, setSession] = useState(null);

  return (
    <HashRouter>
      <div className="min-h-screen p-4 md:p-8 max-w-[1400px] w-full mx-auto font-sans">
        <header className="mb-12 border-b-4 border-black pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 shadow-brutal">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter bg-neo-yellow inline-block px-4 py-2 border-4 border-black shadow-brutal">
              NeoVault
            </h1>
            <p className="mt-4 font-bold text-xl">
              100% Client-Side • Firebase Synced • Decrypted via AES-256
            </p>
          </div>
          {session && (
            <button
              onClick={() => setSession(null)}
              className="h-fit bg-white text-black font-black px-6 py-2 border-4 border-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all active:translate-y-1 active:shadow-none"
            >
              LOGOUT
            </button>
          )}
        </header>

        <Routes>
          <Route
            path="/"
            element={
              !session ? (
                <Login setSession={setSession} />
              ) : (
                <Navigate to="/vault" />
              )
            }
          />
          <Route
            path="/vault"
            element={
              session ? (
                <VaultDashboard session={session} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
}
