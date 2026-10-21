import Faq from "@/components/common/Faq";

// Questions and the first answer are from the FAQ design. TODO(content): answers 2-5 are drafts
// written from this page and the company knowledge base; replace with approved copy when available.
const items = [
  {
    q: "Which company is best for blockchain development?",
    a: "The best blockchain development partner is the one that understands the idea behind your project, not just the technology you need. At Techzarinfo, we take the time to understand your goals, challenges, and vision.",
  },
  {
    q: "What are the top 10 blockchain companies?",
    a: "Rankings change every year, and the right partner depends on what you are building. Look for a team with proven blockchain projects, hands-on experience with platforms such as Ethereum, Polygon, Solana, BNB Smart Chain, and Hyperledger, and a clear process from planning to launch and support. That is exactly how Techzarinfo works.",
  },
  {
    q: "What is a blockchain development company?",
    a: "A blockchain development company designs, builds, and maintains applications that run on blockchain networks, from smart contracts and decentralized apps (dApps) to crypto exchanges, wallets, payment gateways, and real-world asset (RWA) tokenization platforms. It helps businesses make transactions more secure, transparent, and efficient.",
  },
  {
    q: "How much does it cost to develop a blockchain app?",
    a: "The cost depends on the scope of your app: its features, the blockchain platform, smart contract complexity, integrations, and security requirements. A focused MVP costs far less than a full-scale exchange or tokenization platform. Share your requirements with us and we will give you a detailed estimate.",
  },
  {
    q: "Can I create my own blockchain?",
    a: "Yes. You can build a custom blockchain or, more often, launch your own token, network, or application on an established platform such as Ethereum, Polygon, or Hyperledger. We help you choose the right approach for your goals, then design, build, and launch it.",
  },
];

export default function BlockchainFaq() {
  // Wrapper only carries the AI guide tour hook (the shared Faq component stays untouched)
  return (
    <div data-guide="bcFaq">
      <Faq items={items} />
    </div>
  );
}
