// pages/dashboard/index.js
import Overview from "./overview/Overview";


export const metadata = {
  title: "Dashboard - ChainMove",
  description: "The decentralized transport system on  Blockchain",
  icons: {
    icon: "/images/blockridelogo.svg",
  },
};

export default function Dashboard() {
  return <Overview />;
}
