// The "Free Demo" booking page (Calendly). After a booking, Calendly redirects to /demo-booked,
// which returns the visitor to the page they booked from (components/common/DemoLink.js).
export const DEMO_URL = "https://calendly.com/techzarinfo-sales/30min";

// Where DemoLink remembers the page the visitor left from (sessionStorage key)
export const DEMO_RETURN_KEY = "tzi-demo-return";
