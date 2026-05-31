import { Suspense, useEffect, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { appRoutes } from './config/routeRegistry';
import { resolveMeta } from './config/routeMeta';
import { LoadingFallback } from './components/layout/LoadingFallback';

function PageMeta() {
  const location = useLocation();

  useEffect(() => {
    const meta = resolveMeta(location.pathname);
    document.title = meta.title;
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (desc) desc.content = meta.description;
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = meta.title;
    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = meta.description;
  }, [location.pathname]);

  return null;
}

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <>
      <PageMeta />
      <Routes>
        {appRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <LazyRoute>
                <Component />
              </LazyRoute>
            }
          />
        ))}
      </Routes>
    </>
  );
}
