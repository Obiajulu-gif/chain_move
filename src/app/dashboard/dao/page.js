import DAOPage from "./DAOPage";

export const metadata = {
  title: "DAO - ChainMove",
  description: "The decentralized transport system on  Blockchain",
  icons: {
    icon: "/images/blockridelogo.svg",
  },
};
const page = () => {
  return (
    <div>
      <DAOPage />
    </div>
  );
};
export default page;
