(function () {
  fetch("http://127.0.0.1:8000/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: window.location.href,
      referrer: document.referrer || "direct"
    })
  });
})();