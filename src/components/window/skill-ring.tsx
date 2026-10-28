interface SkillRingProps {
  label: string;
  /** 0-100. */
  percent: number;
}

const SIZE = 88;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** The arc's colour by share: green is a main strength, amber is moderate, rose is a smaller part of my skills. */
const arcColor = (percent: number) => {
  if (percent >= 30) return "stroke-emerald-500 dark:stroke-emerald-400";
  if (percent >= 20) return "stroke-amber-500 dark:stroke-amber-400";
  return "stroke-rose-500 dark:stroke-rose-400";
};

/** A circular progress chart with the percentage in the middle and the label below. */
const SkillRing = ({ label, percent }: SkillRingProps) => (
  <li className="flex min-w-24 flex-col items-center gap-2">
    <div
      role="img"
      aria-label={`${label} ${percent}%`}
      className="relative"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg aria-hidden viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full -rotate-90 fill-none">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          className="stroke-neutral-900/10 dark:stroke-neutral-50/15"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
          className={`${arcColor(percent)} transition-[stroke-dashoffset] duration-700`}
        />
      </svg>
      <span
        aria-hidden
        className="absolute inset-0 grid place-items-center text-lg font-bold"
      >
        {percent}%
      </span>
    </div>
    <span className="text-center text-sm font-medium whitespace-nowrap">{label}</span>
  </li>
);

export default SkillRing;
