---
version: alpha
name: RETOLD TOKYO
description: >-
  ジュエリーリフォームブランド RETOLD TOKYO のデザインシステム。
  LE LABO をベンチマークに、モノクローム基調・ミニマル・プロセスを見せる
  「ナラティブラグジュアリー」を体現する。運営: 株式会社BiSPOKE。
colors:
  # Primary palette
  black: "#1A1A1A"
  navy: "#1B2A4A"
  silver: "#C0C5C9"
  offWhite: "#FAF8F5"
  coolGray: "#D8D8DC"
  ink: "#3D3D3D"
  # Monochrome scale
  charcoal: "#2C2C2C"
  midGray: "#6B6B6B"
  lightGray: "#E5E5E5"
  # Semantic mapping
  primary: "{colors.black}"
  accent: "{colors.navy}"
  background: "{colors.offWhite}"
  surface: "#FFFFFF"
  text: "{colors.ink}"
  textInverse: "{colors.offWhite}"
  border: "{colors.silver}"
  cta: "{colors.navy}"
typography:
  display:
    fontFamily: '"Neue Haas Grotesk", "Inter", "Yu Gothic", "游ゴシック", sans-serif'
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.02em
  heading:
    fontFamily: '"Neue Haas Grotesk", "Inter", "Yu Gothic", "游ゴシック", sans-serif'
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.01em
  subheading:
    fontFamily: '"Neue Haas Grotesk", "Inter", "Yu Gothic", "游ゴシック", sans-serif'
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.01em
  body:
    fontFamily: '"Yu Gothic", "游ゴシック", "Inter", sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  caption:
    fontFamily: '"Yu Gothic", "游ゴシック", "Inter", sans-serif'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  # Monospace = LE LABO のタイプライターラベル相当。素材名・号数・日付など「データ」表示用
  spec:
    fontFamily: '"JetBrains Mono", "IBM Plex Mono", "Space Mono", monospace'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.02em
  logo:
    fontFamily: '"Neue Haas Grotesk", "Inter", sans-serif'
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.12em
rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  2xl: 96px
components:
  button:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.offWhite}"
    typography: "{typography.subheading}"
    rounded: "{rounded.sm}"
    padding: 16px 32px
  buttonGhost:
    backgroundColor: transparent
    textColor: "{colors.black}"
    typography: "{typography.subheading}"
    rounded: "{rounded.sm}"
    padding: 16px 32px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 32px
  specLabel:
    backgroundColor: transparent
    textColor: "{colors.midGray}"
    typography: "{typography.spec}"
  pageSurface:
    backgroundColor: "{colors.offWhite}"
    textColor: "{colors.ink}"
---

## Overview

RETOLD TOKYO は「ジュエリーリフォーム」のブランド。タグラインは **Rewritten, not replaced.**（置き換えるのではなく、書き換える）。ジュエリーを記号ではなく「記憶の器」として扱う *ナラティブラグジュアリー* を掲げる。

デザインのベンチマークは香水ブランド **LE LABO**。ドメインは違えど原則を共有する — プロセスがプロダクト（完成品ではなく職人の手元・変容を見せる）、反・大量生産の宣言、モノスペースのラベル感、わびさび（傷や経年変化の肯定）、色ではなく素材の質感で語る。

すべてのアウトプット（LP・広告・SNS・パッケージ・店舗）はこのトーンを基準にする。判断に迷ったら「LE LABO がこの表現を使うか？」を問う。

## Colors

モノクローム基調。彩度は徹底して抑え、色ではなく金属の質感で語る。

- `primary` / `black` `#1A1A1A` — ロゴ、見出し、テキスト
- `accent` / `navy` `#1B2A4A` — CTA、写真背景、アクセント
- `silver` `#C0C5C9` — アクセント、箔押し、ボーダー
- `offWhite` `#FAF8F5` — 背景、余白
- `ink` `#3D3D3D` — 本文テキスト
- モノクロームスケール: `charcoal` `#2C2C2C` / `midGray` `#6B6B6B` / `lightGray` `#E5E5E5` / `coolGray` `#D8D8DC`

CTA は必ず `navy`。グラデーション・暖色の演出・鮮やかな色は禁止。

## Typography

- **日本語**: 游ゴシック（見出し Medium/Bold、本文 Regular）
- **英語（見出し・ロゴ）**: Neue Haas Grotesk / Inter、Medium、オールキャップス
- **スペック・ラベル・データ（素材名・号数・日付・Reform番号）**: モノスペース体（JetBrains Mono / IBM Plex Mono / Space Mono）。LE LABO のタイプライターラベルに相当する工房／処方箋感を出す
- **セリフ体は使用しない**
- ロゴの字間は広め（トラッキング 0.12em ≒ 8–16px）

モノスペース使用例:
```
素材: Pt900 | サイズ変更: 11号→8号 | 完了日: 2026.04.15
Reform #0047 — For: [お客様名]
```

## Layout

- たっぷりの余白。詰め込まない。1ビュー1メッセージ
- スペーシングスケール（`spacing`）で統一: xs 4 / sm 8 / md 16 / lg 32 / xl 64 / 2xl 96
- 左揃え or 中央揃え（右揃えは使わない）
- スクロールは深くてよい（急がせない）。ポップアップ・割り込みバナーは禁止
- LP ファーストビュー必須要素: ジュエリービジュアル（手元クローズアップ）／「ジュエリーリフォーム」明記／タグライン "Rewritten, not replaced."

## Elevation & Depth

影で浮かせるより、余白とコントラストで階層を作る。装飾的なドロップシャドウは避け、写真側でハードライト・実体の影を活かす。フラットでミニマルなサーフェス。

## Shapes

- 四角形が基準。角丸は最小限（`rounded.sm` 2px 程度まで）
- 丸・星・吹き出しなどの装飾シェイプは使わない
- 線は細め（1–2px）、`silver` または `white`
- アイコンは線画（ストロークのみ）。塗りアイコン禁止

## Components

- **button（CTA）**: `navy` 背景 / `offWhite` 文字 / 角丸 2px。ラベルは「相談する」「詳しく見る」「無料で相談する」。1ビューに CTA を増やしすぎない
- **buttonGhost**: 透明背景 / `black` 文字。副次アクション
- **card**: 白サーフェス、余白 32px。Before/After は2枚を静かに並べる（矢印は使わない）
- **specLabel**: モノスペースで素材・号数・日付・Reform番号を表示。LE LABO の「SANTAL 33」ラベル感
- **pageSurface**: `offWhite` 背景に `ink` 本文が基本

## Do's and Don'ts

**Do**
- 端的に置く。余白で語る。動詞で断つ
- 素材と工程で語る（Pt900、甲府の職人、手仕事）
- プロセスを見せる（研磨中の手元、道具、Before/After の変容）
- 経年変化・傷を肯定的に見せる（わびさび）
- ドライな本音を少しだけ（LE LABO 的ユーモア）
- 数字と事実で語る（「サイズ直し 8,800円〜」「約1ヶ月」）

**Don't**
- セリフ体、グラデーション、キラキラエフェクト、ソフトフォーカス、暖色演出
- 「特別」「唯一無二」「最高級」「即日」「最短」「No.1」「業界最安」「お客様の声」
- 緊急性・煽り・過度な値引き訴求、他社ブランドとの直接比較
- 完成品だけの「キレイな写真」（プロセスなき結果は信頼を生まない）
- 家族の形を限定する表現

---

> このファイルは [Google Labs DESIGN.md フォーマット](https://github.com/google-labs-code/design.md) 準拠の正本。
> 全リポジトリの UI・クリエイティブはこのトークンとトーンに従う。
> 詳細なブランド規定は `skills/bispoke-brand-guidelines.md` を参照。
> 検証: `npx @google/design.md lint DESIGN.md` / 書き出し: `npx @google/design.md export --format css-tailwind DESIGN.md`
