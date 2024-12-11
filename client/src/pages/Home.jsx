import { NavLink } from 'react-router-dom';
import EmblaCarousel from '../components/ui/EmblaCarousel';
const Home = () => {
  const IMAGES = [
    'https://plus.unsplash.com/premium_photo-1661893427047-16f6ddc173f6?q=80&w=500&h=350&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1450500392544-c2cb0fd6e3b8?w=500&h=350&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8a2F5YWt8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1525811902-f2342640856e?w=500&h=350&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhbXB8ZW58MHx8MHx8fDI%3D',
    'https://images.unsplash.com/photo-1468221296755-1c53a9dbcd54?w=500&h=350&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a2F5YWt8ZW58MHx8MHx8fDI%3D',
    'https://images.unsplash.com/photo-1468549940493-46152524296c?w=500&h=350&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGtheWFrfGVufDB8fDB8fHwy',
  ];

  const OPTIONS = {
    direction: 'rtl', // right to Left
  };
  return (
    <>
      <div className="mt-28 grid gap-10 grid-cols-2 mb-20">
        <div className="flex justify-center items-center">
          <EmblaCarousel slides={IMAGES} options={OPTIONS} />
        </div>
        <div className="mx-24 text-center flex-col content-around items-center">
          <h1 className="text-7xl mb-10 px-32 font-bold">
            مرحبا بكم فى كشافة الدرفيل البحرية
          </h1>
          <p className="text-3xl">
            مجموعة كشفية تأسست عام ٢٠٠٠ بهدف تنمية النشء مسترشدة بالتقاليد
            والطرق الكشفية لإعداد مواطن صالح يساعد الناس
          </p>
          <div className="mt-10 flex gap-3 justify-center items-center ">
            <NavLink
              to="/login"
              className="btn-primary px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              تسجيل الدخول
            </NavLink>
            <NavLink
              to="/register"
              className="btn-outline px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              انضم الينا
            </NavLink>
          </div>
        </div>
      </div>
      <div className="my-20 grid gap-10 grid-cols-2 mb-20">
        <div className="my-8 flex justify-center items-center">
          <EmblaCarousel slides={IMAGES} options={OPTIONS} />
        </div>
        <div className="flex-col content-around items-center mx-32 text-center">
          <h1 className="text-7xl mb-10 px-32 font-bold">المعسكرات</h1>
          <p className="text-3xl">
            مجموعة كشفية تأسست عام ٢٠٠٠ بهدف تنمية النشء مسترشدة بالتقاليد
            والطرق الكشفية لإعداد مواطن صالح يساعد الناس
          </p>
        </div>
      </div>
      <div className="my-20 grid gap-10 grid-cols-2 mb-20">
        <div className="my-8 flex justify-center items-center">
          <EmblaCarousel slides={IMAGES} options={OPTIONS} />
        </div>
        <div className="flex-col content-around items-center mx-32 text-center">
          <h1 className="text-7xl mb-10 px-32 font-bold">الدروع و الجوائز</h1>
          <p className="text-3xl">
            مجموعة كشفية تأسست عام ٢٠٠٠ بهدف تنمية النشء مسترشدة بالتقاليد
            والطرق الكشفية لإعداد مواطن صالح يساعد الناس
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
