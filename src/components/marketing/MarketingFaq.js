import Faq from "@/components/common/Faq";

// TODO(content): the questions are from the approved design; the answers are drafts built only from
// this page's own sections (hero, Grow Online, Why Choose Us, process, industries, offers). Replace
// with approved copy when available.
const items = [
  {
    q: "What is digital marketing?",
    a: "Digital marketing is promoting your business online through channels such as search engines, paid ads and social media. Techzarinfo, a digital marketing company in Chennai, uses SEO, Google Ads, Meta Ads and social media marketing to improve your visibility, bring in qualified leads and turn more traffic into customers.",
  },
  {
    q: "What services do you offer?",
    a: "We offer search engine optimization (SEO), Google Ads, Meta Ads on Facebook and Instagram, social media marketing, landing page optimization and campaign management, all planned around your business goals.",
  },
  {
    q: "How can SEO help my business?",
    a: "SEO improves your search visibility so the right people find you. We help you rank for high-intent keywords, improve local search visibility and build long-term organic lead flow. Not sure where to start? Ask for a free website SEO audit to uncover missed growth opportunities.",
  },
  {
    q: "How does Google Ads work?",
    a: "Google Ads shows your business to people at the moment they search for what you offer. We build search-focused campaigns with better targeting, messaging and landing page alignment, then keep optimizing them to generate qualified enquiries, reduce wasted spend and improve your return on ad spend.",
  },
  {
    q: "Can social media marketing grow my business?",
    a: "Yes. Social media marketing builds a stronger online presence, brand trust and consistent visibility. We support you with a content strategy for business growth and creative support for engagement, and Meta Ads campaigns can add reach, retargeting and lead generation.",
  },
];

// The shared FAQ accordion (as on the crypto, banking and ERP pages), with this page's questions
export default function MarketingFaq() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="marketingFaq">
      <Faq
        title="Frequently Asked Questions"
        description="Answers to common questions about working with a digital marketing company in Chennai."
        items={items}
      />
    </div>
  );
}
