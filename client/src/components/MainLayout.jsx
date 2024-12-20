import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="mainLayout flex flex-col ">
      <header>
        <AppHeader></AppHeader>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
