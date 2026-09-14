import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] p-4">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-xl">
        <h1 className="font-serif text-2xl font-bold">Admin Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage news and content.
        </p>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
