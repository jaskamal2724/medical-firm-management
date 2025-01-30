import LoginForm from "@/app/components/LoginForm"
import Link from "next/link"

export default function Login() {
  return (
    <div className="hero min-h-[700px] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Access your personalized dashboard and manage your medical practice efficiently.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <LoginForm />
            <div className="text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/secure-register" className="link link-primary">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

