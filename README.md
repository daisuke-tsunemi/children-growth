# 子ども成長記録（microCMS テンプレート）

microCMS をデータストアにした、**個人・家族用の子ども成長記録アプリ**のテンプレートです。

身長・体重・予防接種・日々のできごとを記録し、チャートや一覧で振り返れるようにする、という使い方に振り切っています。**本アプリは表示専用**で、記録の登録・編集は microCMS の管理画面から行います。

## 何ができるか

| 画面 | 内容 |
| --- | --- |
| ホーム | 子どもの切り替え、直近の記録のサマリー(最新の身長体重・予防接種の予定超過件数・最新の日々の記録) |
| 子ども | 登録済みの子どものプロフィール一覧(名前・誕生日・性別・写真・メモ) |
| からだの成長 | 身長・体重の折れ線チャート(公的統計の成長曲線帯つき)と一覧表 |
| 予防接種 | 標準的な接種時期をもとにした一覧。未接種・予定超過をハイライト |
| 日々の記録 | できたこと・日記・体調をタイムライン表示。分類で絞り込み可能 |

## 技術構成

- **Next.js 16**(App Router / Server Components)
- **React 19** / **TypeScript 5**(strict)
- **Tailwind CSS 4**
- **Zod**(microCMSから取得したデータの検証)
- **Recharts**(成長チャート)
- **microcms-js-sdk**
- Basic認証によるアクセス制限(`proxy.ts`)
- ホスティング: **Vercel**

## セットアップ

### 前提条件

- **Node.js 20 以上** / **npm 9 以上**
- **microCMS アカウント**(無料プランで利用可能)

### 1. microCMS 側の準備

#### 1-1. microCMS で4つの API を作成

新規サービスを作成し、`microcms-schema.md` の定義に沿って以下の4つの API(すべてリスト形式)を作成してください。

| API ID | 名前 | 用途 |
| --- | --- | --- |
| `children` | 子どもプロフィール | 子どものマスター登録 |
| `measurements` | からだの成長 | 身長・体重・頭囲 |
| `vaccinations` | 予防接種の記録 | 予防接種の予定・実績 |
| `daily` | 日々の記録(やった・できたこと) | できたこと・日記・体調の記録 |

このリポジトリの `microcms-template.json` は、上記スキーマをそのままエクスポートしたものです。microCMS管理画面の「API一覧」からインポートできる場合は、この1ファイルで4 API をまとめて再現できます(インポート機能の有無・手順はmicroCMSの最新のドキュメントを確認してください)。

> **注意**: `measurements.weight` の下限値は、管理画面上は `5`(kg)のままになっている場合があります。新生児(出生時平均約3kg)も登録できるよう、`1.0` 程度まで引き下げることを推奨します。

#### 1-2. API キーを取得

1. microCMS の**設定 → API キー**を開く
2. **読み取り専用の API キー**をコピーして保管(本アプリは表示専用のため、書き込み権限は不要です)

### 2. ローカル環境の構築

#### 2-1. リポジトリをクローン

```bash
git clone <このリポジトリのURL>
cd children-growth
npm install
```

#### 2-2. 環境変数を設定

リポジトリのルートに `.env.local` ファイルを作成します(`.env.example` を参考にしてください)。

```bash
MICROCMS_SERVICE_DOMAIN=xxxxx   # https://xxxxx.microcms.io の xxxxx
MICROCMS_API_KEY=xxxxxxxxxx     # microCMS の API キー(読み取り用。1-2 で取得)
BASE_URL=http://localhost:3000  # ローカル開発時は localhost でも可
BASIC_AUTH_USER=xxxxx           # 任意。画面全体を保護する場合に設定
BASIC_AUTH_PASSWORD=xxxxx       # 任意。未設定の場合は保護なしで起動します(起動時に警告)
```

子どもの写真・健康情報を扱うアプリのため、**インターネットに公開する場合は `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` の設定を強く推奨**します。

#### 2-3. ローカルで起動して動作確認

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開き、以下が表示されることを確認してください。

- **ホーム**: 子どもの切り替えセレクト、サマリーカード(データが無い場合は空状態表示)
- **からだの成長**: 性別を登録した子どもは成長曲線の帯つきチャートが表示される
- **予防接種**: 標準スケジュールに基づく一覧(未登録でも全件「予定超過」等で表示される)

> microCMS にまだデータがない場合、各画面は空の状態で表示されます。[microCMS の管理画面](https://app.microcms.io)から「子どもプロフィール」を1件登録してください。

### 3. 本番環境へのデプロイ(Vercel)

1. GitHub にプッシュ
2. [Vercel](https://vercel.com) で新規プロジェクトとしてインポート
3. 環境変数(`MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` / `BASE_URL` / `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`)を設定してデプロイ

### 4. 本番ビルド(ローカルで実行する場合)

```bash
npm run build
npm run start
```

### 5. CI(GitHub Actions)

`.github/workflows/ci.yml` は push・pull request のたびに lint / typecheck / 単体テスト / build / Playwright E2E を実行する。E2Eはモックを使わず実際のmicroCMSサービスに接続するため、リポジトリの Settings → Secrets and variables → Actions で以下を登録すること。

| Secret名 | 用途 |
| --- | --- |
| `MICROCMS_API_KEY` | 読み取り用APIキー |
| `MICROCMS_SERVICE_DOMAIN` | サービスID |

E2Eは `children` に本テンプレートのサンプルデータ(山田太郎・山田花子)が登録済みで、`measurements`・`vaccinations`・`daily` が未登録(0件)の状態を前提にしている。サンプルデータを変更・削除する場合は `e2e/*.spec.ts` も合わせて見直すこと。

## カスタマイズの入口

| やりたいこと | 触る場所 |
| --- | --- |
| 予防接種の推奨月齢を見直す | [`constants/vaccines.ts`](constants/vaccines.ts)(出典コメントつき。選択肢を変える場合はmicroCMSのセレクト値も合わせて変更すること) |
| 成長曲線の基準値を差し替える | [`constants/growth-standards.ts`](constants/growth-standards.ts)(出典: こども家庭庁「令和5年乳幼児身体発育調査」) |
| 日々の記録の分類・ごきげんの選択肢 | [`constants/daily.ts`](constants/daily.ts)(microCMSのセレクト値と一致させること) |
| サイト名 | [`lib/config.ts`](lib/config.ts) の `SITE_NAME` |
| 配色 | [`app/globals.css`](app/globals.css) の `@theme`(Tailwind CSS 4のCSSファースト設定) |

## 設計上のポイント

- **表示専用**。登録・編集は microCMS の管理画面で行う前提のため、書き込み用APIキー・Server Actionsを持たない
- **月齢・年齢の計算はタイムゾーンに注意**([`lib/age.ts`](lib/age.ts))。誕生日は暦日として扱い、「今日」の判定のみ Asia/Tokyo 基準にしている
- **予防接種の「予定超過」判定は目安**。[`constants/vaccines.ts`](constants/vaccines.ts) に基づく簡易計算であり、医療上の判断を示すものではない(画面にも注意書きを表示)
- **成長曲線はp3/p50/p97の帯表示**。性別が未設定の子どもには表示しない

## 開発コマンド

```bash
npm run dev        # 開発サーバー
npm run lint        # ESLint
npm run typecheck    # 型チェック
npm run test         # 単体テスト(lib/age.ts等)
npm run test:e2e     # Playwright E2E(実際のmicroCMSサービスに接続して実行)
npm run build        # 本番ビルド
```

## ライセンス

MIT License
