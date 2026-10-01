import Image from 'next/image';
import Link from 'next/link';
import GlobalNav from '@/components/GlobalNav';
import styles from './index.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className='u-mt8'>
        <Image
          src="/img/common/logo/logo_simple.webp"
          alt="ロゴ"
          className={styles.header__logo}
          width={120}
          height={32}
          priority
        />
      </Link>
      <GlobalNav />
    </header>
  );
}
