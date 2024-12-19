// import Form from 'react-bootstrap/Form';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
// import '../styles/formInputs.css';
// import { use } from 'react';
import { useState } from 'react';
// import { useAuth } from '../hooks/AuthProvider';
import useAuthStore from '../store/authStore';
import { NavLink, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const loginAction = useAuthStore((state) => state.login);
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();

  const loginInput = [
    {
      id: 0,
      name: 'email',
      type: 'email',
      label: 'الحساب الالكتروني',
      errorMessage: 'ادخل حساب الكتروني صحيح   ',
      required: true,
    },
    {
      id: 1,
      name: 'password',
      type: 'password',
      label: 'كلمة المرور',
      errorMessage: 'ادخل كلمة مرور صحيحة',
      required: true,
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // const auth = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.email !== '' && values.password !== '') {
      const input = values;
      loginAction(input, (path) => navigate(path));
      console.log(accessToken);
      // console.log(auth.isAuthenticated);
      return;
    }
    alert('please provide a valid input');
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{
        height: 'calc(95vh - 4rem)',
        backgroundColor: 'var( --background-secondary)',
      }}
    >
      <div
        className="flex flex-col max-w-md p-6 rounded-xl sm:p-10"
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
            تسجيل دخول
          </h1>
        </div>
        <form
          noValidate=""
          onSubmit={handleSubmit}
          action=""
          className="space-y-12"
        >
          <div className="space-y-4">
            {loginInput.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={values[input.name] || ''}
                onChange={onChange}
              />
            ))}
            <NavLink
              rel="noopener noreferrer"
              href="#"
              className="text-xs hover:underline dark:text-gray-600"
            >
              نسيت كلمة المرور؟
            </NavLink>
          </div>
          <div className="space-y-2">
            <div>
              <button
                type="submit"
                className="w-full px-8 py-3 font-semibold rounded-md dark:text-gray-50"
                style={{ backgroundColor: 'var(--secondary-color)' }}
              >
                تسجيل الدخول
              </button>
            </div>
            <p className="px-6 text-sm text-center dark:text-gray-600">
              ليس لديك حساب؟ <NavLink to="/register">تسجيل حساب</NavLink>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
