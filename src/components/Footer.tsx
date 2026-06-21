import Image from "next/image";
import Link from "next/link";

const schoolLogo = "/images/tabunoc-nhs-logo-512.png";
const depedLogo = "/images/deped-logo.png";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Faculty & Staff", href: "/organization" },
      { label: "Learner Population", href: "/learner-population" },
      { label: "Evacuation Map", href: "/evacuation-map" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Enrollment Guide", href: "/enrollment" },
      { label: "SHS Offerings", href: "/shs-offerings" },
      { label: "School MIS", href: "https://smis.tabunocnatlhs.com" },
      { label: "Install App", href: "/install" },
    ],
  },
  {
    title: "Updates",
    links: [
      { label: "School Calendar", href: "/school-calendar" },
      { label: "School Memos", href: "/memos" },
      { label: "Frequently Asked Questions", href: "/faq" },
    ],
  },
  {
    title: "Official Channels",
    links: [
      { label: "Facebook Page", href: "https://facebook.com/tabunocnatlhs" },
      { label: "Messenger", href: "https://m.me/tabunocnatlhs" },
      { label: "Email the School", href: "mailto:303111@deped.gov.ph" },
      { label: "Website", href: "https://tabunocnatlhs.com" },
    ],
  },
];

function FooterLink({ label, href }: { label: string; href: string }) {
  const className =
    "inline-flex text-sm font-medium leading-relaxed text-white/70 transition-colors duration-200 hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdf20] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24313e]";

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#24313e] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1.15fr_2fr] lg:gap-16 lg:px-8 lg:py-14">
        <div className="max-w-md">
          <div className="flex items-center gap-4">
            <Image
              src={depedLogo}
              alt="Department of Education logo"
              width={82}
              height={42}
              className="h-10 w-auto object-contain"
            />
            <span className="h-10 w-px bg-white/20" aria-hidden="true" />
            <Image
              src={schoolLogo}
              alt="Tabunoc National High School logo"
              width={52}
              height={52}
              className="h-12 w-12 object-contain"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
            Tabunoc National High School
          </h2>
          <p className="mt-2 text-sm font-medium text-[#ffdf20]">
            School ID: 303111
          </p>
          <p className="mt-1 text-sm text-white/65">
            Division of Talisay City, Cebu
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            A public secondary school serving Junior High School and Senior
            High School learners in Tabunok, Talisay City, Cebu.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs leading-relaxed text-white/55 sm:flex-row sm:items-start sm:justify-between lg:px-8">
          <div>
            <p>© 2026 Tabunoc National High School. All rights reserved.</p>
            <p className="mt-1">School ID: 303111</p>
          </div>
          <p className="max-w-2xl sm:text-right">
            Information posted on this website is for public information and
            may be updated based on official DepEd and school issuances.
          </p>
        </div>
      </div>
    </footer>
  );
}
