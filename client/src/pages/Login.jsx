import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import '../styles/login.css';
import { useState } from 'react';
import { useAuth } from '../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';

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
    <div className="login">
      <Form className="loginForm " onSubmit={handleSubmit}>
        <h2 className="text-center  mb-4" dir="rtl">
          تسجيل الدخول
        </h2>
        <Form.Group className="mb-3" controlId="formEmail">
          <FloatingLabel
            dir="rtl"
            lang="ar"
            controlId="floatingInput"
            label="الحساب الالكتروني"
            className="mb-3 form-label"
          >
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <FloatingLabel
            dir="rtl"
            lang="ar"
            controlId="floatingPassword"
            label="كلمة السر"
            className="mb-3 form-label"
          >
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" dir="rtl" controlId="checkBoxStaySigned">
          <Form.Check
            type="checkbox"
            id="autoSizingCheck"
            className="mb-2"
            label="تذكرني"
          />
        </Form.Group>
        <Form.Group className="mb-3 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary w-auto ">
            تسجيل الدخول
          </button>
        </Form.Group>
        <Form.Group dir="rtl" className="mb-3 center">
          <a href="/forgot-password" className="text-decoration-none">
            نسيت كلمة السر ؟
          </a>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Login;
