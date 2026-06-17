/**
 * 口コミっとくん — 口コミ下書き生成 (Claude)
 *
 * お客様がタップで選んだ感想から、自然な日本語のGoogle口コミ下書きを生成する。
 * Vercel Serverless Function。APIキーはサーバサイドのみ。
 *
 * 必要な環境変数:
 *   ANTHROPIC_API_KEY   - Anthropic APIキー（未設定なら定型文フォールバック）
 *   KUCHIKOMI_MODEL     - 任意。既定 claude-haiku-4-5（短文・低コスト・高速）
 *
 * クライアントは POST /api/kuchikomi-draft に以下のJSONを送る:
 *   { storeName, rating, experience, highlights[], freeword, variety }
 * レスポンス: { text, fallback }
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

// 禁止表現（広告・LP規定に準拠：誇大・最上級表現を避ける）
const SYSTEM_PROMPT = [
  "あなたは体験工房を利用したお客様本人になりきって、Googleに投稿する口コミの下書きを書きます。",
  "制約:",
  "- 一人称・お客様目線の自然な日本語。広告コピーではなく、実際の利用者の感想として書く。",
  "- 60〜160文字程度。1〜2文。誇張しない。",
  "- 入力された体験メニュー・良かった点・ひとことを自然に織り込む。事実を足さない（行っていない体験を書かない）。",
  "- 「最高」「No.1」「業界最安」「即日」などの誇大・最上級・煽り表現は使わない。",
  "- 絵文字やハッシュタグは付けない。店名は文中に入れてよい。",
  "- 出力は口コミ本文のみ。前置き・引用符・説明は一切付けない。"
].join("\n");

function buildUserPrompt(p) {
  var lines = [];
  lines.push("店名: " + (p.storeName || "（体験工房）"));
  lines.push("満足度: 星" + (p.rating || 5));
  if (p.experience) lines.push("体験したメニュー: " + p.experience);
  if (p.highlights && p.highlights.length) lines.push("良かった点: " + p.highlights.join("、"));
  if (p.freeword) lines.push("お客様のひとこと: " + p.freeword);
  if (p.variety) lines.push("※前回とは違う言い回し・構成で、新しい文面を書いてください。");
  lines.push("");
  lines.push("上記をもとに、このお客様が書きそうな口コミ本文を1つ書いてください。");
  return lines.join("\n");
}

// APIキー未設定・失敗時の定型文（クライアントでも同等のものを持つ）
function fallbackDraft(p) {
  var parts = [];
  if (p.experience) parts.push(p.experience + "を体験しました。");
  if (p.highlights && p.highlights.length) parts.push(p.highlights.join("、") + "です。");
  if (p.freeword) parts.push(p.freeword);
  parts.push("また利用したいです。");
  return parts.join("");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  var body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ text: fallbackDraft(body), fallback: true });
  }

  var model = process.env.KUCHIKOMI_MODEL || "claude-haiku-4-5";

  try {
    var resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(body) }]
      })
    });

    if (!resp.ok) {
      return res.status(200).json({ text: fallbackDraft(body), fallback: true });
    }
    var data = await resp.json();
    var text = "";
    if (data && Array.isArray(data.content)) {
      for (var i = 0; i < data.content.length; i++) {
        if (data.content[i].type === "text") text += data.content[i].text;
      }
    }
    text = (text || "").trim();
    if (!text) return res.status(200).json({ text: fallbackDraft(body), fallback: true });
    return res.status(200).json({ text: text, fallback: false });
  } catch (e) {
    return res.status(200).json({ text: fallbackDraft(body), fallback: true });
  }
};
