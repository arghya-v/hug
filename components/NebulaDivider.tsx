/**
 * A thin nebula-like gradient band used between sections to keep the cosmic
 * theme flowing from one block to the next.
 */
export default function NebulaDivider() {
  return (
    <div aria-hidden="true" className="relative h-px w-full overflow-visible">
      <div
        className="absolute left-1/2 top-1/2 h-24 w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(109,92,174,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(109,92,174,0.25), transparent)",
        }}
      />
    </div>
  );
}
