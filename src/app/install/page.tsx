export const metadata = {
  title: "Install Tabunoc NHS App | Tabunoc National High School",
  description:
    "Guide for installing the Tabunoc National High School website as a mobile app.",
};

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-gray-900">
      <section className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-yellow-600">
          Official School Web App
        </p>

        <h1 className="mb-4 text-3xl font-extrabold md:text-5xl">
          Install Tabunoc NHS App
        </h1>

        <p className="mb-10 max-w-2xl text-base text-gray-600 md:text-lg">
          Add the official Tabunoc National High School website to your phone
          home screen for quick access to announcements, enrollment information,
          SHS offerings, school contacts, and online services.
        </p>

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
  );
}