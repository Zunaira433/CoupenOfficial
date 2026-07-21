"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) router.push("/dashboard");
    else setError("Invalid email or password");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Login</h1>
     <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-400"
    required
  />
  <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded-md border px-4 py-2 pr-10 bg-white text-gray-900 placeholder-gray-400"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
</div>
  {error && <p className="text-sm text-red-600">{error}</p>}
  <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Login</button>
  <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline text-center">
    Forgot password?
  </a>
</form>
    </div>
  );
}
