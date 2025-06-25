import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getUsers, deleteUser } from "../services/apiUsers";
import type { User } from "../types/User";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then(({ data }) => setUsers(data.data));
  }, []);

  const handleDelete = (id?: number) => {
    if (!id) return;
    if (window.confirm("Sigur ștergi acest utilizator?")) {
      deleteUser(id).then(() => setUsers(users.filter(u => u.id !== id)));
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nume</th>
          <th>Prenume</th>
          <th>Email</th>
          <th>Telefon</th>
          <th>Poza</th>
          <th>Acțiuni</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.nume}</td>
            <td>{user.prenume}</td>
            <td>{user.email}</td>
            <td>{user.telefon}</td>
            <td>
              {user.poza && (
                <img src={`${API_URL}/uploads/${user.poza}`} alt="poza" width={50} />
              )}
            </td>
            <td>
              <Button variant="warning" size="sm" onClick={() => navigate(`/edit-user/${user.id}`)}>Editează</Button>{" "}
              <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Șterge</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}