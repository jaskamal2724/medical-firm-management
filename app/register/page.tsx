import RegistrationForm from "@/app/components/RegistrationForm"
import Link from "next/link"

export default function Register() {
  return (
    <div className="hero min-h-[700px] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register Now!</h1>
          <p className="py-6">
            Join our medical firm management system to efficiently manage your practice and patient information.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <RegistrationForm />
            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link href="/login" className="link link-primary">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

