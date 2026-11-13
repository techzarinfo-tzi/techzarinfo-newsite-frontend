import { CAREERS_EMAIL } from "@/lib/careers";
import JobCard from "./JobCard";

// "Explore Current Openings": the job openings posted in the admin panel, two cards a row on
// tablet and up, one on phones. It sits in the same page frame as the careers banner above it
// (max-w-7xl, the same side padding).
export default function CareersOpenings({ openings }) {
  return (
    <section
      id="openings"
      data-guide="careersOpenings"
      aria-labelledby="openings-title"
      className="bg-white px-4 pt-16 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="openings-title"
          className="text-[28px] font-medium leading-[1.2] tracking-tight text-[#002461] sm:text-[36px] lg:text-[clamp(36px,2.8vw,44px)]"
        >
          Explore Current Openings
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-snug text-[#002461] sm:text-lg lg:text-[clamp(18px,1.25vw,20px)]">
          Every great journey begins with a dream, and every dream deserves the right opportunity. Join us,
          share your passion, create meaningful memories, and grow together as one family!
        </p>

        {openings.length ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
            {openings.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-12 rounded-2xl border border-[#c9dcfb] bg-linear-to-b from-white to-[#eaf4ff] px-6 py-10 text-center text-base text-[#002461]/75 lg:mt-16">
            There are no open positions right now. You can still send your CV to{" "}
            <a href={`mailto:${CAREERS_EMAIL}`} className="font-semibold text-[#0A50A5] hover:underline">
              {CAREERS_EMAIL}
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
