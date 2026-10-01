import { SITE_NAME } from '../../lib/config';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white py-6 text-center text-xs text-gray-400">
      <p>{SITE_NAME}</p>
      <p>本アプリは記録用であり、医療上の判断を示すものではありません。</p>
    </footer>
  );
}
