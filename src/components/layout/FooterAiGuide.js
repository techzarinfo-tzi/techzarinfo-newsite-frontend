"use client";

import { OPEN_CHAT_EVENT } from "@/components/chatbot/ChatWidget";

// Footer panel for the AI guide. Same markup/classes as the other footer panels so it inherits
// their glass background and type; the items are buttons because they act on the page
// (open the chat, replay the guide's walk from the top) rather than navigate.
export default function FooterAiGuide() {
  const openChat = () => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT));
  const replayTour = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <nav className="ft-panel ft-panel-ai" aria-label="AI Guide">
      <h2 className="ft-heading">AI Guide</h2>
      <ul>
        <li>
          <button type="button" onClick={openChat}>
            Chat with AI
          </button>
        </li>
        <li>
          <button type="button" onClick={replayTour}>
            Take a Tour
          </button>
        </li>
      </ul>
    </nav>
  );
}
