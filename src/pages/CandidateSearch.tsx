import { useState } from 'react';
import { searchGithubUser } from '../api/API';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  location: string | null;
  email: string | null;
  company: string | null;
}

const CandidateSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const user = await searchGithubUser(searchTerm);
      if (user) {
        setUsers([user]);
      } else {
        setError('User not found');
        setUsers([]);
      }
    } catch (err) {
      setError('Failed to fetch user');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCandidate = (user: GitHubUser) => {
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    if (!savedCandidates.some((candidate: GitHubUser) => candidate.id === user.id)) {
      localStorage.setItem('savedCandidates', JSON.stringify([...savedCandidates, user]));
      alert('Candidate saved!');
    } else {
      alert('Candidate already saved!');
    }
  };

  return (
    <div className="container mx-auto p-4 pb-0"> {/* Changed p-4 to include pb-0 */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2" style={{marginBottom: '15px' }}>
          <div className="flex items-center justify-center mb-4 mt-4">
          <h1 
            className="text-2xl font-bold"
            style={{ color: '#FFFFFF' }}
          >
            Candidate Search
          </h1>
        </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter GitHub username..."
            className="flex-1 p-2 border rounded"
          />&nbsp;&nbsp;
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="overflow-hidden rounded-lg shadow-lg" style={{marginBottom: '0'}}> {/* Changed marginBottom from 50px to 0 */}
            <div className="w-full flex flex-col">
              <div className="flex-shrink-0">
                <img 
                  src={user.avatar_url} 
                  alt={user.login}
                  style={{ 
                    borderTopLeftRadius: '15px', 
                    borderTopRightRadius: '15px',
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    display: 'block' // This removes any extra space
                  }}
                  className="border-4 border-gray-200"
                />
              </div>
              <div className="space-y-12 px-10 pb-10 w-full" style={{ backgroundColor: '#000000', marginTop: '-4px' }}>
                {/* Name section */}
                <div style={{marginLeft: '10px', padding: '10px 0 2px 0'}}>
                  <span style={{ color: '#FFFFFF' }} className="font-bold text-lg mr-3">Name: </span>
                  <span style={{ color: '#FFFFFF' }}>{user.name || 'Not available'}</span>
                </div>

                {/* Username section */}
                <div className="py-6" style={{marginLeft: '10px', marginTop: '15px', marginBottom: '15px' }}>
                  <span style={{ color: '#FFFFFF' }} className="font-bold text-lg mr-3">Username: </span>
                  <span style={{ color: '#FFFFFF' }}>@{user.login}</span>
                </div>

                {/* Location section */}
                <div className="py-6" style={{marginLeft: '10px', marginTop: '15px', marginBottom: '15px' }}>
                  <span style={{ color: '#FFFFFF' }} className="font-bold text-lg mr-3">Location: </span>
                  <span style={{ color: '#FFFFFF' }}>{user.location || 'Not available'}</span>
                </div>

                {/* Email section */}
                <div className="py-6" style={{marginLeft: '10px', marginTop: '15px', marginBottom: '15px' }}>
                  <span style={{ color: '#FFFFFF' }} className="font-bold text-lg mr-3">Email: </span>
                  <span style={{ color: '#FFFFFF' }}>{user.email || 'Not available'}</span>
                </div>

                {/* Company section */}
                <div style={{marginLeft: '10px', padding: '2px 0 10px 0'}}>
                  <span style={{ color: '#FFFFFF' }} className="font-bold text-lg mr-3">Company: </span>
                  <span style={{ color: '#FFFFFF' }}>{user.company || 'Not available'}</span>
                </div>

                {/* Buttons section */}
                {user && user.html_url && (  // Only show if user and profile URL exist
                  <div className="border-t border-gray-700 pt-8 pb-4">
                    <div className="w-full flex justify-center">
                      <div style={{ display: 'flex', width: '100%', maxWidth: '170px', justifyContent: 'space-between', marginLeft: '140px' }}>
                        <button
                          onClick={() => window.open(user.html_url, '_blank')}
                          className="text-green-500 hover:text-green-600"
                          title="View Profile"
                        >
                          <FaMinusCircle size={40} />
                        </button>&nbsp;&nbsp;                                       
                        <button
                          onClick={() => saveCandidate(user)}
                          className="text-green-500 hover:text-green-600"
                          title="Save Candidate"
                        >
                          <FaPlusCircle size={40} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateSearch;
