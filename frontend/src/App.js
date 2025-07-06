import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import LandingPage from './Pages/LandingPage';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Profile from './Pages/ProfilePage';
import HomePage from "./Pages/HomePage";
import Listings from "./Pages/ListingsPage";
import CreateListings from "./Pages/CreateListingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />      
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/listings" element= {<Listings />} />
        <Route path="/create" element={<CreateListings />} />
      </Routes>
    </Router>
  );
}

export default App;
