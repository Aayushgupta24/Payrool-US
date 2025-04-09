import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Debug log (remove after confirming)
  console.log('GROQ API Key length:', env.GROQ_API_KEY?.length || 0);
  console.log('GROQ API Key prefix:', env.GROQ_API_KEY?.substring(0, 4) || 'not found');

  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api/copilot': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/copilot/, '/openai/v1/chat/completions'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // Use env.GROQ_API_KEY instead of process.env
              const apiKey = env.GROQ_API_KEY;
              if (!apiKey) {
                console.error('GROQ_API_KEY is not defined in environment variables');
                return;
              }
              proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
              console.log('Sending Request with Authorization header');
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from:', req.url, 'Status:', proxyRes.statusCode);
              if (proxyRes.statusCode === 401) {
                console.error('Authentication failed. Check your GROQ_API_KEY.');
              }
            });
          }
        }
      },
      hmr: {
        overlay: true,
        clientPort: 5173,
        port: 5173
      },
      watch: {
        usePolling: true,
        interval: 100
      }
    },
    define: {
      'process.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY)
    }
  };
});
