import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student',
    studentId: '', course: '', branch: '', year: ''
  });
  const [error, setError] = useState('');
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} minLength={6}
              className="form-input"
            />
          </div>

          <div className="mt-4 mb-4">
            <h3 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)'}}>Student Details</h3>
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input type="text" name="studentId" required value={formData.studentId} onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Course</label>
              <input type="text" name="course" required value={formData.course} onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="flex gap-4">
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Branch</label>
                <input type="text" name="branch" required value={formData.branch} onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Year</label>
                <input type="text" name="year" required value={formData.year} onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn-primary">
              Register
            </button>
          </div>
        </form>

        <div className="mt-4" style={{textAlign: 'center'}}>
          <Link to="/login" className="auth-link">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
