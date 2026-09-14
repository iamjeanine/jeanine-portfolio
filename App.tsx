
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react';

// Owner exclusion: visiting ghostmode.studio/?me=1 once in a browser marks
// it as Jeanine's; every visit from that browser is then dropped before it
// reaches Vercel Analytics. /?me=0 clears the mark. Per browser, per device.
const OWNER_KEY = 'gm-owner';
try {
  const params = new URLSearchParams(window.location.search);
  if (params.get('me') === '1') window.localStorage.setItem(OWNER_KEY, '1');
  if (params.get('me') === '0') window.localStorage.removeItem(OWNER_KEY);
} catch {
  // Private-mode storage failures just mean this visit counts normally.
}
// Hash routes are invisible to Vercel Analytics: every route under HashRouter
// reports as "/", because the server derives the page from the URL path and the
// hash never reaches it. Route changes do fire pageviews (hash history calls
// pushState, which the analytics script patches), so the counts are right and
// only the labels are lost. Folding the hash into the pathname before the event
// leaves gives each chapter and project detail page its own row.
const foldHashIntoPath = (rawUrl: string) => {
  const url = new URL(rawUrl);
  const route = url.hash.match(/^#(\/[^?#]*)/);
  if (!route) return rawUrl;
  const [, pathname] = route;
  url.pathname = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  url.hash = '';
  return url.toString();
};

const analyticsBeforeSend = (event: BeforeSendEvent) => {
  try {
    if (window.localStorage.getItem(OWNER_KEY) === '1') return null;
  } catch {
    // fall through: count the visit
  }
  try {
    return { ...event, url: foldHashIntoPath(event.url) };
  } catch {
    // A URL we cannot parse still counts, just under its original label.
    return event;
  }
};
import ProjectDetailPage from './pages/ProjectDetailPage';
import VisualAudiobooksProject from './components/VisualAudiobooksProject';
import { PROJECTS } from './constants';
import ProductionsPreviewPage from './pages/ProductionsPreviewPage';
import LabsPreviewPage from './pages/LabsPreviewPage';
import SpinePreviewPage from './pages/SpinePreviewPage';
import CoverOptionsPreviewPage from './pages/CoverOptionsPreviewPage';

const isLocalPreview =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const AUDIOBOOK_PATH = '/project/visual-audiobooks';

// Existing hash links still work, but visitors leave with the shareable URL.
function AudiobookShareRedirect() {
  useEffect(() => {
    window.location.replace(`${AUDIOBOOK_PATH}${window.location.search}`);
  }, []);
  return <a href={AUDIOBOOK_PATH}>Open Visual Audiobooks</a>;
}

function App() {
  // This entry has its own build-time HTML metadata. It uses the same
  // presentation component, without changing routing for the other projects.
  if (window.location.pathname.replace(/\/$/, '') === AUDIOBOOK_PATH) {
    const project = PROJECTS.find(project => project.id === 'visual-audiobooks')!;
    return <>
      <VisualAudiobooksProject
        prototypeUrl={project.liveUrl!}
        onClose={() => window.location.assign('/#/labs')}
      />
      {!isLocalPreview && <Analytics beforeSend={analyticsBeforeSend} />}
    </>;
  }
  return (
    <HashRouter>
      <Routes>
        {/* Keep the Cover and chapter URLs on one route definition. Using
            separate / and /:chapter routes remounted the full spine on every
            chapter click, so the route's mount effect replaced the intended
            smooth scroll with an instant jump. */}
        <Route path="/:chapter?" element={<SpinePreviewPage />} />
        <Route path="/project/visual-audiobooks" element={<AudiobookShareRedirect />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/preview/productions" element={<ProductionsPreviewPage />} />
        <Route path="/preview/labs" element={<LabsPreviewPage />} />
        <Route path="/preview/spine/:chapter?" element={<SpinePreviewPage />} />
        <Route path="/preview/cover-options" element={<CoverOptionsPreviewPage />} />
      </Routes>
      {!isLocalPreview && <Analytics beforeSend={analyticsBeforeSend} />}
    </HashRouter>
  );
}

export default App;
