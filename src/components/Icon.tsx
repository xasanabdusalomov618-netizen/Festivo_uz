import type { ReactNode, SVGProps } from 'react';

export type IconName =
  | 'chair'
  | 'table'
  | 'lumber'
  | 'sofa'
  | 'brick'
  | 'tools'
  | 'tag'
  | 'search'
  | 'sun'
  | 'moon'
  | 'heart'
  | 'eye'
  | 'phone'
  | 'copy'
  | 'share'
  | 'close'
  | 'chevron'
  | 'plus'
  | 'camera'
  | 'check'
  | 'trash'
  | 'sliders'
  | 'sort'
  | 'pin'
  | 'shield'
  | 'bolt'
  | 'globe'
  | 'image'
  | 'message'
  | 'user'
  | 'clock'
  | 'arrow'
  | 'star'
  | 'send'
  | 'mail'
  | 'menu'
  | 'grid'
  | 'rows';

const shapes: Record<IconName, ReactNode> = {
  chair: (
    <>
      <path d="M7 3.5h10v9H7z" />
      <path d="M5.5 12.5h13M8 12.5v8M16 12.5v8M7 8h10" />
    </>
  ),
  table: (
    <>
      <path d="M3 6.5h18v3H3z" />
      <path d="M5.5 9.5v11M18.5 9.5v11M7.5 6.5 8.5 3.5h7l1 3" />
    </>
  ),
  lumber: (
    <>
      <path d="M3 9.5 21 5v4L3 13.5z" />
      <path d="M3 15 21 10.5v4L3 19z" />
    </>
  ),
  sofa: (
    <>
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M3 13.2a1.8 1.8 0 1 1 3.6 0V16h10.8v-2.8a1.8 1.8 0 1 1 3.6 0V18H3z" />
    </>
  ),
  brick: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 10h18M3 14h18M9 6v4M15 10v4M9 14v4" />
    </>
  ),
  tools: (
    <>
      <path d="M15.5 4.2a4.2 4.2 0 0 0-5.3 5.4L3.5 16.3a2 2 0 1 0 2.8 2.8l6.7-6.7a4.2 4.2 0 0 0 5.4-5.3l-2.6 2.6-2.2-.6-.6-2.2z" />
    </>
  ),
  tag: (
    <>
      <path d="M20.4 13.3 12.6 21a1.4 1.4 0 0 1-2 0L3 13.4V4a1 1 0 0 1 1-1h9.4l7 7a1.4 1.4 0 0 1 0 1.4z" />
      <path d="M7.4 7.4h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4 6.8 6.8M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.6A8.6 8.6 0 1 1 9.4 4a7 7 0 0 0 10.6 10.6z" />,
  heart: <path d="M12 20.5 4.6 13.3a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8a4.7 4.7 0 0 1 6.6 6.7z" />,
  eye: (
    <>
      <path d="M2.5 12S6 6.3 12 6.3 21.5 12 21.5 12S18 17.7 12 17.7 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  phone: (
    <path d="M6.2 3.5h2.4l1.6 4-2 1.4a10.5 10.5 0 0 0 5 5l1.4-2 4 1.6v2.4a2.5 2.5 0 0 1-2.8 2.5C11 20.7 3.4 13 3.7 6.3A2.5 2.5 0 0 1 6.2 3.5z" />
  ),
  copy: (
    <>
      <path d="M9 9h10.5v10.5H9z" />
      <path d="M14.5 5.5H4v10.5" />
    </>
  ),
  share: (
    <>
      <path d="M12 15.5V3.8M8.2 7.4 12 3.6l3.8 3.8" />
      <path d="M4.5 13v6a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 19v-6" />
    </>
  ),
  close: <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />,
  chevron: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  camera: (
    <>
      <path d="M3 8.5h3.6L8 6h8l1.4 2.5H21V19H3z" />
      <circle cx="12" cy="13.5" r="3.4" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  trash: (
    <>
      <path d="M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5 7.6 20.5h8.8L17.5 6.5" />
      <path d="M10.5 10v6.5M13.5 10v6.5" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="7" cy="17" r="2" />
    </>
  ),
  sort: <path d="M7 4v14M7 4 4 7.5M7 4l3 3.5M17 20V6M17 20l-3-3.5M17 20l3-3.5" />,
  pin: (
    <>
      <path d="M12 21c4-5 6-7.6 6-10.6A6 6 0 0 0 6 10.4C6 13.4 8 16 12 21z" />
      <circle cx="12" cy="10.2" r="2.3" />
    </>
  ),
  shield: (
    <path d="M12 3.2 19.5 6v5.6c0 4.4-3 7.6-7.5 9.2-4.5-1.6-7.5-4.8-7.5-9.2V6z" />
  ),
  bolt: <path d="M13.5 2.5 5 13.2h5.2L9.6 21.5 19 10.6h-5.4z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.6 12h16.8M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6s-1.2 6.2-3.6 8.6c-2.4-2.4-3.6-5.3-3.6-8.6s1.2-6.2 3.6-8.6z" />
    </>
  ),
  image: (
    <>
      <path d="M3.5 5.5h17v13h-17z" />
      <path d="m3.5 16 5-5 4 4 2.5-2 5.5 5" />
      <circle cx="8.6" cy="9.4" r="1.4" />
    </>
  ),
  message: <path d="M20.5 12.6c0 4-3.8 7.2-8.5 7.2a9.9 9.9 0 0 1-2.8-.4L4.5 21l1.3-3.6a6.8 6.8 0 0 1-2.3-4.8C3.5 8.6 7.3 5.4 12 5.4s8.5 3.2 8.5 7.2z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20.5c0-3.7 3.2-6 7.2-6s7.2 2.3 7.2 6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4V12l3.4 2.2" />
    </>
  ),
  arrow: <path d="M4.5 12h15M14 6.5 19.5 12 14 17.5" />,
  star: <path d="m12 3.6 2.7 5.5 6 .9-4.3 4.3 1 6.1L12 17.5 6.6 20.4l1-6.1L3.3 10l6-.9z" />,
  send: <path d="M20.5 3.5 3 10.4l6.7 2.6L12.5 20l2.6-6.6z" />,
  mail: (
    <>
      <path d="M3.5 5.5h17v13h-17z" />
      <path d="m3.9 6.4 8.1 6.2 8.1-6.2" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  grid: (
    <>
      <path d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z" />
    </>
  ),
  rows: <path d="M4 5.5h16v4H4zM4 14.5h16v4H4z" />,
};

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  filled?: boolean;
}

export function Icon({ name, size = 20, filled = false, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shapes[name]}
    </svg>
  );
}
