const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const publicRoutes = {
  "/": ["public/index.html", "text/html; charset=utf-8"],
  "/styles.css": ["public/styles.css", "text/css; charset=utf-8"],
  "/app.js": ["public/app.js", "text/javascript; charset=utf-8"],
  "/imagenes/logo-ucv.png": ["Imagenes/logo ucv.png", "image/png"],
  "/imagenes/logo-faces.jfif": ["Imagenes/LogoFacesUCV.jfif", "image/jpeg"],
};

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const route = publicRoutes[pathname];

  if (!route) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Página no encontrada");
    return;
  }

  const [relativeFile, contentType] = route;
  const filePath = path.join(ROOT, relativeFile);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.error(`No se pudo leer ${relativeFile}:`, error.message);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("No fue posible cargar el sitio");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": pathname === "/" ? "no-cache" : "public, max-age=86400",
    });
    response.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Concurso FACES disponible en http://localhost:${PORT}`);
});
