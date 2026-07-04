# bispoke-corp

株式会社BiSPOKE コーポレートサイト（静的HTML + CSS）。`index.html` / `services.html` / `privacy.html` / `tokushoho.html` 等、`corp.css` でスタイリング。

## デザインシステム（DESIGN.md）

コーポレートサイトの配色・タイポ・トーンは RETOLD TOKYO / BiSPOKE デザインシステムに従う。トークンの正本は [`./DESIGN.md`](./DESIGN.md)（[Google Labs DESIGN.md フォーマット](https://github.com/google-labs-code/design.md)準拠、`bispoke-cxo` がマスター）。

- `corp.css` の色・フォントは DESIGN.md の `colors` / `typography` に一致させる（Black `#1A1A1A`、Navy `#1B2A4A`、Off White `#FAF8F5`、Ink `#3D3D3D`、セリフ体は使わない）
- モノクローム基調・ミニマル・たっぷりの余白。グラデーション・キラキラ・暖色演出は禁止（DESIGN.md「Do's and Don'ts」参照）
- 正本: https://github.com/noko-neoelmo/bispoke-cxo/blob/main/DESIGN.md

> 注: コーポレートサイトに RETOLD TOKYO とは別のコーポレート専用アイデンティティが必要になった場合は、この `DESIGN.md` をフォークして調整する（その際は `bispoke-cxo` の正本との関係を明記すること）。

## オフィス報告（BiSPOKE Office・全セッション必須）

このリポで作業するすべてのClaude Codeセッションは、**作業着手前に** BiSPOKE Office（Supabase）へチェックインする。CEOはPMボードで全セッションを1画面把握している。ルール正本: `bispoke-cxo/skills/office-protocol.md`

- 既定の担当AI社員: `coo`
- 既定のプロジェクト: ``（別件なら `office_projects` から選ぶ。なければ先にプロジェクトを登録）

```bash
K="sb_publishable_fcWIHt0cWaAEM2wznMT1IQ_RlB4BBtH"; B="https://jgibqzmshtsfwsdydgqh.supabase.co/rest/v1"
# 開始時（SKEY=Claude-SessionのID session_01...）
curl -sS -X POST "$B/office_sessions?on_conflict=session_key" -H "apikey: $K" -H "Authorization: Bearer $K" -H "Content-Type: application/json" -H "Prefer: resolution=merge-duplicates" \
  -d "{\"session_key\":\"$SKEY\",\"agent_id\":\"coo\",\"title\":\"<仕事1行>\",\"repo\":\"bispoke-corp\",\"project_id\":\"\",\"status\":\"running\"}"
# 節目（30分目安）: current_step/last_heartbeat をPATCH。CEO依頼は asks[] に追加し status=waiting_ceo
# 終了時: {"status":"done","ended_at":"now()","pr_url":"<PR URL>"} をPATCH
```

マイルストーン完了時は `office_milestones` の該当行を `done=true` にPATCHする（進捗%は消化率で自動算出）。
