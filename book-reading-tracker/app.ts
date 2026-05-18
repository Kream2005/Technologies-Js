import connect from './src/config/db.ts';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bookRoutes from './src/routes/bookRoutes.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 2004;

app.use(express.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}
	next();
});
app.use('/', bookRoutes);
app.use(
	express.static(path.join(__dirname, 'public'), {
		setHeaders: (res, filePath) => {
			if (filePath.endsWith('.ts')) {
				res.setHeader('Content-Type', 'text/javascript');
			}
		}
	})
);

app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start() {
	await connect();
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
}

start().catch((error) => {
	console.error('Startup failed:', error);
});