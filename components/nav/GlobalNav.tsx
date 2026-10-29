import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/children', label: '子ども' },
  { href: '/growth', label: 'からだの成長' },
  { href: '/vaccinations', label: '予防接種' },
  { href: '/daily', label: '日々の記録' },
] as const;

export default function GlobalNav() {
  return (
    <nav className="flex flex-wrap gap-x-2 md:gap-x-4 gap-y-1 text-sm font-semibold text-gray-600 ms-auto">
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className="hover:text-primary-600 p-2 rounded-md border lg:border-none border-mist-400 hover:bg-gray-200">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
