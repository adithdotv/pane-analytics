(function () {
  fetch("https://pane-analytics.in/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: window.location.href,
      referrer: document.referrer || "direct"
    })
  });
})();