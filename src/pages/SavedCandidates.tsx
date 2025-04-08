import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMinusCircle } from 'react-icons/fa';

interface GitHubUser {
  id: number;
  name: string;
  login: string;
  location: string;
  avatar_url: string;
  email: string;
  html_url: string;
  company: string;
  bio: string;  // Add this line
}

type SortField = 'name' | 'location' | 'email' | 'company' | 'bio';
type SortDirection = 'asc' | 'desc';

const SavedCandidates = () => {
  const [candidates, setCandidates] = useState<GitHubUser[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const savedCandidates = localStorage.getItem('savedCandidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }
  }, []);

  const removeCandidate = (id: number) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to remove this candidate?');
    
    if (confirmDelete) {
      const updatedCandidates = candidates.filter(candidate => candidate.id !== id);
      setCandidates(updatedCandidates);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    }
  };

  const handleSort = (field: SortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedCandidates = [...candidates].sort((a, b) => {
      const aValue = (a[field] || '').toLowerCase();
      const bValue = (b[field] || '').toLowerCase();
      
      if (newDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    setCandidates(sortedCandidates);
  };

  const getFilteredCandidates = () => {
    return candidates.filter(candidate => {
      const nameMatch = !nameFilter || candidate.name?.toLowerCase().includes(nameFilter.toLowerCase());
      const locationMatch = !locationFilter || candidate.location?.toLowerCase().includes(locationFilter.toLowerCase());
      return nameMatch && locationMatch;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 
        className="text-2xl font-bold"
        style={{ color: '#FFFFFF' }}
      >
        Saved Candidates
      </h1>

      {/* Add Filter Inputs */}
      <div className="flex gap-4 mb-6 mt-4">
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      {/* Table Structure */}
      <table className="min-w-full bg-black shadow-lg rounded-lg overflow-hidden border-spacing-2" style={{ borderSpacing: '5px' }}>
        <thead className="bg-gray-800">
          <tr>
            <th className="p-5 m-5 text-left text-white font-bold" style={{ margin: '5px' }}>Image</th>
            <th 
              className="p-5 m-5 text-left text-white font-bold cursor-pointer hover:text-blue-300" 
              style={{ margin: '5px', cursor: 'pointer' }}
              onClick={() => handleSort('name')}
            >
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="p-5 m-5 text-left text-white font-bold cursor-pointer hover:text-blue-300" 
              style={{ margin: '5px', cursor: 'pointer' }}
              onClick={() => handleSort('location')}
            >
              Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="p-5 m-5 text-left text-white font-bold cursor-pointer hover:text-blue-300" 
              style={{ margin: '5px', cursor: 'pointer' }}
              onClick={() => handleSort('email')}
            >
              Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="p-5 m-5 text-left text-white font-bold cursor-pointer hover:text-blue-300" 
              style={{ margin: '5px', cursor: 'pointer' }}
              onClick={() => handleSort('company')}
            >
              Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="p-5 m-5 text-left text-white font-bold cursor-pointer hover:text-blue-300" 
              style={{ margin: '5px', cursor: 'pointer' }}
              onClick={() => handleSort('bio')}
            >
              Bio {sortField === 'bio' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-5 m-5 text-left text-white font-bold" style={{ margin: '5px' }}>Reject</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {getFilteredCandidates().map(candidate => (
            <tr key={candidate.id} className="hover:bg-gray-900">
              <td className="text-white" style={{ padding: '5px', margin: '5px', border: '1px solid transparent' }}>
                <a 
                  href={candidate.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img 
                    src={candidate.avatar_url} 
                    alt={candidate.login}
                    className="rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200"
                    style={{ 
                      width: '200px', 
                      height: '200px',
                      minWidth: '200px',
                      minHeight: '200px'
                    }}
                  />
                </a>
              </td>
              <td className="text-white" style={{ padding: '5px', margin: '5px', border: '1px solid transparent' }}>
                {candidate.name || 'Not available'}
              </td>
              <td className="text-white" style={{ padding: '5px', margin: '5px', border: '1px solid transparent' }}>
                {candidate.location || 'Not available'}
              </td>
              <td className="text-white" style={{ padding: '5px', margin: '5px', border: '1px solid transparent' }}>
                {candidate.email || 'Not available'}
              </td>
              <td className="text-white" style={{ padding: '5px', margin: '5px', border: '1px solid transparent' }}>
                {candidate.company || 'Not available'}
              </td>
              <td className="text-white" style={{ padding: '5px', margin: '5px', border: '1px solid transparent' }}>
                {candidate.bio || 'Not available'}
              </td>
              <td className="text-white" style={{ padding: '5px', margin: '5px', border: '1px solid transparent' }}>
                <button
                  onClick={() => removeCandidate(candidate.id)}
                  className="text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <FaMinusCircle size={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedCandidates;
