import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './hooks/AuthProvider';
import AppRoutes from './routers/routes';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
  );
}

function Routes() {
  const router = createBrowserRouter(AppRoutes()); // `useAuth` is safe to use here
  return <RouterProvider router={router} />;
}

export default App;
