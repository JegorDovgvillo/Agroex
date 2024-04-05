import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    base: env.VITE_BASE_URL,

    plugins: [react()],
    resolve: {
      alias: {
        '@assets': '/src/assets',
        '@icons': '/src/assets/icons',
        '@components': '/src/components',
        '@buttons': '/src/components/buttons',
        '@customModals': '/src/components/customModals',
        '@customTextField': '/src/components/customTextField',
        '@customSelect': '/src/components/customSelect',
        '@helpers': '/src/helpers',
        '@pages': '/src/pages',
        '@scss': '/src/scss',
        '@store': '/src/store',
        '@thunks': '/src/store/thunks',
        '@slices': '/src/store/slices',
        '@selectors': '/src/store/selectors',
      },
    },
  });
};
