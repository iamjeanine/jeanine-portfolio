
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

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
const dropOwnerVisits = (event: { url: string }) => {
  try {
    if (window.localStorage.getItem(OWNER_KEY) === '1') return null;
  } catch {
    // fall through: count the visit
  }
  return event;
};
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProductionsPreviewPage from './pages/ProductionsPreviewPage';
import LabsPreviewPage from './pages/LabsPreviewPage';
import SpinePreviewPage from './pages/SpinePreviewPage';
import CoverOptionsPreviewPage from './pages/CoverOptionsPreviewPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SpinePreviewPage />} />
        <Route path="/:chapter" element={<SpinePreviewPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/preview/productions" element={<ProductionsPreviewPage />} />
        <Route path="/preview/labs" element={<LabsPreviewPage />} />
        <Route path="/preview/spine" element={<SpinePreviewPage />} />
        <Route path="/preview/spine/:chapter" element={<SpinePreviewPage />} />
        <Route path="/preview/cover-options" element={<CoverOptionsPreviewPage />} />
      </Routes>
      <Analytics beforeSend={dropOwnerVisits} />
    </HashRouter>
  );
}

export default App;
