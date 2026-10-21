import BlockchainWhatIs from "@/components/blockchain/BlockchainWhatIs";

// The Blockchain page's intro section, with the ERP page's content. Per the ERP design, the first
// heading line stays whole on desktop ("... Development" / "with TZI"; phones wrap naturally) and
// the paragraph runs wider (~1100px, three lines at 1440).
export default function ErpWhatIs() {
  return (
    <BlockchainWhatIs
      title={
        <>
          <span className="lg:whitespace-nowrap">Custom ERP Software Development</span> with TZI
        </>
      }
      textWidth="max-w-[830px] lg:max-w-[1100px]"
    >
      TZI has been trusted by reputed clients around the world for its excellence in ERP software
      development. Whether you need automation, customization, or scalability, our ERP solutions are
      designed to adapt to your business goals and deliver long-term satisfaction for your entire
      organization.
    </BlockchainWhatIs>
  );
}
