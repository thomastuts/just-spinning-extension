import queryString from "query-string";

export default function isHostedOnTwitch() {
  try {
    if (window.location.ancestorOrigins) {
      return (
        window.location.ancestorOrigins.contains("https://www.twitch.tv") ||
        window.location.ancestorOrigins.contains("https://dashboard.twitch.tv") ||
        window.location.ancestorOrigins.contains("https://supervisor.ext-twitch.tv")
      );
    } else if (window.document.referrer) {
      return window.document.referrer.includes("twitch.tv");
    } else {
      const queryParams = queryString.parse(window.location.search);
      return queryParams.platform === "web";
    }
  } catch (err) {
    return true;
  }
}
