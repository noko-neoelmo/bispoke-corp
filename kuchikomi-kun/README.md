# 口コミっとくん

体験工房（リング作り・刻印・パーマネントジュエリー等）向けの **Google口コミ収集ツール**。
体験のあと、スタッフがQRコードを提示 → お客様がスマホで数タップ → AIが自然な口コミ下書きを生成 → ワンタップでコピーしてGoogleの口コミ投稿画面へ。低評価のお客様には、公開前に店舗への非公開フィードバックをお願いする。

> 提供先: 体験工房パートナー各店。BiSPOKE/RETOLD TOKYO が運営する体験店舗だけでなく、職人・工房ネットワークの提携工房にも配布できるよう、店舗ごとのマルチテナント構成にしている。

## なぜ作るのか（仕様の背景）

- 体験工房はローカルSEO（Googleマップ）の口コミ数・評価が集客に直結する。
- しかしお客様に「口コミ書いてください」と口頭でお願いしても、何を書けばいいか分からず離脱する。
- → **感想を数タップで選ぶだけ**で口コミの下書きが出来上がり、投稿のハードルを最小化する。
- 同時に、満足していないお客様の声は**公開前に店舗が受け取り**、改善に回す。

## フロー

```
QR提示 → スキャン → 星評価
  ├─ 星4〜5（高評価）
  │     体験メニュー＋良かった点を数タップ → AI下書き生成
  │     → 「コピーしてGoogleに投稿」→ クリップボードにコピー＋Google口コミ画面へ
  │
  └─ 星1〜3（低評価）
        非公開フィードバックフォーム → 店舗へ直接届く（公開されない）
```

※ どちらの経路からも、もう一方へ移動できる（高評価でも非公開で伝えられ、低評価でもGoogle投稿できる）。**評価で投稿先を強制的に振り分けるゲーティングはしていない**（後述）。

## ファイル構成

| パス | 役割 |
|------|------|
| `kuchikomi-kun/index.html` | お客様向けメイン画面（星評価→感想→下書き→投稿） |
| `kuchikomi-kun/app.js` | フローのロジック（vanilla JS、ビルド不要） |
| `kuchikomi-kun/style.css` | スタイル（モバイルファースト） |
| `kuchikomi-kun/stores.json` | 店舗設定（マルチテナント） |
| `kuchikomi-kun/qr.html` / `qr.js` | スタッフ用QR表示・印刷ページ |
| `kuchikomi-kun/vendor/qrcode.js` | QR生成ライブラリ（qrcode-generator, MIT, ベンダリング） |
| `api/kuchikomi-draft.js` | 口コミ下書き生成（Claude / Vercel Serverless） |
| `api/kuchikomi-feedback.js` | 非公開フィードバック転送（任意のWebhook） |

ビルド不要の静的サイト＋サーバレス関数。`bispoke-corp`（Vercel, `outputDirectory: "."`）にそのまま乗る。

## 使い方（店舗側）

1. `stores.json` に店舗を追加（店舗ID・店名・Googleの口コミ投稿URL・体験メニュー等）。
2. `qr.html?s=店舗ID` を開いて **QRを印刷**し、レジ横やお渡し時に提示。
3. お客様が読み取ると `index.html?s=店舗ID` に着地し、口コミフローが始まる。

### Googleの口コミ投稿URL（`googleReviewUrl`）の取り方

Googleビジネスプロフィールの Place ID を使い、以下の形式の「クチコミを書く」直リンクを設定する:

```
https://search.google.com/local/writereview?placeid=<PLACE_ID>
```

（`stores.json` のサンプルはダミー。各店舗の実 Place ID に差し替える。）

## URLパラメータ

- `?s=<店舗ID>` または `?store=<店舗ID>` で店舗を指定。未指定・不明な場合は `demo` にフォールバック。

## 環境変数（Vercel）

| 変数 | 必須 | 説明 |
|------|------|------|
| `ANTHROPIC_API_KEY` | 任意 | AI下書き生成用。未設定でも定型文で動作する（degrade gracefully）。 |
| `KUCHIKOMI_MODEL` | 任意 | 既定 `claude-haiku-4-5`（短文・低コスト・高速のため）。 |
| `KUCHIKOMI_FEEDBACK_WEBHOOK` | 任意 | 低評価フィードバックの転送先（Slack/Discord/LINE Notify等の汎用Webhook）。未設定なら転送せず受領のみ返す。 |

## 計測

`dataLayer`（GTM）に以下のイベントを push する。GTMが無くても動作する。

`kk_view`（表示）/ `kk_rate`（星評価）/ `kk_draft`（下書き生成）/ `kk_post`（Google投稿へ遷移）/ `kk_feedback`（非公開送信）。

## Googleポリシーへの配慮（重要）

- Googleは「低評価を選んだ人だけ公開投稿から外し、高評価だけGoogleへ誘導する」**レビューゲーティングを禁止**している。
- 本ツールは星評価で**投稿先を強制振り分けしない**。高評価のお客様には下書き作成を案内し、低評価のお客様には改善のため非公開フィードバックを案内するが、**どちらの画面からももう一方へ移動できる**（高評価でも非公開で伝えられ、低評価でもGoogle投稿できる）。
- AI下書きは**たたき台**であり、お客様が自由に編集してから投稿する設計（自動投稿は一切しない）。文面はお客様自身のもの。
- 非公開フィードバックはサーバ側に保存しない（Webhook転送のみ、未設定なら受領のみ）。

## 独立リポジトリへの切り出し

本来は専用リポジトリ（例: `kuchikomi-kun`）で配信したいが、現在のセッションのGitHub連携には**新規リポジトリ作成権限がない**（`create_repository` が 403）。そのため、ビルド不要・自己完結の形で `bispoke-corp` 配下に実装し、`/kuchikomi-kun/` で配信できるようにしている。

将来 `kuchikomi-kun` リポジトリを作成して切り出す場合:

1. `kuchikomi-kun/` ディレクトリ一式と `api/kuchikomi-draft.js` / `api/kuchikomi-feedback.js` を新リポジトリにコピー。
2. `index.html` を新リポジトリのルート（または `public/`）に配置し、`vercel.json` で `/api/*` をサーバレス関数として配信（`bispoke-corp/vercel.json` を参照）。
3. 独自ドメイン or サブドメインを割り当て、各店舗のQRを再発行。

依存は QRライブラリ1点（ベンダリング済み）と Anthropic API（fetch）のみ。npm install 不要。
