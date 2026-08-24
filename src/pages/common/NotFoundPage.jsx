import { Link } from "react-router-dom";
import Header from "../../components/common/Header";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 md:pb-0">
      <Header />
      <main className="flex min-h-[65vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-[28px] border border-[#E3ECE6] bg-white px-6 py-14 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#16A34A]">404</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#10231A]">Page not found</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#64748B]">The page may have moved or the address may be incorrect.</p>
          <Link to="/" className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#16A34A] px-6 text-sm font-bold text-white hover:bg-[#15803D]">Go to home</Link>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
