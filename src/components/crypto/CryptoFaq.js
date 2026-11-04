import Faq from "@/components/common/Faq";

// TODO(content): there is no approved FAQ copy for this page yet. These questions and answers are
// drafts built only from this page's own sections (What Is, Services, Features, Revenue, Roadmap);
// replace with approved copy when available.
const items = [
  {
    q: "What is cryptocurrency exchange development?",
    a: "Cryptocurrency exchange development involves planning, constructing, and launching a digital platform that allows users to interact with cryptocurrencies in a variety of ways buying, selling, trading, and managing them online and securely. Essentially, these exchanges help the traders to trade their Bitcoin, Ethereum, and other types of cryptocurrencies virtually.",
  },
  {
    q: "What types of crypto exchange development services does Techzarinfo offer?",
    a: "We offer centralized crypto exchange development, decentralized exchange development, white label crypto exchange solutions, hybrid exchange development, and P2P crypto exchange development. We also build crypto wallets, Security Token Offering (STO) platforms, crypto exchange mobile apps for Android and iOS, and cryptocurrency payment gateways.",
  },
  {
    q: "What features do you integrate into crypto exchange software?",
    a: "Admin features include personalized dashboard analytics, trader management, liquidity management, API management, KYC/AML, and transaction data. User features include a strong trade engine, spot, derivative and futures trading, a multi-chain crypto wallet, trade analysis tools, trade and transaction history, and multi-language support. Security features include data encryption, DDoS protection, biometric login, 2FA, SSL certification, and withdrawal whitelisting.",
  },
  {
    q: "How does a cryptocurrency exchange make money?",
    a: "A crypto exchange can earn from multiple revenue streams from day one: trading fees on every trade, listing fees from blockchain projects and token creators, a share of staking rewards, margin and futures trading fees, and withdrawal and deposit fees.",
  },
  {
    q: "What is your crypto exchange development process?",
    a: "We start with requirement analysis to understand your goals and define key features, then move to design and prototyping with wireframes and UI/UX. Next comes development with cutting-edge tools and technologies, followed by rigorous testing and QA for security and performance. We then deploy the platform with live user monitoring and provide post-launch support with maintenance, updates, and feature enhancements.",
  },
];

// The shared FAQ accordion (as on the ERP page), with this page's questions
export default function CryptoFaq() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="cryptoFaq">
      <Faq title="Frequently Asked Questions" items={items} />
    </div>
  );
}
