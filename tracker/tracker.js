(function () {
  var siteKey = document.currentScript.getAttribute("data-site");
  if (!siteKey) return;

  var payload = JSON.stringify({
    site_key: siteKey,
    url: window.location.href,
    referrer: document.referrer || "direct"
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("https://pane-analytics.in/collect", new Blob([payload], { type: "text/plain" }));
  } else {
    fetch("https://pane-analytics.in/collect", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: payload,
      keepalive: true
    });
  }
})();
