"use client";

import Image from "next/image";
import { useRef } from "react";
import { useInView } from "@/components/lms/LmsWhichFits";

const ASSETS = "/product/SMS/powerfull-features";

const features = [
  {
    title: "Classroom Management",
    text: "Efficiently organize and manage classroom activities, resources, and student interactions, creating an optimized learning environment.",
    image: { src: `${ASSETS}/classroom.svg`, width: 266, height: 169, alt: "Teacher at an interactive board with class rosters, lesson tasks and a progress chart" },
  },
  {
    title: "Timetable & Attendance Management",
    text: "Streamline scheduling, monitor attendance, and ensure efficient time management for both students and staff with seamless tracking and reporting.",
    image: { src: `${ASSETS}/time-timetable.svg`, width: 251, height: 168, alt: "Weekly class timetable beside a student attendance register" },
  },
  {
    title: "Curriculum Management",
    text: "Simplify curriculum planning, mapping, and implementation, ensuring alignment with educational objectives and smooth progression throughout the academic year.",
    image: { src: `${ASSETS}/curriculam%20(2).svg`, width: 246, height: 164, alt: "Curriculum planner with subjects, units and lesson schedules" },
  },
  {
    title: "Assessments",
    text: "Conduct diverse assessments, including quizzes, exams, and assignments, providing insightful evaluations and fostering continuous student growth and development.",
    image: { src: `${ASSETS}/assesment.svg`, width: 253, height: 169, alt: "Assessment dashboard with exam results, quiz scores and assignment status" },
  },
];

// Layout from the 1440px design: a centred heading, then four light-blue cards in a row (~293px each,
// 22px apart), each with its title and text up top and the artwork on a white panel inset along the
// bottom (pinned to the bottom so the panels line up whatever the text length). Tablet: two by two.
// Phone: one column.
// Entrance and hover reuse the CMMS "Data into Action" styles (globals.css, .cmms-act): the heading
// rises in, then the cards rise one after another; on pointer devices a card lifts on hover.
export default function SmsFeatures() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-guide="smsFeatures"
      data-inview={inView}
      className="cmms-act bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <noscript>
        <style>{`.cmms-act .act-anim { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div className="mx-auto max-w-[1238px]">
        <h2 className="act-anim act-rise text-center text-[28px] font-semibold leading-[1.25] tracking-tight text-balance text-[#002461] sm:text-[34px] lg:text-[40px]">
          Powerful Features, Seamless Experience
        </h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-[72px] lg:grid-cols-4 lg:gap-[clamp(14px,1.55vw,22px)]">
          {features.map(({ title, text, image }, i) => (
            <li
              key={title}
              className="act-anim act-card flex flex-col rounded-[14px] bg-[#98caff] p-1.5 lg:min-h-[clamp(340px,26vw,373px)]"
              style={{ "--i": i }}
            >
              <div className="px-4 pt-5 pb-5 lg:px-[clamp(12px,1.1vw,16px)] lg:pt-[clamp(18px,1.6vw,24px)]">
                <h3 className="text-xl font-medium leading-tight text-[#002461] lg:text-[clamp(17px,1.4vw,20px)]">{title}</h3>
                <p className="mt-3 text-[15px] leading-snug text-[#002461] lg:text-[clamp(13px,1.05vw,15px)]">{text}</p>
              </div>

              <div className="mt-auto flex items-center justify-center rounded-[10px] bg-white px-3 py-2.5">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  unoptimized
                  className="h-auto w-full max-w-[300px]"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
