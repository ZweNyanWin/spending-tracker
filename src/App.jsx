// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import './App.css';

export default function App() {
  return (
    <BrowserRouter basename="/spending-tracker">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
