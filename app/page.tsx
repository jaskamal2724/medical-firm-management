import LoginForm from "./components/LoginForm"

export default function Home() {
  return (
    <div className="hero min-h-[700px] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Medical Firm Management</h1>
          <p className="py-6">
            Efficiently manage your medical practice with our state-of-the-art system. Login to access your personalized
            dashboard.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

