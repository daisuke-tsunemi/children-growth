# 子ども成長記録テンプレート

microCMSをデータストアにした、個人・家族用の子ども成長記録アプリ。microCMS公式テンプレートとして公開する前提で、各ユーザーが自分のmicroCMSサービスとVercelにデプロイして使う。

APIスキーマの詳細は @docs/microcms-schema.md を参照し、そこに書かれた定義を正とする。スキーマを変える場合は先にこのドキュメントを更新する。

## 技術スタック

- Next.js(App Router)/ TypeScript(strict)
- microCMS(`microcms-js-sdk`)
- Zod(入力検証)、Recharts(チャート)、Tailwind CSS
- デプロイ: Vercel
- CI: GitHub Actions(lint / typecheck / build / Playwright E2E)

## 環境変数

| 名前 | 用途 |
|---|---|
| `MICROCMS_SERVICE_DOMAIN` | サービスID |
| `MICROCMS_API_KEY` | 読み取り用キー |
| `MICROCMS_WRITE_API_KEY` | 書き込み用キー(サーバー専用) |
| `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` | 画面全体のBasic認証 |

`NEXT_PUBLIC_` を付けない。`.env.example` を必ず最新に保ち、実際のキーはコミットしない。

## 画面

| パス | 内容 |
|---|---|
| `/` | 子どもの切り替え、直近の記録のサマリー |
| `/children` | 子どものマスター登録・編集(名前、誕生日、写真) |
| `/growth` | 身長・体重の折れ線チャートと一覧表。成長曲線の帯を重ねる(`src/constants/growth-standards.ts` に基準値があれば) |
| `/vaccinations` | 月齢順の一覧。未接種・予定超過をハイライト(予定日のフィールドはないため、誕生日と `vaccines.ts` の推奨月齢から算出する) |
| `/daily` | 日々の記録(できたこと・日記・体調)をタイムラインで表示(分類での絞り込み、写真つき、ごきげん・体温)。入力は分類・ひとこと・写真が中心の軽いフォーム |

チャートと一覧表は、同じデータを切り替えて見られるようにする。

## データの扱い

- microCMSへのアクセスは `src/lib/microcms.ts` に集約する。ページやコンポーネントから直接SDKを呼ばない
- 読み取りは Server Components、書き込みは Server Actions か Route Handlers のみ。書き込みキーはサーバーの外に出さない
- 取得結果は Zod で検証し、型は `src/types/` にスキーマから導出する
- 予防接種の推奨月齢と成長曲線の基準値は `src/constants/` の定数で持つ。予防接種の種類はmicroCMSのセレクトの値と定数のキーを完全一致させ、照合をZodで検証する。`daily` の分類・ごきげんの選択肢も `daily.ts` と一致させる
- `daily` には日付フィールドがなく、記録日は `createdAt` を使う。表示順は `orders=-createdAt`
- ワクチンの推奨月齢や成長曲線の数値は、公的資料で確認した値のみ入力し、出典をコメントに残す。推測で埋めない
- `vaccines.ts` の名称や `daily.ts` の選択肢を変更したら、microCMSのセレクト選択肢も合わせて更新する必要があるため、変更時にその旨を報告する
- 100件を超える取得に備え、`offset` で全件取得するヘルパーを使う
- 子どもの絞り込みは `filters=child[equals]{id}`、時系列は `orders` を使う
- 月齢・年齢の計算は `src/lib/age.ts` に一本化し、単体テストを書く

## セキュリティ・プライバシー

- 子どもの写真や健康情報を扱うため、全ルートをBasic認証で保護する(未設定なら起動時に警告を出す)
- microCMSのメディアURLは公開URLになる。READMEに明記する
- ログやエラー表示に個人情報を出さない
- 本アプリは記録用であり、医療上の判断を示すものではない。予防接種の画面に注意書きを表示する

## ディレクトリ構成

```
src/
  app/            ルートとページ
  components/     UIコンポーネント(charts/ tables/ forms/)
  constants/      vaccines.ts, daily.ts, growth-standards.ts
  lib/            microcms.ts, age.ts, auth など
  types/          Zodスキーマと型
docs/
  microcms-schema.md
e2e/              Playwrightテスト
```

## コマンド

```
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## コーディング規約

- UIとコメントは日本語、識別子は英語
- 型に `any` を使わない。Server Componentsを基本とし、`"use client"` はチャートとフォームなど必要な部分だけ
- 日付は ISO 8601 で受け渡し、表示時にだけ整形する(タイムゾーンは Asia/Tokyo)
- 新しい依存を追加する前に、既存のもので足りないか確認する

## テスト

- Playwrightで主要フロー(子どもの登録、身長体重の追加とチャート反映、予防接種の登録、日々の記録の登録)を確認する
- CIではmicroCMSに接続せず、モックのレスポンスで実行できるようにする

## 開発の進め方

1. 骨組み(認証、`microcms.ts`、型、レイアウト)
2. children と measurements(チャート+一覧表まで)
3. vaccinations(`vaccines.ts` 定数を含む)
4. daily(`daily.ts` 定数を含む。タイムライン表示まで)
5. テンプレート公開用の整備(README、`.env.example`、サンプルデータ50件以内、セットアップ手順)

各段階で `lint` / `typecheck` / `test:e2e` を通してから次へ進む。仕様に迷ったら実装前に質問する。
