# bispoke.co.jp — 株式会社BiSPOKE コーポレート／採用サイト

静的サイト（HTML + CSS）。Vercelでホスティング。

## ブランド
RETOLD TOKYO（リトールド トーキョー / 旧UZUME）を運営。
ミッション「三世代先まで語り継がれる感動体験をつくる」。

## 構成
- `index.html` — トップ（採用ファースト：Mission → What we do → Values → Careers → Brand → Company → Contact）
- `services.html` — サービス（RETOLD TOKYO）
- `jobs/*.html` — 募集職種（職人 / 店舗スタッフ / カスタマーサポート）
- `privacy.html`, `tokushoho.html` — 法務
- `corp.css` — デザインシステム（RETOLD TOKYO トンマナ：白ベース×Anton×ローズ）
- `images/atelier.mp4` / `.webm` — 工房の手元映像

## ルーティング（vercel.json）
- `/resize` → bispoke-resize-lp（サイズ直しLP）を rewrite 配信
- `/remodel` → retold.tokyo へ redirect
