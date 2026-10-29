# 子ども成長記録（microCMS テンプレート）

microCMS をデータストアにした、**個人・家族用の子ども成長記録アプリ**のテンプレートです。

「ブログ・コーポレートサイト」ではなく、**身長・体重・予防接種・日々のできごとを記録し、チャートや一覧で振り返る**という使い方に振り切っています。microCMS の管理画面をそのまま入力 UI として使い、フロントは閲覧に専念する構成です(**本アプリは表示専用**)。

## 何ができるか

| 画面 | 内容 |
| --- | --- |
| ホーム | 子どもの切り替え、直近の記録のサマリー(最新の身長体重・予防接種の予定超過件数・最新の日々の記録) |
| 子ども | 登録済みの子どものプロフィール一覧(名前・誕生日・性別・写真・メモ) |
| からだの成長 | 身長・体重の折れ線チャート(公的統計の成長曲線帯つき)と一覧表 |
| 予防接種 | 標準的な接種時期をもとにした一覧。未接種・予定超過をハイライト |
| 日々の記録 | できたこと・日記・体調をタイムライン表示。分類で絞り込み可能 |

4つの API が子どもを軸に相互に参照し合い、**1人の子どもの成長・接種・日々の記録をどの画面からでも辿れる**のが特徴です。

> [!IMPORTANT]
> 子どもの写真・健康情報を扱うアプリです。**ローカル以外で利用する(Vercel 等へデプロイする)場合は、必ず Basic 認証(`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`)を設定してください。** 未設定のままデプロイすると、URL を知っている誰でも閲覧できる状態になります。設定方法は [2-2. 環境変数を設定](#2-2-環境変数を設定) を参照してください。

## 技術構成

- **Next.js 16**(App Router / Server Components)
- **React 19** / **TypeScript 5**(strict)
- **Tailwind CSS 4**(スタイルの基本。テーマは `app/globals.css` の `@theme`)
- **Sass(CSS Modules)**(レイアウトなど一部の `*.module.scss` のみ)
- **Zod**(microCMSから取得したデータの検証)
- **Recharts**(成長チャート)
- **microcms-js-sdk**
- Basic認証によるアクセス制限(`proxy.ts`。環境変数を設定した場合のみ有効)
- テスト: **Node.js 標準のテストランナー**(単体テスト) / **Playwright**(E2E)
- ホスティング: **Vercel**

## セットアップ

### 前提条件

- **Node.js 22.6 以上** / **npm 10 以上**(単体テストで Node.js の `--experimental-strip-types` を使うため)
- **microCMS アカウント**(無料プランで利用可能)

### 1. microCMS 側の準備

#### 1-1. microCMS でテンプレートから API を生成

1. [microCMS](https://microcms.io) にログインして、ダッシュボードにアクセス
2. 新規サービスを作成
3. **「テンプレート」タブから本テンプレート(子ども成長記録)を選択**して生成
4. 以下の 4 API が自動生成されます:

| API ID | 種類 | 主なフィールド |
| --- | --- | --- |
| `children` | リスト | name, birthday, gender(セレクト), photo, memo |
| `measurements` | リスト | child(参照), measuredAt, height, weight, headCircumference, note |
| `vaccinations` | リスト | child(参照), vaccine(セレクト), doseCount, status(真偽値), vaccinatedAt, clinic, reaction, note |
| `daily` | リスト | child(参照), category(セレクト), note, mood(セレクト), photos, temperature |

> テンプレート機能を使わず手動で作成する場合は、リポジトリの [`microcms-template.json`](microcms-template.json)(上記スキーマのエクスポート)を参照して、同じ API ID・フィールド ID・セレクト値で作成してください。`vaccine` / `category` / `mood` / `gender` のセレクト値は [`constants/`](constants/) 配下の定義と一致させる必要があります。

#### 1-2. API キーを取得

1. microCMS の**設定 → API キー**を開く
2. **読み取り専用の API キー**をコピーして保管(本アプリは表示専用のため、書き込み権限は不要です)

### 2. ローカル環境の構築

#### 2-1. リポジトリをクローン

```bash
git clone https://github.com/daisuke-tsunemi/children-growth.git
cd children-growth
npm install
```

#### 2-2. 環境変数を設定

リポジトリのルートに `.env.local` ファイルを作成します(`.env.example` を参考にしてください)。

```bash
MICROCMS_SERVICE_DOMAIN=xxxxx   # https://xxxxx.microcms.io の xxxxx
MICROCMS_API_KEY=xxxxxxxxxx     # microCMS の API キー(読み取り用。1-2 で取得)
BASE_URL=http://localhost:3000  # ローカル開発時は localhost でも可
BASIC_AUTH_USER=xxxxx           # デプロイして利用する場合は必ず設定
BASIC_AUTH_PASSWORD=xxxxx       # 未設定の場合は保護なしで起動します(起動時に警告)
ALLOWED_DEV_ORIGINS=192.168.1.10 # 任意。スマホから開発サーバーを確認する場合のPCのIPアドレス
```

| 変数名 | 必須 | 説明 |
| --- | --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | 必須 | microCMS のサービスID |
| `MICROCMS_API_KEY` | 必須 | 読み取り用 API キー |
| `BASE_URL` | 必須 | 公開URL(メタデータの `metadataBase` に使用)。本番ではデプロイ先のURLを設定 |
| `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` | デプロイ時は必須 | 両方設定した場合のみ Basic 認証を有効化。ローカル開発では未設定でも可 |
| `ALLOWED_DEV_ORIGINS` | 任意 | 開発サーバー(`npm run dev`)に localhost 以外のホスト名でアクセスする場合に許可するホスト名(カンマ区切り)。本番には影響しない |

> **API キーの扱い**:`.env.local` は Git でコミットしないでください(`.gitignore` に含まれています)。

> [!WARNING]
> Basic 認証は**両方の変数が設定されているときだけ**有効になります。未設定でもアプリは起動します(サーバーログに警告が出ます)が、その状態で公開すると子どもの写真・健康情報を誰でも閲覧できてしまいます。**ローカル以外で利用する場合は必ず設定してください。**

#### 2-3. ローカルで起動して動作確認

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開き、以下が表示されることを確認してください。

- **ホーム**: 子どもの切り替えセレクト、サマリーカード(データが無い場合は空状態表示)
- **からだの成長**: 性別を登録した子どもは成長曲線の帯つきチャートが表示される
- **予防接種**: 標準スケジュールに基づく一覧(未登録でも全件「予定超過」等で表示される)

> microCMS にまだデータがない場合、各画面は空の状態で表示されます。[microCMS の管理画面](https://app.microcms.io)から「子どもプロフィール」を1件登録してください。

#### スマホ実機で開発サーバーを確認する場合

同じ Wi-Fi のスマホから `http://<PCのIPアドレス>:3000` で開く場合は、`.env.local` にその IP アドレスを設定してから `npm run dev` を起動し直してください。

```bash
ALLOWED_DEV_ORIGINS=192.168.1.10
```

> 未設定のままだと、Next.js が別ホストからの開発用リソースへの接続を遮断するため、画面は表示されてもチャートが空白のまま・タブや子どもの切り替えが反応しない状態になります。Vercel 等へデプロイした本番環境では不要です。

### 3. 本番環境へのデプロイ(Vercel)

1. GitHub にプッシュ
2. [Vercel](https://vercel.com) で新規プロジェクトとしてインポート
3. 環境変数を設定してデプロイ
   - `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY`
   - `BASE_URL=https://your-domain.vercel.app`(デプロイ先の URL)
   - **`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`(必ず設定してください)**
4. デプロイ完了後、発行された URL にアクセスし、**Basic 認証のダイアログが表示されること**と各画面の表示を確認

### 4. 本番ビルド(ローカルで実行する場合)

```bash
npm run build
npm run start
```

### 5. テスト

#### 単体テスト

```bash
npm run test
```

`lib/**/*.test.ts` を Node.js 標準のテストランナーで実行します(月齢・年齢計算など)。microCMS への接続は不要です。

#### E2E テスト(Playwright)

E2E はモックを使わず、**`.env.local` に設定した実際の microCMS サービスに接続して**実行します。

```bash
npx playwright install chromium   # 初回のみ。ブラウザをインストール
npm run test:e2e
```

- テスト実行時は `playwright.config.ts` が開発サーバー(`npm run dev`)を自動で起動します。Basic 認証はテスト中のみ自動で無効化されます
- `children` に本テンプレートのサンプルデータ(山田 太郎・山田 花子)が登録済みで、`measurements`・`vaccinations`・`daily` が未登録(0件)の状態を前提にしています。データを登録・変更した場合は `e2e/*.spec.ts` も合わせて見直してください

## カスタマイズの入口

| やりたいこと | 触る場所 |
| --- | --- |
| 予防接種の推奨月齢を見直す | [`constants/vaccines.ts`](constants/vaccines.ts)(出典コメントつき。選択肢を変える場合はmicroCMSのセレクト値も合わせて変更すること) |
| 成長曲線の基準値を差し替える | [`constants/growth-standards.ts`](constants/growth-standards.ts)(出典: こども家庭庁「令和5年乳幼児身体発育調査」) |
| 日々の記録の分類・ごきげんの選択肢 | [`constants/daily.ts`](constants/daily.ts)(microCMSのセレクト値と一致させること) |
| サイト名 | [`lib/config.ts`](lib/config.ts) の `SITE_NAME` |
| 配色・角丸・影 | [`app/globals.css`](app/globals.css) の `@theme`(Tailwind CSS 4のCSSファースト設定) |
| フォント | [`lib/fonts.ts`](lib/fonts.ts)(本文: Nunito / 見出し・日本語: Zen Maru Gothic) |
| Basic認証の対象パス | [`proxy.ts`](proxy.ts) の `matcher` |

## 設計上のポイント

- **表示専用**。登録・編集は microCMS の管理画面で行う前提のため、書き込み用APIキー・Server Actionsを持たない
- **Basic認証は環境変数で有効化**([`proxy.ts`](proxy.ts))。テンプレートとしてすぐ起動できるよう未設定でも動くが、デプロイして利用する場合は必ず設定する
- **検索エンジンにインデックスさせない**。個人の記録用のため、メタデータで `noindex, nofollow` を指定している
- **月齢・年齢の計算はタイムゾーンに注意**([`lib/age.ts`](lib/age.ts))。誕生日は暦日として扱い、「今日」の判定のみ Asia/Tokyo 基準にしている
- **予防接種の「予定超過」判定は目安**。[`constants/vaccines.ts`](constants/vaccines.ts) に基づく簡易計算であり、医療上の判断を示すものではない(画面にも注意書きを表示)
- **成長曲線はp3/p50/p97の帯表示**。性別が未設定の子どもには表示しない

## 開発コマンド

```bash
npm run dev          # 開発サーバー
npm run lint         # ESLint
npm run typecheck    # 型チェック
npm run test         # 単体テスト(lib/**/*.test.ts)
npm run test:e2e     # Playwright E2E(実際のmicroCMSサービスに接続して実行)
npm run build        # 本番ビルド
```

---

## 以下拡張開発例

テンプレートは「記録を登録して、振り返る」ところまでを実装しています。実運用に乗せるとき、次に必要になりやすいのは以下です。

- **画面からのデータ入力** — microCMS の **Write API** を Server Actions 経由で叩く構成にすると、管理画面を開かずスマホから身長体重を記録できます(現状は書き込み用キーを持たない表示専用)
- **家族ごとの認証・権限管理** — Basic認証から Auth.js 等への置き換え、祖父母は閲覧のみ・保護者は編集可、といったロール分け
- **CI** — GitHub Actions で lint / typecheck / テスト / build を push のたびに自動実行(E2E を含める場合は microCMS の API キーを Secrets に登録)
- **通知・リマインド** — 予防接種の予定月齢が近づいたら Slack / LINE へ通知(microCMS の Webhook + Vercel Cron)
- **成長曲線の拡充** — 頭囲の曲線、早産児の修正月齢への対応
- **エクスポート** — 母子手帳アプリ風の PDF 出力、受診時に見せる成長記録の CSV 出力
- **別用途への転用** — 子ども → ペット・家庭菜園・習い事の生徒、といった「個体ごとの時系列記録」にデータモデルごと流用可能

---

## 開発のご相談

上記のような拡張開発、および **React / Next.js に限らず、Laravel などの PHP フレームワークを使ったサイト・業務システムの開発全般**を承っています。

- テンプレートをベースにした自社向けカスタマイズ
- 認証・権限管理、入力機能ほか外部サービス連携の追加
- 既存ワークフローのシステムリニューアル
- Webサイト制作、業務システム開発、保守運用

「どこから手を付けるべきか」「この要件は現実的か」といった段階のご相談でも構いません。

**▶ [お問い合わせはこちら(株式会社創新ラボ)](https://soushin-lab.co.jp/contact)**

---

## ライセンス

MIT License
