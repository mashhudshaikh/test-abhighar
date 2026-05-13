interface Props {
  name: string;
  className?: string;
}

export default function AmenityIcon({ name, className = "w-5 h-5" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name] ?? PATHS.default}
    </svg>
  );
}

const PATHS: Record<string, React.ReactNode> = {
  clubhouse: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-5 7 5v11" />
      <path d="M10 21v-5h4v5" />
      <path d="M8 13h2M14 13h2" />
    </>
  ),
  pool: (
    <>
      <path d="M2 18c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      <path d="M2 14c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
      <path d="M7 13V5a2 2 0 014 0M13 13V5a2 2 0 014 0" />
    </>
  ),
  security: (
    <>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  gym: (
    <>
      <path d="M6.5 6.5l11 11" />
      <path d="M4 4l2.5 2.5M17.5 17.5L20 20" />
      <path d="M3 7l4-4M17 21l4-4" />
      <path d="M14.5 4l3 3M6.5 16l3 3" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.6" fill="currentColor" stroke="none" />
      <path d="M8.5 14.5c.8 1.3 2 2 3.5 2s2.7-.7 3.5-2" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M10 17V7h3.5a3 3 0 010 6H10" />
    </>
  ),
  power: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  garden: (
    <>
      <path d="M12 22V12" />
      <path d="M12 12c-3.5-1-5-3.5-5-6 1.5-1.5 4 0 5 2 1-2 3.5-3.5 5-2 0 2.5-1.5 5-5 6z" />
      <path d="M8 22h8" />
    </>
  ),
  jog: (
    <>
      <circle cx="14" cy="4.5" r="1.8" />
      <path d="M7 21l3-6 3 2 1.5-6 2 2 2.5-1" />
      <path d="M11 11l-4 4M7 12l-3 1" />
    </>
  ),
  default: <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />,
};