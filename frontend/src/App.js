import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import UsersPage from './Pages/UsersPage';
import HomePage from './Pages/HomePage';
import Register from './Pages/Register';
import Login from './Pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/register" element={<Register />} /> {/* ✅ Register route */}
        <Route path="/login" element={<Login />} />       {/* ✅ Login route */}
      </Routes>
    </Router>
  );
}

export default App;
