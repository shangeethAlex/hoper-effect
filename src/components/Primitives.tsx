/** Eyebrow + heading + optional subtitle, centred. Reused across the
    /cocktails page's grid and margarita sections. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  className = '',
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`} data-reveal="up">
      <p
        className={`font-sans text-[11px] font-semibold uppercase tracking-widest2 ${
          dark ? 'text-orange-400' : 'text-orange-500'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-2 font-display text-4xl font-bold tracking-tightest sm:text-5xl ${
          dark ? 'text-white' : 'text-navy-500'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-4 max-w-xl font-serif text-lg italic ${
            dark ? 'text-white/60' : 'text-navy-500/60'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Tilted geometric accent badge — "SINCE 2023", "BELLISSIMO". */
export function Badge({
  children,
  tone = 'yellow',
  rotate = -8,
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'yellow' | 'orange' | 'navy' | 'white';
  rotate?: number;
  className?: string;
}) {
  const tones: Record<string, string> = {
    yellow: 'bg-yellow-400 text-navy-500',
    orange: 'bg-orange-500 text-white',
    navy:   'bg-navy-500 text-yellow-400',
    white:  'bg-white text-navy-500',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest2 shadow-md ${tones[tone]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
