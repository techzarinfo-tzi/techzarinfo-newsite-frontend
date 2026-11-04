import DemoReturn from "./DemoReturn";

export const metadata = {
  title: "Demo booked",
  robots: { index: false },
};

// Calendly's redirect target after a "Free Demo" booking (Calendly event type > Booking page
// options > Confirmation page > "Redirect to an external site": https://www.techzarinfo.com/demo-booked,
// with "Pass event details to your redirected page" on). It sends the visitor straight back to the
// page they booked from (DemoReturn.js).
export default function DemoBookedPage() {
  return <DemoReturn />;
}
