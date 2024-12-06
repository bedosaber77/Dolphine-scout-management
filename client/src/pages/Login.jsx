// import Form from 'react-bootstrap/Form';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
import '../styles/formInputs.css';
import { useState } from 'react';
import { useAuth } from '../hooks/AuthProvider';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== '' && password !== '') {
      const input = { email, password };
      auth.loginAction(input, (path) => navigate(path));
      console.log(auth.isAuthenticated);
      return;
    }
    alert('please provide a valid input');
  };

  return (
    <div
      className="flex flex-col max-w-md p-6 rounded-md sm:p-10"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="mb-8 text-center">
        <h1
          className="my-3 text-4xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Sign in
        </h1>
        <p className="text-sm" style={{ color: 'var(--secondary-color)' }}>
          Sign in to access your account
        </p>
      </div>
      <form
        noValidate=""
        onSubmit={handleSubmit}
        action=""
        className="space-y-12"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              Email address
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              id="email"
              placeholder="leroy@jenkins.com"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <NavLink
                rel="noopener noreferrer"
                href="#"
                className="text-xs hover:underline dark:text-gray-600"
              >
                Forgot password?
              </NavLink>
            </div>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              id="password"
              placeholder="*****"
              className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <button
              type="submit"
              className="w-full px-8 py-3 font-semibold rounded-md dark:text-gray-50"
              style={{ backgroundColor: 'var(--secondary-color)' }}
            >
              Sign in
            </button>
          </div>
          <p className="px-6 text-sm text-center dark:text-gray-600">
            Don&apos;t have an account yet?
            <NavLink to="/register">Register</NavLink>.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
