import { ServicesFan } from "@/components/erp/ErpServices";

// The ERP services fan (same cards, tilts, colours, hover/tap fan-out and mobile stack), with the
// crypto exchange revenue streams from the design, left to right. Only the icons are new: each
// matches its revenue stream.
const streams = [
  {
    icon: "tradingFees",
    title: "Trading Fees",
    text: "You will earn a commission on every trade executed on your platform. You can also implement maker-taker pricing models or charge a fixed percentage per transaction, providing a consistent revenue stream as trading volume grows",
  },
  {
    icon: "listingFees",
    title: "Listing Fees",
    text: "Blockchain projects and token creators need to pay a fee to list their cryptocurrencies on your exchange platform. This helps expand your offerings while generating additional business revenue",
  },
  {
    icon: "staking",
    title: "Staking Services",
    text: "Enable users to stake supported cryptocurrencies and earn rewards. Your platform can retain a percentage of the staking rewards as a service fee, creating recurring income",
  },
  {
    icon: "marginFutures",
    title: "Margin & Futures Trading Fees",
    text: "Offers leveraged and derivatives trading to advanced users. Generate revenue through trading commissions, interest on borrowed funds, and liquidation fees",
  },
  {
    icon: "withdrawalFees",
    title: "Withdrawal & Deposit Fees",
    text: "Your platform also charges small fees for cryptocurrency or fiat withdrawals and selected deposit methods. These fees help cover operational and blockchain network costs while contributing to platform revenue",
  },
];

export default function CryptoRevenue() {
  return (
    <ServicesFan
      guide="cryptoRevenue"
      title="How Does a Cryptocurrency Exchange Make Money for Entrepreneurs?"
      titleWidth="max-w-[820px]"
      text="Build a profitable cryptocurrency exchange with multiple revenue streams from day one"
      services={streams}
    />
  );
}
