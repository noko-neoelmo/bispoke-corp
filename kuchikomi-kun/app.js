/* 口コミっとくん — 体験工房向け Google口コミ収集フロー (vanilla JS) */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var dl = function (event, extra) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event, tool: "kuchikomi-kun" }, extra || {}));
  };

  var state = {
    storeId: "demo",
    store: null,
    rating: 0,
    experience: "",
    highlights: [],
    negatives: []
  };

  var NEG_CHIPS = ["待ち時間が長かった", "説明がわかりにくかった", "スタッフの対応", "料金について", "仕上がり・品質", "店内の環境"];

  function show(id) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove("is-active");
    $(id).classList.add("is-active");
    window.scrollTo(0, 0);
  }

  function getStoreId() {
    var p = new URLSearchParams(location.search);
    return (p.get("s") || p.get("store") || "demo").trim();
  }

  // URLハッシュ #cfg=<base64url(JSON)> に埋め込まれた店舗設定を読む（管理ページが生成）
  function b64urlDecode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }
  function getEmbeddedConfig() {
    var m = (location.hash || "").match(/cfg=([^&]+)/);
    if (!m) return null;
    try { return JSON.parse(b64urlDecode(decodeURIComponent(m[1]))); }
    catch (e) { return null; }
  }

  // opts: { multi: boolean, onChange: function(value) }
  // multi=true → onChange receives an array; multi=false → a single string.
  function renderChips(container, items, opts) {
    container.innerHTML = "";
    items.forEach(function (label) {
      var b = document.createElement("button");
      b.className = "chip";
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", function () {
        if (opts.multi) {
          b.classList.toggle("on");
        } else {
          var sib = container.querySelectorAll(".chip");
          for (var i = 0; i < sib.length; i++) sib[i].classList.remove("on");
          b.classList.add("on");
        }
        var selected = Array.prototype.map.call(
          container.querySelectorAll(".chip.on"), function (c) { return c.textContent; });
        opts.onChange(opts.multi ? selected : (selected[0] || ""));
      });
      container.appendChild(b);
    });
  }

  function initStore(store) {
    document.documentElement.style.setProperty("--accent", store.accent || "#1B2A4A");
    $("brand").textContent = store.logoText || "";
    $("store-name").textContent = store.name || "";
    $("thanks-msg").textContent = store.thanks || "ありがとうございました。";

    // 体験メニュー（単一選択）
    renderChips($("chips-exp"), store.experiences || [], { multi: false, onChange: function (v) { state.experience = v; } });
    // よかった点（複数）
    renderChips($("chips-hl"), store.highlights || [], { multi: true, onChange: function (list) { state.highlights = list; } });
    // 気になった点（複数）— 設定があればそれを、無ければ既定を使用
    var negs = (store.negatives && store.negatives.length) ? store.negatives : NEG_CHIPS;
    renderChips($("chips-neg"), negs, { multi: true, onChange: function (list) { state.negatives = list; } });
  }

  /* ---- 評価 ---- */
  function setupStars() {
    var stars = document.querySelectorAll(".star");
    stars.forEach(function (s) {
      s.addEventListener("click", function () {
        var v = parseInt(s.getAttribute("data-v"), 10);
        state.rating = v;
        for (var i = 0; i < stars.length; i++)
          stars[i].classList.toggle("on", i < v);
        $("star-hint").textContent = v >= 4 ? "ありがとうございます！" : "ご意見をお聞かせください";
        dl("kk_rate", { rating: v });
        setTimeout(function () { show(v >= 4 ? "screen-positive" : "screen-private"); }, 320);
      });
    });
  }

  /* ---- 下書き生成 ---- */
  function buildDraft(regen) {
    var btn = $("btn-make");
    var orig = btn.textContent;
    btn.disabled = true; btn.innerHTML = '<span class="spin"></span>下書きを作成中…';
    var payload = {
      storeName: state.store.name,
      rating: state.rating,
      experience: state.experience,
      highlights: state.highlights,
      freeword: $("freeword").value.trim(),
      variety: !!regen
    };
    return fetch("/api/kuchikomi-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); })
      .then(function (data) {
        $("draft").value = (data && data.text) || localDraft(payload);
        $("draft-note").textContent = data && data.fallback
          ? "※ かんたんな定型文です。ご自由に書き換えてください。"
          : "※ AIによる下書きです。あなたの言葉に書き換えてから投稿してください。";
        dl("kk_draft", { fallback: !!(data && data.fallback), regen: !!regen });
        show("screen-draft");
      })
      .catch(function () {
        $("draft").value = localDraft(payload);
        $("draft-note").textContent = "※ ご自由に書き換えてから投稿してください。";
        show("screen-draft");
      })
      .finally(function () { btn.disabled = false; btn.textContent = orig; });
  }

  // オフライン/未設定時のフォールバック下書き
  function localDraft(p) {
    var parts = [];
    if (p.experience) parts.push(p.experience + "を体験しました。");
    if (p.highlights && p.highlights.length) parts.push(p.highlights.join("、") + "です。");
    if (p.freeword) parts.push(p.freeword);
    parts.push("また利用したいです。");
    return parts.join("");
  }

  /* ---- 投稿 ---- */
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(t).catch(function () { return legacyCopy(t); });
    }
    return Promise.resolve(legacyCopy(t));
  }
  function legacyCopy(t) {
    var ta = document.createElement("textarea");
    ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function postToGoogle() {
    var txt = $("draft").value.trim();
    copyText(txt).then(function () {
      dl("kk_post", { rating: state.rating });
      var url = state.store.googleReviewUrl || state.store.mapUrl;
      if (url) window.open(url, "_blank", "noopener");
      $("thanks-title").textContent = "ありがとうございました";
      $("thanks-msg").textContent = "コピーした文章を、Googleの口コミ欄に貼り付けて投稿してください。";
      show("screen-thanks");
    });
  }

  /* ---- 非公開フィードバック ---- */
  function sendFeedback() {
    var btn = $("btn-fb-send");
    btn.disabled = true; btn.innerHTML = '<span class="spin"></span>送信中…';
    fetch("/api/kuchikomi-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId: state.storeId,
        storeName: state.store.name,
        rating: state.rating,
        negatives: state.negatives,
        text: $("fb-text").value.trim()
      })
    }).catch(function () {}).finally(function () {
      dl("kk_feedback", { rating: state.rating });
      $("thanks-title").textContent = "お聞かせいただき\nありがとうございます";
      $("thanks-msg").textContent = "いただいたご意見は、サービス改善に活かしてまいります。";
      show("screen-thanks");
    });
  }

  /* ---- 起動 ---- */
  function boot() {
    bindControls();

    // ① 管理ページが生成した埋め込み設定があれば最優先で使う（バックエンド不要の自己運用）
    var embedded = getEmbeddedConfig();
    if (embedded) {
      state.storeId = embedded.id || "custom";
      state.store = embedded;
      initStore(state.store);
      setupStars();
      dl("kk_view", { storeId: state.storeId, embedded: true });
      show("screen-rate");
      return;
    }

    // ② 通常は stores.json から ?s=店舗ID で読む
    state.storeId = getStoreId();
    fetch("./stores.json", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (stores) {
        state.store = stores[state.storeId] || stores["demo"];
        if (!state.store) throw new Error("no store");
        initStore(state.store);
        setupStars();
        dl("kk_view", { storeId: state.storeId });
        show("screen-rate");
      })
      .catch(function () {
        $("screen-loading").innerHTML = '<p class="loading">店舗情報を読み込めませんでした。</p>';
      });
  }

  function bindControls() {
    $("btn-make").addEventListener("click", function () { buildDraft(false); });
    $("btn-regen").addEventListener("click", function () {
      var b = $("btn-regen"); b.disabled = true; b.textContent = "作成中…";
      buildDraft(true).finally(function () { b.disabled = false; b.textContent = "別の文面にする"; });
    });
    $("btn-copy").addEventListener("click", function () {
      copyText($("draft").value.trim());
      $("btn-copy").textContent = "コピーしました";
      setTimeout(function () { $("btn-copy").textContent = "コピーだけ"; }, 1500);
    });
    $("btn-post").addEventListener("click", postToGoogle);
    $("btn-fb-send").addEventListener("click", sendFeedback);
    $("btn-to-private-1").addEventListener("click", function () { show("screen-private"); });
    $("btn-to-private-2").addEventListener("click", function () { show("screen-private"); });
    $("btn-to-google").addEventListener("click", function () {
      if (!$("draft").value.trim()) $("draft").value = localDraft({ experience: state.experience, highlights: state.highlights, freeword: "" });
      show("screen-draft");
    });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
