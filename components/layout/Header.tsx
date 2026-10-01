import Link from 'next/link';
import { headers } from 'next/headers';
import GlobalNav from '../nav/GlobalNav';
import ChildSwitcher from '../nav/ChildSwitcher';
import { getSelectedChild } from '../../lib/selected-child';
import { SITE_NAME } from '../../lib/config';

export default async function Header() {
  const [{ children, selected }, headerStore] = await Promise.all([getSelectedChild(), headers()]);
  const currentPath = headerStore.get('x-pathname') ?? '/';

  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="text-lg font-bold text-brand-700">
            {SITE_NAME}
          </Link>
          <GlobalNav />
        </div>
        <ChildSwitcher childList={children} selectedChildId={selected?.id ?? null} currentPath={currentPath} />
      </div>
    </header>
  );
}
