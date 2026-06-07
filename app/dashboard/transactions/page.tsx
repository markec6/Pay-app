import { SaaStoNavbar } from "../../components/saasto/SaaStoNavbar";

export default function DashboardTransactionsPage() {
  return (
    <>
      <SaaStoNavbar />
      <main className="min-h-screen bg-[#f9fafb] px-4 py-12 text-[#1a1a2e] md:px-8 lg:px-10">
        <section className="mx-auto max-w-[1280px] rounded-3xl bg-white p-8 shadow-[0_18px_55px_-32px_rgba(26,26,46,0.45)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3DAB6B]">
            Dashboard Module
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Transactions
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-600">
            This public preview route is ready for the detailed transactions
            workspace.
          </p>
        </section>
      </main>
    </>
  );
}
