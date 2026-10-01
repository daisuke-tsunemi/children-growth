import { client } from '@/libs/microcms';
import styles from './home.module.scss';
import { LIMIT } from '@/constants';

const PER_PAGE = LIMIT; // 1ページあたりの表示件数

// microCMSからブログ記事を取得
async function getBlogPosts(page: number = 1) {
  const offset = (page - 1) * PER_PAGE;
  const data = await client.get({
    endpoint: 'children',
    queries: {
      fields: 'id,name',
      limit: PER_PAGE,
      offset: offset,
    },
  });
  return {
  };
}

export default async function Home() {
  return (
    <div className={`${styles.wrapper}`}>
      <div className={`${styles.hero}`}>
        <div className='u-align vertical start u-gap32'>
          <div className={`${styles.hero__chart}`}>
            <h1>成長記録システム</h1>
          </div>
        </div>
        <div className={`${styles.hero__display}`}></div>
      </div>
    </div>
  );
}
