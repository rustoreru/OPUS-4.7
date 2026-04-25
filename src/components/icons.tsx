import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const HomeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9.5Z" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const BookmarkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 4h12v17l-6-4-6 4V4Z" />
  </svg>
);

export const CompassIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-4 2-2 4 4-2 2-4Z" />
  </svg>
);

export const UploadIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 4v12" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 20h16" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01c.25.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

export const BellIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const CastIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
    <path d="M3 13a6 6 0 0 1 6 6" />
    <path d="M3 17a2 2 0 0 1 2 2" />
    <circle cx="3.5" cy="20.5" r="0.5" fill="currentColor" />
  </svg>
);

export const FullscreenIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 9V4h5" />
    <path d="M20 9V4h-5" />
    <path d="M4 15v5h5" />
    <path d="M20 15v5h-5" />
  </svg>
);

export const UsersIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
    <path d="M14 20c0-2 2-3.5 4-3.5s3 1 3 3" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M7 4.5v15l13-7.5L7 4.5Z" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const ExternalIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 14 20 4" />
    <path d="M14 4h6v6" />
    <path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 12 5 5 9-11" />
  </svg>
);

export const StarIcon = (p: IconProps) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 3Z" />
  </svg>
);

export const Logo = (props: { size?: number }) => {
  const s = props.size ?? 48;
  const cell = s * 0.42;
  const gap = s * 0.08;
  const containerStyle: React.CSSProperties = {
    width: s,
    height: s,
    display: 'grid',
    gridTemplateColumns: `${cell}px ${cell}px`,
    gridTemplateRows: `${cell}px ${cell}px`,
    gap: `${gap}px`,
    alignContent: 'center',
    justifyContent: 'center',
  };
  const baseCell: React.CSSProperties = {
    borderRadius: 4,
    background: '#E7E7E7',
  };
  return (
    <div style={containerStyle} aria-label="TVinks">
      <div style={{ ...baseCell, background: 'var(--color-primary)' }} />
      <div style={baseCell} />
      <div style={baseCell} />
      <div style={baseCell} />
    </div>
  );
};
