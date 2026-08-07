
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProductionsPreviewPage from './pages/ProductionsPreviewPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/preview/productions" element={<ProductionsPreviewPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
