import './App.css'
import { router } from "./routes/router"
import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBot from "./components/userComponents/common/ChatBot";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ChatBot />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App
