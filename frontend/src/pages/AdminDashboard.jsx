import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Search, Trash2, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let url = `/api/admin/users?page=${page}&limit=5`;
      if (roleFilter) url += `&role=${roleFilter}`;
      
      const { data } = await axios.get(url, config);
      setUsers(data.users);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return fetchUsers();
    
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/admin/search?query=${searchQuery}`, config);
      setUsers(data);
      setTotalPages(1); // Disable pagination on search
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchUsers();
    }
  }, [page, roleFilter, searchQuery]);

  const confirmDelete = (usr) => {
    setUserToDelete(usr);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/admin/users/${userToDelete._id}`, config);
      setShowModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">A list of all the users in your account including their name, role, and email.</p>
        </div>
        
        <div className="toolbar">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-bar">
              <Search className="search-icon" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                placeholder="Search name/ID..." />
            </div>
            <button type="submit" className="btn-primary" style={{width: 'auto'}}>
              Search
            </button>
          </form>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select-input"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No users found.</td></tr>
            ) : (
              users.map((person) => (
                <tr key={person._id}>
                  <td>
                    <div style={{fontWeight: 500}}>{person.name}</div>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{person.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${person.role === 'admin' ? 'badge-admin' : 'badge-student'}`}>
                      {person.role}
                    </span>
                  </td>
                  <td>
                    {new Date(person.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {person.role !== 'admin' && (
                      <button onClick={() => confirmDelete(person)} className="action-btn delete">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {!searchQuery && totalPages > 1 && (
          <div className="pagination">
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </p>
            <div className="pagination-controls">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="pagination-btn">Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="pagination-btn">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="icon-danger">
                <ShieldAlert size={24} />
              </div>
              <h3 className="modal-title">Delete User</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{userToDelete?.name}</strong>? All of their data will be permanently removed. This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button type="button" onClick={handleDelete} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
