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

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Student Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your personal and academic details.</p>
        </div>
        
        {message.text && (
          <div className={`p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            {/* User Details */}
            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-indigo-600 mb-4 border-b pb-2">Basic Information</h4>
            </div>

            <div className="sm:col-span-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User className="mr-2 h-4 w-4 text-gray-400" /> Full name
              </label>
              <div className="mt-1">
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Mail className="mr-2 h-4 w-4 text-gray-400" /> Email address
              </label>
              <div className="mt-1">
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            {/* Academic Details */}
            <div className="sm:col-span-6 mt-6">
              <h4 className="text-md font-medium text-indigo-600 mb-4 border-b pb-2">Academic Information</h4>
            </div>

            <div className="sm:col-span-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Hash className="mr-2 h-4 w-4 text-gray-400" /> Student ID
              </label>
              <div className="mt-1">
                <input type="text" disabled value={studentDetails.studentId}
                  className="bg-gray-100 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <BookOpen className="mr-2 h-4 w-4 text-gray-400" /> Course
              </label>
              <div className="mt-1">
                <input type="text" value={studentDetails.course} onChange={(e) => setStudentDetails({ ...studentDetails, course: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin className="mr-2 h-4 w-4 text-gray-400" /> Branch
              </label>
              <div className="mt-1">
                <input type="text" value={studentDetails.branch} onChange={(e) => setStudentDetails({ ...studentDetails, branch: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="mr-2 h-4 w-4 text-gray-400" /> Year
              </label>
              <div className="mt-1">
                <input type="text" value={studentDetails.year} onChange={(e) => setStudentDetails({ ...studentDetails, year: e.target.value })}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>
            
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
