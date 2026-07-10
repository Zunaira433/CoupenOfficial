"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) router.push("/login");
    else setError("Could not register. Email may already be in use.");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
  <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-400" />
  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-400" required />
  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-400" required />
  {error && <p className="text-sm text-red-600">{error}</p>}
  <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Sign up</button>
</form>
    </div>
  );
}
