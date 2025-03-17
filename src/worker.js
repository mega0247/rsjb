export default {
  async fetch(request, env, ctx) {
    console.log("Request received:", request.url);

    function generateRandomString(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    function generateRandomPrefixSuffix() {
      return {
        prefix: generateRandomString(3), // 3-letter prefix (subdomain)
        suffix: generateRandomString(3)  // 3-letter suffix (end of path)
      };
    }

    const originalRedirectUrl = "https://earthrelocation.com";

    const trackingUrl = (code) => `https://www.google-analytics.com/collect?v=1&t=event&tid=UA-XXXXXXX-Y&cid=555&ec=redirect&ea=click&el=${code}&ev=1`;

    function generateRandomLinks(numLinks) {
      const links = [];
      for (let i = 0; i < numLinks; i++) {
        const { prefix, suffix } = generateRandomPrefixSuffix();
        const link = `https://${prefix}.eowsubluf.cfd/${suffix}`; // Uses the 3-letter prefix and suffix
        links.push(link);
      }
      return links;
    }

    const urlParts = new URL(request.url).pathname.split('/');
    console.log("URL parts:", urlParts);

    if (urlParts.length === 1 || urlParts[1] === "generate") {
      const randomLinks = generateRandomLinks(10); // Generate 10 links

      let htmlResponse = '<html><body><h2>Generated URLs</h2><ul>';
      randomLinks.forEach(link => {
        htmlResponse += `<li><a href="${link}">${link}</a></li>`;
      });
      htmlResponse += '</ul><button onclick="window.location.reload()">Generate New URLs</button></body></html>';

      return new Response(htmlResponse, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const randomCode = urlParts[1];
    if (randomCode) {
      const trackingRequestUrl = trackingUrl(randomCode);
      fetch(trackingRequestUrl).catch(err => console.log("Error sending analytics: ", err));
    }

    return Response.redirect(originalRedirectUrl, 301);
  },
};
