const getApiHost = () => {
  // If running in browser, adapt to the current hostname (e.g. 192.168.x.x or localhost)
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    // Production domain
    if (hostname === "app.bestshopsathy.in") {
      return "https://app.bestshopsathy.in";
    }
    // Local development (works for localhost, 127.0.0.1, or local network IP like 192.168.x.x)
    return `http://${hostname}:5001`;
  }
  return process.env.REACT_APP_API_HOST || "http://localhost:5001";
};

const apiHost = getApiHost();
export default apiHost;
