import { SaaStoNavbar } from "../components/saasto/SaaStoNavbar";
import { DashboardOverview } from "./components/DashboardOverview";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <>
      <SaaStoNavbar />
      <DashboardOverview />
    </>
  );
}
