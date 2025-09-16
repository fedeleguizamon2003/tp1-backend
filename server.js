const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Array en memoria para guardar conceptos (⚠️ se borra al reiniciar el server)
let conceptos = [];
let nextId = 1;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json'
};

// Función helper para responder en JSON o texto
function send(res, status, data, contentType = 'application/json') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(typeof data === 'string' ? data : JSON.stringify(data));
}

// servidor
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // --- ENDPOINTS REST ---
  // GET: lista todos los conceptos
  if (pathname === '/api/conceptos' && req.method === 'GET') {
    return send(res, 200, conceptos);
  }

  // GET/:id → obtiene un concepto específico por id
  if (pathname.startsWith('/api/conceptos/') && req.method === 'GET') {
    const id = parseInt(pathname.split('/').pop());
    const concepto = conceptos.find(c => c.id === id);
    return concepto
      ? send(res, 200, concepto)
      : send(res, 404, { error: 'Concepto no encontrado' });
  }

  // DELETE: elimina todos los conceptos
  if (pathname === '/api/conceptos' && req.method === 'DELETE') {
    conceptos = [];
    nextId = 1;
    return send(res, 200, { message: 'Todos eliminados' });
  }

  // DELETE/:id → elimina un concepto en particular
  if (pathname.startsWith('/api/conceptos/') && req.method === 'DELETE') {
    const id = parseInt(pathname.split('/').pop());
    const index = conceptos.findIndex(c => c.id === id);
    if (index === -1) return send(res, 404, { error: 'Concepto no encontrado' });
    const eliminado = conceptos.splice(index, 1);
    return send(res, 200, { message: 'Eliminado', concepto: eliminado });
  }

  // --- FORMULARIO POST ---
  // Procesa datos enviados desde el formulario (x-www-form-urlencoded)
  if (pathname === '/agregar-concepto' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      // URLSearchParams → parsea el formulario
      const params = new URLSearchParams(body);
      const nombre = params.get('nombre');
      const desarrollo = params.get('desarrollo');
      if (!nombre || !desarrollo) return send(res, 400, { error: 'Faltan campos' });
      const nuevo = { id: nextId++, nombre, desarrollo };
      conceptos.push(nuevo);
      res.writeHead(302, { Location: '/' }); // redirige a la página principal
      res.end();
    });
    return;
  }

  // --- ARCHIVOS ESTÁTICOS ---
  // Sirve index.html, styles.css y app.js desde /public
  let filePath = pathname === '/' ? '/public/index.html' : pathname;
  filePath = path.join(__dirname, filePath.startsWith('/public') ? filePath : `/public${filePath}`);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Archivo no encontrado', 'text/plain');
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

// Levanta servidor en puerto 3000
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
