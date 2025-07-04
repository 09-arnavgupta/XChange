import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/")
      .then(res => res.json())
      .then(data => setUsers(data.users));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user, i) => <li key={i}>{user}</li>)}
      </ul>
    </div>
  );
}
