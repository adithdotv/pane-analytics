"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(email, password) {
    const { access_token } = await login(email, password);
    setToken(access_token);
    router.replace("/");
  }

  return (
    <AuthForm
      title="Log in to Pane"
      submitLabel="Log in"
      onSubmit={handleLogin}
      footer={
        <p className="mt-6 text-center text-[13px] text-[#5B6B7C]">
          New here?{" "}
          <Link href="/signup" className="text-[#2E6FED]">
            Create an account
          </Link>
        </p>
      }
    />
  );
}
