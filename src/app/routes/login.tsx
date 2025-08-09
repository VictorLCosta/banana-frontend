import { LoginForm } from "@/features/auth/components/login-form";

export function LoginPage() {
  return (
    <div className="min-h-[100vh]">
      <div className="flex h-[100vh]">
        <div className="flex-1/2 flex justify-center items-center">
          <LoginForm />
        </div>
        <div className="flex-1/2 bg-main-yellow" />
      </div>
    </div>
  )
}