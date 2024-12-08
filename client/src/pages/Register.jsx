import '../styles/formInputs.css';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import useAuthStore from '../store/authStore';
const Register = () => {
  const [values, setValues] = useState({
    Fname: '',
    Lname: '',
    email: '',
    Phonenum: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const registerAction = useAuthStore((state) => state.register);

  const registerInputs = [
    {
      id: 0,
      name: 'Fname',
      type: 'text',
      label: 'الاسم الاول',
      pattern: `^[\u0621-\u064A]+$`,
      errorMessage:
        'الاسم يجب ان يكون باللغة العربية ولا يحتوي علي ارقام او رموز',
      required: true,
    },
    {
      id: 1,
      name: 'Lname',
      type: 'text',
      label: 'الاسم الاخير',
      pattern: `^[\u0621-\u064A]+$`,
      errorMessage:
        'الاسم يجب ان يكون باللغة العربية ولا يحتوي علي ارقام او رموز',
      required: true,
    },
    {
      id: 2,
      name: 'email',
      type: 'email',
      label: 'الحساب الالكتروني',
      errorMessage: 'ادخل حساب الكتروني صحيح   (example@example.com)',
      required: true,
    },
    {
      id: 3,
      name: 'Phonenum',
      type: 'tel',
      label: 'رقم الهاتف',
      pattern: `^(010|011|012|015)\\d{8}$`,
      errorMessage: 'ادخل رقم هاتف صحيح',
      required: true,
    },
    {
      id: 4,
      name: 'password',
      type: 'password',
      label: 'كلمة السر',
      pattern: `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\W).{8,20}$`,
      errorMessage:
        'Password should be 8-20 characters and include at least 1 uppercase letter, 1 lowercase letter, and 1 symbol',
      required: true,
    },
    {
      id: 5,
      name: 'confirmPassword',
      type: 'password',
      label: 'تاكيد كلمة السر ',
      pattern: values.password,
      errorMessage: 'كلمة السر غير متطابقة',
      required: true,
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    registerAction(values, (path) => navigate(path));
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{
        height: '95%',
        backgroundColor: 'var( --background-secondary)',
      }}
    >
      <div className="flex flex-col max-w-md p-6 rounded-xl sm:p-10 dark:bg-gray-50 dark:text-gray-800 m-4">
        <div className="mb-8 text-center">
          <h1
            className="my-3 text-4xl font-bold "
            style={{ color: 'var(text-primary)' }}
          >
            تسجيل حساب
          </h1>
        </div>
        <form noValidate="" onSubmit={handleSubmit} className="space-y-4">
          {registerInputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name] || ''}
              onChange={onChange}
            />
          ))}
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full px-8 py-3 font-semibold rounded-md text-white"
              style={{ backgroundColor: 'var(--secondary-color)' }}
            >
              تسجيل
            </button>
            <p className="text-sm text-center text-gray-600">
              لديك حساب ؟
              <NavLink
                to="/login"
                className="var(--secondary-color) hover:underline"
              >
                تسجيل دخول
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
