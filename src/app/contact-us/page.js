import ContactPageSection from "@/components/contact/ContactPageSection";
import RevealEach from "@/components/common/RevealEach";

const path = "/contact-us";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TechZar. Tell us about your project and our team in India, the UK, the USA, the Middle East, Africa and Malaysia will get back to you.",
  alternates: {
    canonical: path,
  },
};

// The site-wide "How can we help you ?" section is left off this page (ContactUsSection.js): the
// same form is part of the page itself.
export default function ContactPage() {
  return (
    <RevealEach>
      <ContactPageSection />
    </RevealEach>
  );
}
