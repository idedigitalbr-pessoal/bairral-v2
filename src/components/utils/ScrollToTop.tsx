import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente utilitário para garantir que a página role até o topo (0, 0)
 * em qualquer transição de rota no React Router.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
