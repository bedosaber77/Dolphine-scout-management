import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { NavLink, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
  const [dialogMessage, setDialogMessage] = useState('');
  const loginAction = useAuthStore((state) => state.login);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.email !== '' && values.password !== '') {
      const result = await loginAction(values);
      console.log(result);
      if (result.success) {
        navigate('/');
      } else {
        setDialogMessage(result.message);
        setDialogOpen(true);
      }
    }
    // alert('please provide a valid input');
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
      {dialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex  justify-center items-center ">
          <div className="bg-white p-10 rounded-md shadow-md flex flex-col gap-10 ">
            <p className="text-xl font-semibold">{dialogMessage}</p>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                style={{ background: 'var(--secondary-color)' }}
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                حسناّّ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
