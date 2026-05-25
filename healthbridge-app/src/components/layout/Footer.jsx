/*
 * src/components/layout/Footer.jsx
 * ─────────────────────────────────────────────────────────────
 * Site-wide footer. Dark primary green background.
 * Shown on every page via App.jsx layout shell.
 * ─────────────────────────────────────────────────────────────
 */
export function Footer() {
  return (
    <footer className="bg-primary text-white/65 py-10 px-8 text-center mt-auto">
      {/* Brand name */}
      <p className="font-serif text-[22px] text-white mb-2 font-normal">
        HealthBridge
      </p>

      <p className="text-[13px] leading-loose max-w-lg mx-auto">
        India&apos;s Healthcare Transparency & Intelligent Patient Decision Platform
        <br />
        All reviews are AI-moderated · Doctor profiles are NMC-verified
        <br />
        Treatment costs are indicative estimates based on verified billing records
        <br />
        <span className="opacity-40">
          © 2026 HealthBridge Technologies by Gopi Nadh 
        </span>
      </p>
    </footer>
  )
}
