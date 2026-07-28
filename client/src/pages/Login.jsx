import MarketingPanel from "../components/auth/MarketingPanel";
import LoginForm from "../components/auth/LoginForm";
import AvatarGrid from "../components/auth/AvatarGrid";
import FooterBar from "../components/auth/FooterBar";

function Login() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050716] text-white">
      <div className="absolute -left-48 top-1/3 h-80 w-80 rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="absolute -right-36 top-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/2 h-64 w-64 rounded-full bg-purple-700/10 blur-[110px]" />

      <div className="relative grid min-h-screen lg:grid-cols-[42%_58%]">
        <MarketingPanel />

        <section className="relative flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:pb-20">
          <AvatarGrid />

          <div className="relative z-10 w-full">
            <LoginForm />
          </div>
        </section>
      </div>

      <FooterBar />
    </main>
  );
}

export default Login;