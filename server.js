const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let conceptos = []; // acá se guardan los conceptos en memoria
let nextId = 1;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json'
};

// función para responder fácilmente
function send(res, status, data, contentType = 'application/json') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(typeof data === 'string' ? data : JSON.stringify(data));
}

// servidor
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // --- ENDPOINTS REST ---
  if (pathname === '/api/conceptos' && req.method === 'GET') {
    return send(res, 200, conceptos);
  }

  if (pathname.startsWith('/api/conceptos/') && req.method === 'GET') {
    const id = parseInt(pathname.split('/').pop());
    const concepto = conceptos.find(c => c.id === id);
    return concepto
      ? send(res, 200, concepto)
      : send(res, 404, { error: 'Concepto no encontrado' });
  }

  if (pathname === '/api/conceptos' && req.method === 'DELETE') {
    conceptos = [];
    nextId = 1;
    return send(res, 200, { message: 'Todos eliminados' });
  }

  if (pathname.startsWith('/api/conceptos/') && req.method === 'DELETE') {
    const id = parseInt(pathname.split('/').pop());
    const index = conceptos.findIndex(c => c.id === id);
    if (index === -1) return send(res, 404, { error: 'Concepto no encontrado' });
    const eliminado = conceptos.splice(index, 1);
    return send(res, 200, { message: 'Eliminado', concepto: eliminado });
  }

  // --- FORMULARIO (POST) ---
  if (pathname === '/agregar-concepto' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
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
  let filePath = pathname === '/' ? '/public/index.html' : pathname;
  filePath = path.join(__dirname, filePath.startsWith('/public') ? filePath : `/public${filePath}`);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Archivo no encontrado', 'text/plain');
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
