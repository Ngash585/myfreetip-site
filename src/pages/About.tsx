import { usePageMeta } from "@/hooks/usePageMeta";

const WHAT_WE_DO_DIFFERENTLY = [
  {
    heading: "We show the full record",
    body: "Performance only means something when the full picture is visible. That includes strong calls, missed calls, and void outcomes. We believe transparency builds more trust than hype ever will.",
  },
  {
    heading: "We use data, not noise",
    body: "Our analysis is built around form, match context, recent performance, and other key football signals before a pick is published. We aim to keep every call grounded in structured analysis rather than emotion or guesswork.",
  },
  {
    heading: "We keep it practical",
    body: "Each featured call is presented clearly, with the key information users need in one place, including the match, confidence level, and relevant match information where available.",
  },
  {
    heading: "We keep it open",
    body: "MyFreeTip is built to be accessible. We want users to be able to follow daily football analysis and results without unnecessary barriers.",
  },
];

const SECTION: React.CSSProperties = { marginBottom: "2.5rem" };
const H2: React.CSSProperties = { fontWeight: 700, fontSize: "1.125rem", marginBottom: "0.75rem", color: "#1D1D1D" };
const BODY: React.CSSProperties = { color: "#777777", lineHeight: "1.7", fontSize: "0.9375rem" };

export default function About() {
  usePageMeta({
    title: "About MyFreeTip \u2014 Football Analysis Platform",
    description:
      "MyFreeTip publishes daily football match analysis with a fully transparent record, including successful and unsuccessful outcomes. Built for users who want clear analysis without noise.",
    canonical: "https://myfreetip.com/about",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ color: "#1D1D1D" }}>

      {/* About Us */}
      <section style={SECTION}>
        <h1
          className="leading-tight mb-5"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "2rem", fontWeight: 400, color: "#1D1D1D" }}
        >
          About Us
        </h1>
        <p className="mb-4" style={BODY}>
          MyFreeTip is a football predictions and match analysis platform built for people who want clear daily calls without the noise.
        </p>
        <p className="mb-4" style={BODY}>
          We publish match analysis, confidence-based picks, and results in a format that is fast, simple, and easy to follow on mobile.
        </p>
        <p style={BODY}>
          Our goal is straightforward: make football analysis more accessible, more transparent, and easier to use every day.
        </p>
      </section>

      {/* Why MyFreeTip Exists */}
      <section style={SECTION}>
        <h2 style={H2}>Why MyFreeTip Exists</h2>
        <p className="mb-4" style={BODY}>
          Too many prediction pages are inconsistent, vague, or selective about what they show. Some only highlight strong runs. Others make it hard to track past performance or understand the thinking behind a call.
        </p>
        <p className="mb-4" style={BODY}>
          MyFreeTip was built to do the opposite.
        </p>
        <p style={BODY}>
          We believe users should be able to see what was posted, why it was posted, and how it performed over time.
        </p>
      </section>

      {/* What We Do Differently */}
      <section style={SECTION}>
        <h2 style={H2}>What We Do Differently</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {WHAT_WE_DO_DIFFERENTLY.map((item) => (
            <div key={item.heading}>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem", color: "#1D1D1D" }}>{item.heading}</p>
              <p style={BODY}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Record */}
      <section style={SECTION}>
        <h2 style={H2}>Our Record</h2>
        <p className="mb-4" style={BODY}>
          Our performance record is updated as results are confirmed, with both successful and unsuccessful outcomes remaining visible.
        </p>
        <p style={BODY}>
          This matters to us because trust is not built by showing only the good days. It is built by staying visible on all days.
        </p>
      </section>

      {/* Our Analyst Approach */}
      <section style={SECTION}>
        <h2 style={H2}>Our Analyst Approach</h2>
        <p className="mb-4" style={BODY}>
          Every published call is selected using a structured football analysis process focused on clarity, consistency, and evidence.
        </p>
        <p style={BODY}>
          We do not believe in hiding behind vague claims. We believe users should be able to judge our work by the quality of the analysis and the transparency of the results. Our published record &mdash; including all outcomes &mdash; is available on the predictions pages of this site.
        </p>
      </section>

      {/* Partner Disclosure */}
      <section style={SECTION}>
        <h2 style={H2}>Partner Disclosure</h2>
        <p className="mb-4" style={BODY}>
          MyFreeTip may feature selected partner links and promotions from third-party platforms. These relationships help support the platform and allow us to continue publishing free football prediction content and match analysis tools.
        </p>
        <p style={BODY}>
          Partner relationships support the business, but the long-term value of the platform depends on user trust, consistency, and transparent reporting.
        </p>
      </section>

      {/* Responsible Use */}
      <section style={SECTION}>
        <h2 style={H2}>Responsible Use</h2>
        <p className="mb-4" style={BODY}>
          MyFreeTip is intended for informational and entertainment purposes only.
        </p>
        <p style={BODY}>
          Users should always act independently, exercise their own judgement, and be aware that football predictions carry inherent uncertainty. Past performance does not guarantee future outcomes.
        </p>
        <p className="mt-4" style={BODY}>
          This platform is intended for adults only, subject to applicable local laws and platform requirements.
        </p>
      </section>

    </div>
  );
}
