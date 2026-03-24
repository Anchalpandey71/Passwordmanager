import React, { useState, useEffect } from "react";
import { getVault, savePassword } from "../utils/db";
import { encryptData, decryptData } from "../utils/crypto";

export default function VaultDashboard({ session }) {
  const [vault, setVault] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const fetchVault = async () => {
    setLoading(true);
    try {
      const dbEntries = await getVault(session.user.uid);
      const decryptedVault = dbEntries.map((entry) => {
        const decryptedString = decryptData(entry.payload, session.user.uid);
        const parsed = decryptedString
          ? JSON.parse(decryptedString)
          : { site: "DECRYPTION ERROR", username: "", password: "" };

        // Return both the parsed data AND the raw encrypted payload
        return {
          id: entry.id,
          payload: entry.payload,
          ...parsed,
        };
      });
      setVault(decryptedVault);
    } catch (error) {
      console.error("Failed to fetch vault", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVault();
  }, [session.user.uid]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!site || !username || !password) return;

    const payload = JSON.stringify({ site, username, password });

    // Auto-encrypt using UID
    const encryptedPayload = encryptData(payload, session.user.uid);

    try {
      await savePassword(session.user.uid, encryptedPayload);
      setSite("");
      setUsername("");
      setPassword("");
      fetchVault(); // Refresh list
    } catch (error) {
      console.error("Failed to save password", error);
      alert("Error saving password to database.");
    }
  };

  return (
    <div className="flex flex-col space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form & Info */}
        <div className="flex flex-col space-y-8 lg:col-span-1">
          {/* Add Credential Form */}
          <div className="bg-neo-cyan p-6 border-4 border-black shadow-brutal h-fit">
            <h2 className="text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">
              Add Credential
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block font-bold mb-2 uppercase">
                  Website
                </label>
                <input
                  required
                  type="text"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-black font-mono"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase">
                  Username
                </label>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-black font-mono"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase">
                  Password
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-black font-mono"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-neo-yellow text-black font-black text-xl py-3 border-4 border-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all active:translate-y-1 active:shadow-none mt-4 uppercase"
              >
                Encrypt & Save
              </button>
            </form>
          </div>

          {/* Security Info Panel */}
          <div className="bg-white p-6 border-4 border-black shadow-brutal">
            <h3 className="text-xl font-black uppercase mb-2 border-b-4 border-black pb-2">
              Security Architecture
            </h3>
            <p className="font-bold mb-2">
              Algorithm:{" "}
              <span className="bg-neo-pink px-2 py-1 border-2 border-black inline-block">
                AES-256
              </span>
            </p>
            <p className="text-sm font-bold leading-relaxed">
              All data is encrypted locally in your browser before being sent to
              Firestore. The database only stores the unreadable ciphertext.
              When you load this dashboard, the ciphertext is downloaded and
              decrypted locally using your secure key.
            </p>
          </div>
        </div>

        {/* Right Column: Vault List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 bg-black text-white px-6 py-3 border-4 border-black shadow-brutal">
            <h2 className="text-2xl font-black uppercase">Your Vault</h2>
            <span className="font-bold bg-neo-yellow text-black px-3 py-1 border-2 border-black">
              {vault.length} Entries
            </span>
          </div>

          {loading ? (
            <div className="font-bold text-xl p-8 border-4 border-black bg-white shadow-brutal text-center uppercase animate-pulse">
              Decrypting data...
            </div>
          ) : (
            <div className="space-y-8">
              {vault.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-4 border-black shadow-brutal flex flex-col overflow-hidden"
                >
                  <div className="bg-neo-yellow border-b-4 border-black p-4 flex justify-between items-center">
                    <span className="font-black text-2xl uppercase tracking-tight">
                      {item.site}
                    </span>
                  </div>

                  {/* Grid for Raw vs Decrypted */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                    {/* Encrypted Side */}
                    <div className="p-4 bg-gray-100 flex flex-col">
                      <div className="text-xs font-black uppercase mb-2 text-gray-500 tracking-wider">
                        Raw AES-256 Payload (Firestore)
                      </div>
                      <div className="font-mono text-xs break-all text-gray-600 bg-gray-200 p-3 border-2 border-black flex-grow">
                        {item.payload}
                      </div>
                    </div>

                    {/* Decrypted Side */}
                    <div className="p-4 bg-white flex flex-col space-y-3">
                      <div className="text-xs font-black uppercase mb-1 text-green-600 tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
                        Decrypted Locally
                      </div>
                      <div className="font-mono bg-neo-cyan/20 p-3 border-2 border-black break-all flex flex-col">
                        <span className="text-xs font-black uppercase mb-1 opacity-70">
                          Username
                        </span>
                        <span className="font-bold text-lg">
                          {item.username}
                        </span>
                      </div>
                      <div className="font-mono bg-neo-pink/20 p-3 border-2 border-black break-all flex flex-col">
                        <span className="text-xs font-black uppercase mb-1 opacity-70">
                          Password
                        </span>
                        <span className="font-bold text-lg">
                          {item.password}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {vault.length === 0 && (
                <div className="font-bold text-lg p-8 bg-white border-4 border-black shadow-brutal text-center uppercase">
                  No passwords stored yet. Add one to see the encryption in
                  action.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Credits Section */}
      <footer className="mt-16 bg-neo-pink p-8 border-4 border-black shadow-brutal text-center flex flex-col items-center">
        <div className="bg-white border-4 border-black px-6 py-2 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <h3 className="text-2xl font-black uppercase tracking-widest">
            Pirates of Security
          </h3>
        </div>

        <p className="font-bold text-lg mb-4 uppercase tracking-wider">
          A Project Built By
        </p>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
          <span className="bg-neo-yellow text-black font-black uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
            Anchal Pandey
          </span>
          <span className="bg-neo-cyan text-black font-black uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
            Jhalak Tiwari
          </span>
          <span className="bg-white text-black font-black uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
            Archita Srivastava
          </span>
          <span className="bg-neo-yellow text-black font-black uppercase px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
            Divya
          </span>
        </div>
      </footer>
    </div>
  );
}
