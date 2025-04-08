import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavProps {
  setSearchTerm: (term: string) => void;
  setUsers: (users: []) => void;
  setError: (error: null) => void;
}

const Nav: React.FC<NavProps> = ({ setSearchTerm, setUsers, setError }) => {
  const navigate = useNavigate();

  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      // Clear all states immediately
      await Promise.all([
        setUsers([]),
        setSearchTerm(''),
        setError(null)
      ]);
      
      // Force navigation and state reset
      window.history.pushState({}, '', '/');
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  return (
    <nav className="w-full relative mt-0">
      <div className="flex items-center">
        <Link 
          to="/"
          className="font-bold absolute left-0 ml-[-16px]"
          style={{ color: '#FFFFFF' }}
          onClick={handleReset}
        >
          Home
        </Link>&nbsp;&nbsp;&nbsp;&nbsp;
        <Link 
          to="/SavedCandidates"
          className="font-bold absolute left-20"
          style={{ color: '#FFFFFF' }}
        >
          Potential Candidates
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
