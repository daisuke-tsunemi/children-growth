'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './GlobalNav.module.scss';

const NAV_ITEMS = [
  { href: 'https://microcms.io/login', icon: null, label: '記録の登録はこちら' },
] as const;

// "/" は完全一致、それ以外は配下のページ（/news/[id] など）も current 扱いにする
const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export default function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="メニューを開く"
        aria-expanded={isOpen}
      >
        <span className={styles.hamburger__line}></span>
        <span className={styles.hamburger__line}></span>
      </button>

      {/* ナビゲーションメニュー */}
      <nav className={`${styles.nav} ${isOpen ? styles.nav__open : ''}`}>
        {NAV_ITEMS.map((item) => {
          const current = isCurrent(pathname, item.href);

          return (
            <Link
              key={item.href}
              className={`${styles.nav__link} ${current ? styles.current : ''} u-align u-gap8`}
              href={item.href}
              onClick={closeMenu}
              aria-current={current ? 'page' : undefined}
            >
              {/* <svg className="icon__w20"><use href={`#${item.icon}`} /></svg> */}
              <span>{item.label}</span>
            </Link>
          );
        })}
        <a href="https://microcms.io/login">記録の登録はこちら</a>
      </nav>

      {/* オーバーレイ（モバイル用） */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={closeMenu}
        />
      )}
    </>
  );
}
