import react from '@vitejs/plugin-react-swc';
import { getViteConfig } from 'vitest/config';

export default getViteConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});
