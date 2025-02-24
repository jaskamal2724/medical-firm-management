import LoginForm from "@/app/components/LoginForm";

export default function Login() {
  return (
    <div
      className="hero min-h-[700px] bg-cover bg-center bg-no-repeat relative rounded-xl"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2024/03/26/11/57/pills-8656650_1280.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
      <div className="hero-content flex-col lg:flex-row-reverse relative z-10">
        <div className="text-center lg:text-left text-white">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Access your personalized dashboard efficiently.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-blue-100">
          <div className="card-body ">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
