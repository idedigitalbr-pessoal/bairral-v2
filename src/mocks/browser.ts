import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  const enableMocks = import.meta.env.VITE_ENABLE_MOCKS !== 'false';

  if (enableMocks) {
    try {
      return await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
        serviceWorker: {
          url: '/mockServiceWorker.js',
          options: {
            updateViaCache: 'all',
          },
        },
      });
    } catch (error) {
      console.warn('MSW Service Worker não pôde ser iniciado no ambiente atual:', error);
    }
  }
}
