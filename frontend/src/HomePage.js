import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to XChange</h1>
      <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
    </div>
  );
}

export default HomePage;
