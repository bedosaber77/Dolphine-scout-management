// import Form from 'react-bootstrap/Form';
import { Form, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { useState } from 'react';

import registerInputs from '../data/registerInputs';
import FormInput from '../components/FormInput';
import { useAuth } from '../hooks/AuthProvider';

const Register = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    Fname: '',
    Lname: '',
    email: '',
    Phonenum: '',
    password: '',
    confirmPassword: '',
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const newValue = {confirmPassword:undefined,...values};
    auth.registerAction(values, (path) => navigate(path));
    console.log(auth.isAuthenticated);
    return;
  };

  console.log(values);

  return (
    <div className="login">
      <Form
        className="loginForm "
        onSubmit={handleSubmit}
        method="post"
        // action="/register"
      >
        <h2 className="text-center  mb-4" dir="rtl">
          تسجيل حساب
        </h2>
        {registerInputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          ></FormInput>
        ))}
        <button type="submit" className="btn btn-primary w-auto ">
          تسجيل حساب
        </button>
      </Form>
    </div>
  );
};

export default Register;
