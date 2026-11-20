import { ServicesFan } from "@/components/erp/ErpServices";

// "Why Choose Techzarinfo?": the ERP page's tilted card fan (ServicesFan), with four cards. They take
// the first four ERP looks (navy, pale blue, bright blue, royal blue), as in the design. Icons are
// ServicesFan's Lucide names: layers, settings, user and bar chart.
const reasons = [
  {
    icon: "custom",
    title: "Innovation and Affordability",
    text: "At TZI, we pride ourselves on our innovative and affordable mobile app development services. Our solutions are designed to deliver flawless performance while staying within your budget.",
  },
  {
    icon: "smes",
    title: "Customized Solutions",
    text: "We understand that every business is unique and requires tailored solutions. Our team works closely with you to understand your goals and build an app that aligns perfectly with your objectives.",
  },
  {
    icon: "communication",
    title: "End-to-End Services",
    text: "From ideation to deployment and maintenance, TZI offers comprehensive mobile application development services in Chennai, ensuring a hassle-free experience for our clients.",
  },
  {
    icon: "learningEcosystem",
    title: "Experienced Team",
    text: "Our team of skilled developers and designers has extensive experience in creating apps that are user-friendly, feature-rich, and technologically advanced.",
  },
];

export default function MobileWhyChoose() {
  return (
    <ServicesFan
      guide="mobileWhyChoose"
      title="Why Choose Techzarinfo? - Leading Mobile App Development in Chennai"
      titleWidth="max-w-[720px]"
      text="Partner with TZI, the best mobile app development company in Chennai, and take your business to new heights with our cutting-edge mobile applications. Contact us today to embark on your journey toward digital excellence"
      services={reasons}
    />
  );
}
