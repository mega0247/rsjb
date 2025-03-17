export default {
  async fetch(request, env, ctx) {
    console.log("Request received:", request.url);

    // Function to generate a random string of a given length
    function generateRandomString(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    // Generate a random prefix and suffix (each 3 characters)
    function generateRandomPrefixSuffix() {
      return {
        prefix: generateRandomString(3), // 3-letter prefix (subdomain)
        suffix: generateRandomString(3)  // 3-letter suffix (end of path)
      };
    }

    // The URL where the user will ultimately be redirected.
    const originalRedirectUrl = "https://earthrelocation.com";

    // Function to generate an array of random links
    function generateRandomLinks(numLinks) {
      const links = [];
      for (let i = 0; i < numLinks; i++) {
        const { prefix, suffix } = generateRandomPrefixSuffix();
        // Build link in the format: http://<prefix>.127.0.0.1:8787/<suffix>
        const link = `http://${prefix}.127.0.0.1:8787/${suffix}`;
        links.push(link);
      }
      return links;
    }

    // Parse the request URL
    const url = new URL(request.url);
    const pathname = url.pathname; // e.g., "/generate" or "/hf3"
    console.log("Pathname:", pathname);

    // If the URL is exactly "/generate", display the list of random links.
    if (pathname === "/generate") {
      const randomLinks = generateRandomLinks(10); // Generate 10 random links

      let htmlResponse = '<html><body><h2>Generated URLs</h2><ul>';
      randomLinks.forEach(link => {
        // Use target="_blank" so that clicking opens in a new tab (avoid potential blocking)
        htmlResponse += `<li><a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></li>`;
      });
      htmlResponse += '</ul><button onclick="window.location.reload()">Generate New URLs</button></body></html>';

      return new Response(htmlResponse, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // For any other path (assumed to be a generated link), perform the redirect.
    // Here we assume the link will be in the form http://<random-prefix>.127.0.0.1:8787/<random-suffix>
    if (pathname.length > 1) {
      console.log("Detected generated link, redirecting to:", originalRedirectUrl);
      return Response.redirect(originalRedirectUrl, 301);
    }

    // Fallback response
    return new Response("Hello from the redirect worker!", {
      headers: { "Content-Type": "text/plain" }
    });
  },
};
