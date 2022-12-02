import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import YAML from "yaml";

const generateHtml = (spec) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="SwaggerUI"
    />
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
  </head>
  <body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec: ${JSON.stringify(spec)},
        dom_id: '#swagger-ui'
      });
    };
  </script>
  </body>
  </html>`;
};

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const docs = fs.readFileSync(path.resolve(__dirname, "./docs.yml"), "utf8");
const spec = YAML.parse(docs);
const html = generateHtml(spec);
if (!fs.existsSync(path.resolve(__dirname, "./dist"))) {
  fs.mkdirSync(path.resolve(__dirname, "./dist"));
}
fs.writeFileSync(path.resolve(__dirname, "./dist/docs.html"), html);
console.log(`Documentation generated at ${path.resolve(__dirname, "./dist/docs.html")}`);
