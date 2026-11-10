import { Children } from "react";
import Reveal from "./Reveal";

// Wraps each child in its own <Reveal>, so a page that is a list of sections gets the scroll reveal
// on every one of them. A server component on purpose: the children are mapped before they are
// rendered, which a client component receiving server-rendered children could not do reliably.
export default function RevealEach({ children }) {
  return Children.map(children, (child) => (child ? <Reveal>{child}</Reveal> : child));
}
