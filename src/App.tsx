import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import SavedCandidates from './pages/SavedCandidates';
import CandidateSearch from './pages/CandidateSearch';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  return (
    <div className="pt-[15px] bg-blue-500">
      <Nav 
        setSearchTerm={setSearchTerm}
        setUsers={setUsers}
        setError={setError}
      />
      <Routes>
        <Route path="/" element={<CandidateSearch />} />
        <Route path="/SavedCandidates" element={<SavedCandidates />} />
      </Routes>
    </div>
  );
}

export default App;
