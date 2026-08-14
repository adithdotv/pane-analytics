(function () {
  var siteKey = document.currentScript.getAttribute("data-site");
  if (!siteKey) return;

  fetch("https://pane-analytics.in/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site_key: siteKey,
      url: window.location.href,
      referrer: document.referrer || "direct"
    })
  });
})();
