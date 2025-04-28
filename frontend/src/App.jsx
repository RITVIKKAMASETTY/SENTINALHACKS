import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login.jsx';
import Arogyakosh from './pages/index.jsx';

import PtDashboard from './pages/ptDashboard.jsx';
import HspDashboard from './pages/hspDashboard.jsx';
import DrDashboard from './pages/drDashboard.jsx';
import PtReg from './pages/ptReg.jsx';
import Pts from './pages/pts.jsx';
import Community from './pages/community.jsx';
import HspDoc from './pages/hspDoc.jsx';
import ViewDoc from './pages/viewDoc.jsx';
import VirtualDr from './pages/virtualDr.jsx';
import PtUpload from './pages/ptUpload.jsx';

function App() {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Arogyakosh />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Legacy routes - keep for compatibility */}
      <Route path="/route/patient-dashboard/:id" element={<PtDashboard />} />
      <Route path="/route/hospital-dashboard/:id" element={<HspDashboard />} />
      <Route path="/route/doctor-dashboard/:id" element={<DrDashboard />} />
      
      {/* Additional routes */}
      <Route path="/route/add-patient" element={<PtReg />} />
      <Route path="/route/hospital-patients" element={<Pts />} />
      <Route path="/route/community" element={<Community />} />
      <Route path="/route/patient-documents/:id" element={<HspDoc />} />
      <Route path="/route/patient-upload" element={<PtUpload />} />
      <Route path="/route/access-document" element={<ViewDoc />} />
      <Route path="/route/chat" element={<VirtualDr />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;