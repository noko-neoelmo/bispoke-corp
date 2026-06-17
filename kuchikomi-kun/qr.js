/* 口コミっとくん — QR表示 (vendored qrcode-generator) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  function targetUrl(storeId) {
    // このページ(qr.html)と同じディレクトリの index へ ?s= で着地
    var base = new URL("./", location.href);
    return base.href + "?s=" + encodeURIComponent(storeId);
  }

  function render(storeId) {
    var url = targetUrl(storeId);
    var qr = qrcode(0, "M");      // typeNumber=0 → 自動、誤り訂正レベル M
    qr.addData(url);
    qr.make();
    $("qr").innerHTML = qr.createImgTag(6, 8);  // cellSize=6, margin=8
    $("qr-url").textContent = url;

    // 店名を stores.json から引く（取れなければ店舗IDを表示）
    fetch("./stores.json", { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (stores) {
        var s = stores[storeId];
        $("qr-store").textContent = s ? s.name : storeId;
      })
      .catch(function () { $("qr-store").textContent = storeId; });
  }

  function boot() {
    var p = new URLSearchParams(location.search);
    var storeId = (p.get("s") || p.get("store") || "demo").trim();
    $("store-input").value = storeId;
    render(storeId);

    $("gen").addEventListener("click", function () {
      var id = $("store-input").value.trim() || "demo";
      history.replaceState(null, "", "?s=" + encodeURIComponent(id));
      render(id);
    });
    $("print").addEventListener("click", function () { window.print(); });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
