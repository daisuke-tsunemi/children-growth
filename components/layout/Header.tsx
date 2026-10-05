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
    <header className="border-b-2 border-dashed border-primary-500/30 bg-white">
      <div className="mx-auto flex  flex-wrap items-center justify-between gap-4 px-4 py-2">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="font-heading font-bold text-xl text-primary-600">
            {SITE_NAME}
          </Link>
          <GlobalNav />
        </div>
        <ChildSwitcher childList={children} selectedChildId={selected?.id ?? null} currentPath={currentPath} />
      </div>
    </header>
  );
}
