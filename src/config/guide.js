// Steps for the AI guide that travels the page. The key matches a section's data-guide attribute.
// side: which edge of the screen the guide parks on; mood: idle animation while it is there.
export const guideSteps = {
  hero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let me show you how we turn big dreams into bigger products.",
  },
  // Used by the e-commerce page hero (data-guide="ecommerceHero"). Parks on the left so it
  // never covers the shopper and product cards on the right.
  ecommerceHero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let's build an online store your customers will love to shop.",
  },
  // Used by the e-commerce services section (data-guide="ecommerceServices"). Opposite side from
  // "ecommerceHero" so the guide sweeps across, and clear of the cart image on the left.
  ecommerceServices: {
    side: "right",
    mood: "point",
    text: "From product pages to secure checkout, we build stores that help you sell more.",
  },
  // The rest of the e-commerce page, in scroll order. Sides keep alternating (hero left, services
  // right, ... CTA right, then the site-wide testimonials left and footer right), so the guide
  // sweeps across the screen at every step.
  ecommerceOfferings: {
    side: "left",
    mood: "hop",
    text: "Custom platform, mobile app, integrations or a migration, tell me where you're starting!",
  },
  ecommerceSolutions: {
    side: "right",
    mood: "point",
    text: "Global reach, smarter data and room to scale, here's what a TZI store gives you.",
  },
  ecommerceProcess: {
    side: "left",
    mood: "point",
    text: "From the first idea to going live and beyond, this is how we'll build your store together.",
  },
  ecommerceWhyChoose: {
    side: "right",
    mood: "boost",
    text: "Practical business sense plus modern tech, that's why brands across India choose TZI.",
  },
  ecommerceIndustries: {
    side: "left",
    mood: "hop",
    text: "Fashion, food, retail or home goods, we build for every shelf. Hover or tap a card to zoom in!",
  },
  ecommerceCta: {
    side: "right",
    mood: "wave",
    text: "Ready when you are! Start a project or book a free demo, I'll be right here.",
  },
  clients: {
    side: "right",
    mood: "hop",
    text: "400+ clients across 15+ countries already trust TZI with their digital journey.",
  },
  welcome: {
    side: "left",
    mood: "point",
    text: "Web, Mobility, IoT, AI & Managed Services, all in one place. Try tapping the rocket!",
  },
  flight: {
    side: "right",
    mood: "boost",
    text: "From digitization to talent on demand, pick a service and we'll launch it together.",
  },
  // Sits opposite the preceding TZI intro step ("water", side: "right") so the
  // guide visibly sweeps right-to-left as you scroll into this section.
  devServices: {
    side: "left",
    mood: "point",
    text: "Web, mobile, or blockchain, whatever you're building next, this is where we build it.",
  },
  // Used by the AI Solutions section (add data-guide="ai" to it).
  ai: {
    side: "left",
    mood: "wave",
    text: "That's my family! Voice, RAG, agents, workflows and multimodal AI. Got an AI vision? Book a free demo.",
  },
  // Used by the TZI intro section (data-guide="water"): hovers over the ripples.
  water: {
    side: "right",
    mood: "hop",
    text: "Every big change starts with one small ripple. Let's make waves together!",
  },
  // Used by the "What Sets Our Solutions Apart?" section (add data-guide="solutions" to it).
  solutions: {
    side: "right",
    mood: "point",
    text: "Six reasons every TZI build stands apart, from the first sketch to the last deploy.",
  },
  // Used by the site-wide testimonials section (data-guide="testimonials"). Rendered from the
  // root layout on every page — opposite side from "solutions" so it still sweeps in, even on
  // pages with no earlier steps.
  testimonials: {
    side: "left",
    mood: "wave",
    text: "Don't just take our word for it, here's what real TZI clients have to say.",
  },
  // Used by the site-wide footer (data-guide="footer"): the last stop on every page. Opposite
  // side from "testimonials" so the guide sweeps across one final time to say goodbye.
  footer: {
    side: "right",
    mood: "wave",
    text: "Thanks for exploring TZI! Tap me or 'Chat with AI' anytime, I'm always here to help.",
  },
};
