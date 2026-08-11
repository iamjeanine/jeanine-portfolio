
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
    </HashRouter>
  );
}

export default App;
