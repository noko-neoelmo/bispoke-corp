/**
 * 口コミっとくん — 非公開フィードバック受け口
 *
 * 低評価のお客様が「店舗に直接つたえる」を選んだときに呼ばれる。
 * 公開はせず、店舗へ届けるための内部チャネルに転送する。
 *
 * 必要な環境変数（任意）:
 *   KUCHIKOMI_FEEDBACK_WEBHOOK - Slack/Discord/LINE Notify 等の汎用Webhook URL。
 *                                未設定なら転送せず 200 を返す（サーバ側に保存しない）。
 *
 * クライアントは POST /api/kuchikomi-feedback に以下を送る:
 *   { storeId, storeName, rating, negatives[], text }
 */

function buildMessage(p) {
  var lines = [];
  lines.push("【口コミっとくん】非公開フィードバック");
  lines.push("店舗: " + (p.storeName || p.storeId || "不明"));
  lines.push("評価: 星" + (p.rating || "?"));
  if (p.negatives && p.negatives.length) lines.push("気になった点: " + p.negatives.join("、"));
  if (p.text) lines.push("内容: " + p.text);
  return lines.join("\n");
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

  var webhook = process.env.KUCHIKOMI_FEEDBACK_WEBHOOK;
  if (!webhook) {
    // 転送先未設定。サーバ側に個人情報を保存しない方針のため、受領のみ返す。
    return res.status(200).json({ ok: true, forwarded: false });
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Slack/Discord/LINE Notify 系で広く受理される { text, content } 両キーを送る
      body: JSON.stringify({ text: buildMessage(body), content: buildMessage(body) })
    });
    return res.status(200).json({ ok: true, forwarded: true });
  } catch (e) {
    return res.status(200).json({ ok: true, forwarded: false });
  }
};
