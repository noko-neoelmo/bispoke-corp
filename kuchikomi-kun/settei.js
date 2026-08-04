/* 口コミっとくん — 設定ページ（バックエンド不要・設定はリンクに保存） */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var currentId = "";

  /* ---- base64url（UTF-8対応） ---- */
  function b64urlEncode(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64urlDecode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = atob(s), b = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(b);
  }

  function val(id) { return ($(id).value || "").trim(); }
  function lines(id) {
    return ($(id).value || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function slug(s) {
    var x = (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return x || "custom";
  }
  // フルURLならそのまま、Place IDだけなら writereview URL に組み立てる
  function normalizeGoogleUrl(v) {
    v = (v || "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(v);
  }

  function buildConfig() {
    var name = val("f-name");
    var cfg = {
      id: currentId || slug(name),
      name: name,
      googleReviewUrl: normalizeGoogleUrl(val("f-url")),
      experiences: lines("f-exp"),
      highlights: lines("f-hl")
    };
    var map = val("f-map"); if (map) cfg.mapUrl = map;
    var logo = val("f-logo"); if (logo) cfg.logoText = logo;
    var accent = val("f-accent"); if (accent && accent.toLowerCase() !== "#1b2a4a") cfg.accent = accent;
    var thanks = val("f-thanks"); if (thanks) cfg.thanks = thanks;
    var negs = lines("f-neg"); if (negs.length) cfg.negatives = negs;
    return cfg;
  }

  function customerUrl(b64) { return new URL("./", location.href).href + "#cfg=" + b64; }
  function editUrl(b64) { return new URL("settei.html", location.href).href + "#cfg=" + b64; }

  function generate() {
    var cfg = buildConfig();
    if (!cfg.name) { msg("店舗名を入力してください。", true); return; }
    if (!cfg.googleReviewUrl && !cfg.mapUrl) { msg("Google口コミURL または Googleマップのリンクのどちらかを入力してください。", true); return; }
    if (!cfg.experiences.length) { msg("体験メニューを1つ以上入力してください。", true); return; }

    var b64 = b64urlEncode(JSON.stringify(cfg));
    var cust = customerUrl(b64);
    $("out-url").textContent = cust;
    $("out-edit").textContent = editUrl(b64);

    var qr = qrcode(0, "M");
    qr.addData(cust);
    qr.make();
    $("admin-qr").innerHTML = qr.createImgTag(5, 8);

    $("result").style.display = "block";
    msg("作成しました。下のリンク／QRをご利用ください。", false);
  }

  function msg(t, isErr) {
    var el = $("msg"); el.textContent = t; el.style.color = isErr ? "#c0392b" : "#1a7f37";
  }

  function copy(text, btn, label) {
    var done = function () { var o = btn.textContent; btn.textContent = "コピーしました"; setTimeout(function () { btn.textContent = o; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done(); }
  }

  /* ---- 既存設定の読み込み（編集リンク #cfg= or 登録店舗 ?s=） ---- */
  function fillForm(cfg) {
    currentId = cfg.id || "";
    $("f-name").value = cfg.name || "";
    $("f-url").value = cfg.googleReviewUrl || "";
    $("f-map").value = cfg.mapUrl || "";
    $("f-logo").value = cfg.logoText || "";
    $("f-accent").value = cfg.accent || "#1B2A4A";
    $("f-exp").value = (cfg.experiences || []).join("\n");
    $("f-hl").value = (cfg.highlights || []).join("\n");
    $("f-neg").value = (cfg.negatives || []).join("\n");
    $("f-thanks").value = cfg.thanks || "";
  }

  function prefill() {
    var m = (location.hash || "").match(/cfg=([^&]+)/);
    if (m) {
      try { fillForm(JSON.parse(b64urlDecode(m[1]))); generate(); return; } catch (e) {}
    }
    var p = new URLSearchParams(location.search);
    var sid = p.get("s") || p.get("store");
    if (sid) {
      fetch("./stores.json", { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (stores) { if (stores[sid]) { fillForm(stores[sid]); currentId = sid; generate(); } })
        .catch(function () {});
    }
  }

  function boot() {
    $("gen").addEventListener("click", generate);
    $("copy").addEventListener("click", function () { copy($("out-url").textContent, $("copy")); });
    $("copy-edit").addEventListener("click", function () { copy($("out-edit").textContent, $("copy-edit")); });
    $("open").addEventListener("click", function () { window.open($("out-url").textContent, "_blank", "noopener"); });
    $("print").addEventListener("click", function () { window.print(); });
    prefill();
  }
  document.addEventListener("DOMContentLoaded", boot);
})();
