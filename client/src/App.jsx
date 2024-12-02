import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routers/routes";
import AuthProvider from "./hooks/AuthProvider";


const router = createBrowserRouter(routes);

function App() {


  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  )
}

export default App
