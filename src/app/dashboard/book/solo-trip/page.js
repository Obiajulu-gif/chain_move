// app/dashboard/book/solo-trip/page.js
import SoloTripBooking from "./SoloTripBooking";

export const metadata = {
  title: "Solo Trip - ChainMove",
  description: "The decentralized transport system on  Blockchain",
  icons: {
    icon: "/images/blockridelogo.svg",
  },
};

export default function SoloTripBookingPage() {
	return <SoloTripBooking />;
}
