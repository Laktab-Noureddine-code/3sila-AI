export default async function handler(req, res) {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

  // Extract the path from the URL (remove /api prefix)
  const targetPath = req.url.replace(/^\/api/, "");
  const targetUrl = `${BACKEND_URL}${targetPath}`;

  try {
    // Build headers, forwarding all relevant ones
    const headers = {};

    // Forward content-type if present
    if (req.headers["content-type"]) {
      headers["Content-Type"] = req.headers["content-type"];
    }

    // Forward authorization
    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization;
    }

    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Handle request body
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      const contentType = req.headers["content-type"] || "";

      if (typeof req.body === "string") {
        // Already a string, send as-is
        fetchOptions.body = req.body;
      } else if (Buffer.isBuffer(req.body)) {
        // Buffer, send as-is
        fetchOptions.body = req.body;
      } else if (typeof req.body === "object") {
        // Vercel parsed the body into an object
        if (contentType.includes("application/x-www-form-urlencoded")) {
          // Convert object back to URL-encoded string
          fetchOptions.body = new URLSearchParams(req.body).toString();
        } else {
          // JSON content
          fetchOptions.body = JSON.stringify(req.body);
        }
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    // Forward status and content-type
    res.status(response.status);
    if (response.headers.get("content-type")) {
      res.setHeader("Content-Type", response.headers.get("content-type"));
    }

    res.send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Proxy request failed",
      details: error.message,
    });
  }
}
