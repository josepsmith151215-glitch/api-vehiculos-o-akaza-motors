process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
﻿import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import vehiculoRoutes from './routes/vehiculo.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.get(['/estado', '/estado.html'], (req, res) => res.redirect('/servidor.html'));
const PORT = process.env.PORT || 3000;
const rootDir = path.join(__dirname, '../');

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(rootDir));

// Mapeo explícito de páginas HTML
app.get('/', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
app.get('/catalogo', (req, res) => res.sendFile(path.join(rootDir, 'catalogo.html')));
app.get('/catalogo.html', (req, res) => res.sendFile(path.join(rootDir, 'catalogo.html')));
app.get('/servidor', (req, res) => res.sendFile(path.join(rootDir, 'servidor.html')));
app.get('/servidor.html', (req, res) => res.sendFile(path.join(rootDir, 'servidor.html')));

// API REST
app.use('/api', vehiculoRoutes);

// 404 para rutas no existentes
app.use((req, res) => {
app.get(['/estado', 'https://akaza-motors-production.up.railway.app/servidor.html'], (req, res) => res.redirect('/servidor.html'));
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`✅ Akaza Motors activo en: http://localhost:${PORT}`);
});
