import UserForm from "./UserForm";
import { createUser } from "../services/apiUsers";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";

export default function CreateUser() {
  const navigate = useNavigate();
  const initialValues: User = {
    nume: "",
    prenume: "",
    email: "",
    telefon: "",
    poza: "",
    cnp: "",
    datanastere: "",
  };

  const onSubmit = (user: User, poza: File | null) => {
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      if (key !== "poza") formData.append(key, value ?? "");
    });
    if (poza) formData.append("poza", poza);
    createUser(formData).then(() => navigate("/user-list"));
  };

  return (
    <UserForm initialValues={initialValues} onSubmit={onSubmit}>
      Adaugă utilizator
    </UserForm>
  );
}