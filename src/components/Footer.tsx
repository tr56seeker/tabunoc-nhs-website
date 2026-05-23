import Image from "next/image";

const schoolLogo = "/images/tabunoc-nhs-logo-512.png";

const depedLogo = "/images/deped-logo.png";

const footerLinks = [
  {
    title: "School",
    links: [
      { label: "Home", href: "/" },
      { label: "School Directory", href: "/organization" },
      { label: "Citizen’s Charter", href: "/citizen-charter" },
      { label: "School Memos", href: "/memos" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Enrollment Guide", href: "/enrollment" },
      { label: "SHS Offerings", href: "/shs-offerings" },
      { label: "School MIS", href: "https://smis.tabunocnatlhs.com" },
      { label: "Get Directions", href: "https://www.google.com/maps/search/?api=1&query=Tabunoc%20National%20High%20School%20Sangi%20Road%20Tabunok%20Talisay%20City%20Cebu" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Alumni", href: "/alumni" },
      { label: "Facebook Page", href: "https://facebook.com/tabunocnatlhs" },
      { label: "Messenger", href: "https://m.me/tabunocnatlhs" },
    ],
  },
];

function isExternalLink(href: string) {
  return href.startsWith("http");
}

export default function Footer() {
  return (
    <footer className="bg-[#071E29] text-teal-50">
      <div className="border-b border-white/10 bg-[#0B2A36] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              Official School Website
            </p>
            <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
              Tabunoc National High School
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-100">
              A learner-centered public secondary school serving Junior High
              School and Senior High School learners in Tabunok, Talisay City,
              Cebu.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/enrollment"
              className="rounded-xl bg-yellow-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
            >
              Enrollment Guide
            </a>

            <a
              href="https://m.me/tabunocnatlhs"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 px-5 py-3 text-center text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#0F4C5C]"
            >
              Contact the School
            </a>
          </div>
        </div>
      </div>

      <div className="px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src={depedLogo}
                alt="Department of Education Logo"
                width={78}
                height={40}
                className="h-10 w-auto object-contain"
              />

              <Image
                src={schoolLogo}
                alt="Tabunoc National High School Logo"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
            </div>

            <div className="mt-6">
              <p className="text-xl font-black text-white">
                Tabunoc National High School
              </p>
              <p className="mt-2 text-sm leading-6 text-teal-100">
                Sangi Road, Tabunok, Talisay City, Cebu
              </p>
              <p className="mt-1 text-sm leading-6 text-teal-100">
                School ID: 303111
              </p>
              <p className="mt-1 text-sm leading-6 text-teal-100">
                Office Hours: Monday to Friday, 8:00 AM – 5:00 PM
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
              <p className="text-sm font-black text-yellow-300">
                Data Privacy Reminder
              </p>
              <p className="mt-2 text-sm leading-6 text-teal-50">
                Please avoid posting sensitive learner information in public
                comments. For records, enrollment, and confidential concerns,
                use official school channels.
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
                  {group.title}
                </h3>

                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={isExternalLink(link.href) ? "_blank" : undefined}
                        rel={
                          isExternalLink(link.href)
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm font-semibold text-teal-100 transition hover:text-yellow-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-teal-100 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Tabunoc National High School. All rights reserved.
          </p>

          <p>
            Maintained for official school information, public assistance, and
            stakeholder access.
          </p>
        </div>
      </div>
    </footer>
  );
}
