# bispoke.co.jp — 株式会社BiSPOKE コーポレートサイト

静的HTML/CSS。既存のVercelプロジェクト `bispoke-corp` で配信。

## 掲載事業（2026年9月更新）

- HERSTONE：中古あこやパール・ジュエリーの再編集と販売、リフォーム・リメイク、鎌倉でのものづくり体験。
- RETOLD TOKYO：オンライン相談と全国配送による修理・サイズ直し。
- 海外向け販売はHERSTONEの準備中の取り組みとして紹介。
- 鎌倉店は2026年10月1日プレオープン予定。リフォーム個別相談は11月1日開始予定。

## ページとスタイル

- `index.html`：理念、ブランド、鎌倉店、価値観、採用、会社概要、問い合わせ。
- `services.html`：2ブランドの具体的なサービスと海外向けの取り組み。
- `corp.css`：2026年9月の既存プレビューの静かな紙色・タイポグラフィを継続。
- `jobs/*.html` / `careers.css`：既存の採用ページ。店舗スタッフはHERSTONE鎌倉店の仕事内容・勤務地に更新。
- `privacy.html` / `tokushoho.html`：既存の独立した法務ページ。

## 画像

`images/herstone-worn.webp`、`images/herstone-rings.webp`、`images/kamakura-interior.webp` は、運営ブランド `herstone.jp/images/opening/` の公開済み画像を使用。ジュエリー写真は背景・光・トーンを編集したブランドビジュアル、店舗画像は完成イメージである旨をページに表示。

## 配信

`vercel.json` のclean URLと既存の `/resize` rewrite・`/remodel` redirectを維持。静的サイトのため依存インストール・ビルドは不要。公開前に全HTMLの内部リンク、画像、アンカー、スマートフォン表示、サービスへの外部リンクを確認する。
