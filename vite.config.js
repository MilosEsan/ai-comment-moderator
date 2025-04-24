import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/index.jsx'],
            refresh: true,
            buildDirectory: 'build',
        }),
        react({
            jsxRuntime: 'automatic', // Automatski JSX runtime
        }),
    ],
    define: {
        global: 'globalThis'  
      },
    resolve: {
        extensions: ['.js', '.jsx'], // Dodajte podršku za .jsx fajlove
    },
});