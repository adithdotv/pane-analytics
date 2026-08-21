"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import { login, signup } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  async function handleSignup(email, password) {
    await signup(email, password);
    const { access_token } = await login(email, password);
    setToken(access_token);
    router.replace("/dashboard");
  }

  return (
    <AuthForm
      title="Create your Pane account"
      submitLabel="Sign up"
      onSubmit={handleSignup}
      footer={
        <p className="mt-6 text-center text-[13px] text-[#5B6B7C]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2E6FED]">
            Log in
          </Link>
        </p>
      }
    />
  );
}
