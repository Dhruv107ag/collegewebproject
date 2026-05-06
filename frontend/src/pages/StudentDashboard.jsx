import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { User, Mail, BookOpen, Hash, MapPin, Calendar } from 'lucide-react';

const StudentDashboard = () => {
  const { user: authUser, setUser: setAuthUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [studentDetails, setStudentDetails] = useState({ studentId: '', course: '', branch: '', year: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${authUser.token}` } };
        
        // Fetch User Info
        const userRes = await axios.get('/api/users/me', config);
        setProfile({ name: userRes.data.name, email: userRes.data.email });

        // Fetch Student Info
        const studentRes = await axios.get('/api/students/me', config);
        setStudentDetails({
          studentId: studentRes.data.studentId,
          course: studentRes.data.course,
          branch: studentRes.data.branch,
          year: studentRes.data.year,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${authUser.token}` } };
      
      // Update User Info
      const { data: updatedUser } = await axios.put('/api/users/me', profile, config);
      
      // Update Student Info
      await axios.put('/api/students/me', studentDetails, config);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setAuthUser({ ...authUser, name: updatedUser.name, email: updatedUser.email });
      localStorage.setItem('userInfo', JSON.stringify({ ...authUser, name: updatedUser.name, email: updatedUser.email }));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)'}}>Loading profile...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Student Profile</h1>
        <p className="page-subtitle">Manage your personal and academic details.</p>
      </div>
      
      <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="card-header">
          <h3 className="card-title">Profile Details</h3>
        </div>
        
        {message.text && (
          <div className="error-msg" style={{
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: message.type === 'success' ? '#34d399' : '#fca5a5'
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* User Details */}
          <h4 style={{fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>
            Basic Information
          </h4>
          
          <div className="dashboard-grid" style={{marginBottom: '1rem'}}>
            <div className="form-group">
              <label className="form-label flex" style={{alignItems: 'center', gap: '8px'}}>
                <User size={16} /> Full name
              </label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label flex" style={{alignItems: 'center', gap: '8px'}}>
                <Mail size={16} /> Email address
              </label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="form-input" />
            </div>
          </div>

          {/* Academic Details */}
          <h4 style={{fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '2rem'}}>
            Academic Information
          </h4>

          <div className="dashboard-grid">
            <div className="form-group">
              <label className="form-label flex" style={{alignItems: 'center', gap: '8px'}}>
                <Hash size={16} /> Student ID
              </label>
              <input type="text" disabled value={studentDetails.studentId}
                className="form-input" style={{opacity: 0.6, cursor: 'not-allowed'}} />
            </div>

            <div className="form-group">
              <label className="form-label flex" style={{alignItems: 'center', gap: '8px'}}>
                <BookOpen size={16} /> Course
              </label>
              <input type="text" value={studentDetails.course} onChange={(e) => setStudentDetails({ ...studentDetails, course: e.target.value })}
                className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label flex" style={{alignItems: 'center', gap: '8px'}}>
                <MapPin size={16} /> Branch
              </label>
              <input type="text" value={studentDetails.branch} onChange={(e) => setStudentDetails({ ...studentDetails, branch: e.target.value })}
                className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label flex" style={{alignItems: 'center', gap: '8px'}}>
                <Calendar size={16} /> Year
              </label>
              <input type="text" value={studentDetails.year} onChange={(e) => setStudentDetails({ ...studentDetails, year: e.target.value })}
                className="form-input" />
            </div>
          </div>
          
          <div style={{marginTop: '2rem', textAlign: 'right'}}>
            <button type="submit" className="btn-primary" style={{width: 'auto', padding: '0.8rem 2rem'}}>
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
