import { Form, useNavigate } from 'react-router-dom';
import '../styles/formInputs.css';
import { useState } from 'react';

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
  const registerInputs = [
    {
      id: 0,
      name: 'Fname',
      type: 'text',
      label: 'First Name',
      pattern: `^[A-Za-z.-]+(\\s*[A-Za-z.-]+)*$`,
      errorMessage: "Your Name shouldn't have neither numbers no symbols!",
      required: true,
    },
    {
      id: 1,
      name: 'Lname',
      type: 'text',
      label: 'Last Name',
      pattern: `^[A-Za-z.-]+(\\s*[A-Za-z.-]+)*$`,
      errorMessage: "Your Name shouldn't have neither numbers no symbols!",
      required: true,
    },
    {
      id: 2,
      name: 'email',
      type: 'email',
      label: 'Email',
      errorMessage: 'Enter a valid email address!',
      required: true,
    },
    {
      id: 3,
      name: 'Phonenum',
      type: 'Phonenum',
      label: 'Phone Number',
      pattern: `^(010|011|012|015)\\d{8}$`,
      errorMessage: 'Enter a valid Phone Number!',
      required: true,
    },
    {
      id: 4,
      name: 'password',
      type: 'password',
      label: 'Password',
      pattern: `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\W).{8,20}$`,
      errorMessage:
        'Password should be 8~20 characters and include at least 1 UpperCase letter, 1 LowerCase letter and 1 symbol!',
      required: true,
    },
    {
      id: 5,
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      pattern: values.password,
      errorMessage: "Passwords don't match",
      required: true,
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.registerAction(values, (path) => navigate(path));
    console.log(auth.isAuthenticated);
    return;
  };

  console.log(values);

  return (
    <div className="login">
      <Form className="loginForm " onSubmit={handleSubmit} method="post">
        <h2 className="text-center  mb-4" dir="rtl">
          تسجيل حساب
        </h2>
        {registerInputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name] || ''}
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
