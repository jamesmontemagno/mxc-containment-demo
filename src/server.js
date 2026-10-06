import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { calculateTotal } from "./calculator.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/api/total") {
    const amount = Number(url.searchParams.get("amount"));
    const taxRate = Number(url.searchParams.get("taxRate"));
    if (!Number.isFinite(amount) || !Number.isFinite(taxRate) || amount < 0 || taxRate < 0) {
      response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Amount and tax rate must be non-negative numbers." }));
      return;
    }
    response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ total: calculateTotal(amount, taxRate) }));
    return;
  }

  const path = url.pathname === "/" ? "/index.html" : url.pathname;
  if (!["/index.html", "/styles.css", "/app.js"].includes(path)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  try {
    const extension = path.slice(path.lastIndexOf("."));
    const body = await readFile(new URL(`.${path}`, `file://${root}`));
    response.writeHead(200, { "content-type": contentTypes[extension] });
    response.end(body);
  } catch {
    response.writeHead(500);
    response.end("Unable to load the calculator.");
  }
});

const port = Number(process.env.PORT) || 4173;
server.listen(port, "127.0.0.1", () => {
  console.log(`Expense Calculator available at http://127.0.0.1:${port}`);
});
