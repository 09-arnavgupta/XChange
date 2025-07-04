import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import UsersPage from './UsersPage';
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';

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
