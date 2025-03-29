import { Provider } from "react-redux";
import store  from "./store/store";
import AppRoutes from "./routes/appRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </Provider>
  );
}

export default App;
