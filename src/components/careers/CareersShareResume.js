import Image from "next/image";
import { Mail, PhoneCall } from "lucide-react";
import { CAREERS_EMAIL, CAREERS_PHONE } from "@/lib/careers";

// "Share Your Resume": a soft blue card with the envelope-and-résumé illustration on the left and
// the careers email and phone as two white pills under the title. Same page frame as the openings
// above (max-w-7xl). Below md the illustration sits above the text and the pills stack.
// The artwork is public/careers/career.webp, a resized copy of the PNG inside career.svg (1.8 MB).
export default function CareersShareResume() {
  const contacts = [
    { icon: Mail, label: CAREERS_EMAIL, href: `mailto:${CAREERS_EMAIL}`, srLabel: "Email" },
    { icon: PhoneCall, label: CAREERS_PHONE, href: `tel:${CAREERS_PHONE.replace(/[^\d+]/g, "")}`, srLabel: "Phone" },
  ];

  return (
    <section aria-labelledby="share-resume-title" data-guide="careersShareResume" className="bg-white px-4 pt-4 sm:px-6 lg:px-8">
      <div className="relative isolate mx-auto flex max-w-7xl flex-col items-center gap-6 overflow-hidden rounded-[1.25rem] border border-[#cfe0fb] px-6 py-8 sm:px-10 md:min-h-[clamp(300px,27vw,400px)] md:flex-row md:gap-8 md:py-6 lg:px-[clamp(2rem,3.5vw,3.5rem)]">
        {/* Lavender-white on the left, brightening to pale sky blue on the right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 45% 80% at 100% 50%, #def2fd 0%, transparent 75%), linear-gradient(90deg, #f3f6ff 0%, #eef5ff 45%, #e3f3fd 100%)",
          }}
        />

        <Image
          src="/careers/career.webp"
          alt="An open envelope holding a résumé, with a paper plane flying out of it"
          width={820}
          height={688}
          sizes="(min-width: 768px) 30vw, 70vw"
          className="h-auto w-[min(70%,280px)] shrink-0 md:w-[30%] md:max-w-[380px]"
        />

        <div className="flex flex-1 flex-col items-center text-center">
          <h2
            id="share-resume-title"
            className="text-[28px] font-medium leading-[1.2] tracking-tight text-[#234a97] sm:text-[36px] lg:text-[clamp(36px,3.35vw,50px)]"
          >
            Share Your Resume
          </h2>

          <ul className="mt-6 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5 lg:mt-[clamp(1.5rem,3vw,2.75rem)] lg:gap-7">
            {contacts.map(({ icon: Icon, label, href, srLabel }) => (
              <li key={label} className="w-full max-w-[20rem] sm:w-auto sm:flex-1">
                <a
                  href={href}
                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-[15px] font-medium text-[#0b1f4d] shadow-[0_4px_14px_rgba(10,80,165,0.06)] transition-shadow hover:shadow-[0_8px_22px_rgba(10,80,165,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A50A5] lg:text-base"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#4f9bff] to-[#1f6ff0] text-white shadow-sm">
                    <Icon className="size-4.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="sr-only">{srLabel}: </span>
                  <span className="min-w-0 flex-1 truncate text-center">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
