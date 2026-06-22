import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Install Tabunoc NHS App | Tabunoc National High School",
  description:
    "Guide for installing the Tabunoc National High School website as a mobile app.",
};

export default function InstallPage() {
  return (
    <>
      <PageHeader
        variant="minimal"
        eyebrow="Website App"
        title="Install Tabunoc NHS App"
        description="Add the official school website to your device for faster access to announcements, enrollment updates, and online services."
      />
      <main className="min-h-screen bg-[#F8FAFC] px-6 py-12 text-[#24313E]">
        <section className="mx-auto max-w-4xl">

        <div className="mb-6 rounded-3xl border border-[#24313E]/10 bg-white p-6 shadow-sm">
          <div className="mb-5 border-l-4 border-[#ffdf20] pl-4">
            <h2 className="text-xl font-bold text-[#24313E]">
              Install using Microsoft Edge
            </h2>
            <p className="mt-2 text-sm font-semibold text-gray-600">
              Recommended for Windows laptops and desktop computers using
              Microsoft Edge.
            </p>
          </div>

          <ol className="space-y-3 text-sm text-gray-700">
            <li>1. Open Microsoft Edge.</li>
            <li>2. Go to https://www.tabunocnatlhs.com.</li>
            <li>
              3. Look at the right side of the address bar for the app install
              icon.
            </li>
            <li>4. Click the install icon, then select Install.</li>
            <li>
              5. If the install icon does not appear, click the three-dot menu
              &hellip;.
            </li>
            <li>
              6. Go to More tools &rarr; Apps &rarr; Install this site as an
              app.
            </li>
            <li>
              7. After installation, open the app from the Start Menu, desktop
              shortcut, or Microsoft Edge apps page.
            </li>
          </ol>

          <p className="mt-5 rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#24313E]">
            In Microsoft Edge, installed website apps can be managed by typing
            edge://apps in the address bar.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">For Android / Chrome</h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li>1. Open Chrome on your phone.</li>
              <li>2. Visit https://tabunocnatlhs.com</li>
              <li>3. Tap the three-dot menu on the upper-right corner.</li>
              <li>4. Tap “Add to Home screen” or “Install app”.</li>
              <li>5. Tap “Install”.</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">For iPhone / Safari</h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li>1. Open Safari on your iPhone.</li>
              <li>2. Visit https://tabunocnatlhs.com</li>
              <li>3. Tap the Share button.</li>
              <li>4. Tap “Add to Home Screen”.</li>
              <li>5. Tap “Add”.</li>
            </ol>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-yellow-50 p-6">
          <h2 className="mb-2 text-lg font-bold">Reminder</h2>
          <p className="text-sm text-gray-700">
            This app uses the official Tabunoc National High School website.
            Internet connection may be required to access updated announcements
            and online services.
          </p>
        </div>
        </section>
      </main>
    </>
  );
}
