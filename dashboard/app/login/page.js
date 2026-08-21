"use client";

import { useRouter } from "next/navigation";

import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  async function handleVerified() {
    router.replace("/dashboard");
  }

  return <AuthForm onVerified={handleVerified} />;
}
