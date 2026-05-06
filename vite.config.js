import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'scraper-api',
      configureServer(server) {
        server.middlewares.use('/api/scrape', (req, res) => {
          console.log('Triggering autoScraper...');
          exec('node scripts/autoScraper.js', (error, stdout, stderr) => {
            if (error) {
              console.error(`Scraper error: ${error}`);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: error.message, details: stderr }));
              return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, log: stdout }));
          });
        });
      }
    }
  ],
})
