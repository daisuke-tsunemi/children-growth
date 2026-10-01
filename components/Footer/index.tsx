import styles from './index.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
        <p className={`${styles.cr} u-right`}>©2026 <a href="https://soushin-lab.co.jp">Innovation-Lab Co.</a> All Rights Reservedp</p>
    </footer>
  );
}
