import History from "./History";

export const metadata = {
  title: "My History - ChainMove",
  description: "The decentralized transport system on  Blockchain",
  icons: {
    icon: "/images/blockridelogo.svg",
  },
};
const page = () => {
  return (
    <div>
      <History />
    </div>
  );
};
export default page;
