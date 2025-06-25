import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { getUser, updateUser } from "../services/apiUsers";
import type { User } from "../types/User";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<User>({
    nume: "",
    prenume: "",
    email: "",
    parola: "",
    dataadaugare: "",
  });

  useEffect(() => {
    if (id) {
      getUser(Number(id)).then(({ data }) => setInitialValues(data.data));
    }
  }, [id]);

  const onSubmit = (user: User, poza: File | null) => {
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      if (key !== "poza") formData.append(key, value ?? "");
    });
    if (poza) formData.append("poza", poza);
    updateUser(Number(id), formData).then(() => navigate("/user-list"));
  };

  return (
    <UserForm initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      Editează utilizator
    </UserForm>
  );
}