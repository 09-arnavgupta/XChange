import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import UsersPage from './UsersPage';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </Router>
  );
}


export default App;