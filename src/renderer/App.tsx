import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from './Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
