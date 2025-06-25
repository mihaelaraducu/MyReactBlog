import { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button } from "react-bootstrap";
import * as Yup from "yup";
import type { User } from "../types/User";
import { API_URL } from "../config";

interface UserFormProps {
  initialValues: User;
  onSubmit: (user: User, poza: File | null) => void;
  enableReinitialize?: boolean;
  children?: React.ReactNode;
}

export default function UserForm({ initialValues, onSubmit, enableReinitialize, children }: UserFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validationSchema = Yup.object().shape({
    nume: Yup.string().required("Camp obligatoriu!"),
    prenume: Yup.string().required("Camp obligatoriu!"),
    email: Yup.string().email("Email invalid!").required("Camp obligatoriu!"),
    telefon: Yup.string(),
    cnp: Yup.string(),
    datanastere: Yup.string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={enableReinitialize}
      onSubmit={(values, actions) => {
        const file = fileInputRef.current?.files?.[0] ?? null;
        onSubmit(values, file);
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <FormGroup>
          <label>Nume</label>
          <Field name="nume" type="text" className="form-control" />
          <ErrorMessage name="nume" component="span" className="text-danger" />
        </FormGroup>
        <FormGroup>
          <label>Prenume</label>
          <Field name="prenume" type="text" className="form-control" />
          <ErrorMessage name="prenume" component="span" className="text-danger" />
        </FormGroup>
        <FormGroup>
          <label>Email</label>
          <Field name="email" type="email" className="form-control" />
          <ErrorMessage name="email" component="span" className="text-danger" />
        </FormGroup>
        <FormGroup>
          <label>Telefon</label>
          <Field name="telefon" type="text" className="form-control" />
        </FormGroup>
        <FormGroup>
          <label>Poza</label>
          <input name="poza" type="file" className="form-control" accept="image/*" ref={fileInputRef} />
          {initialValues.poza && (
            <img src={`${API_URL}/uploads/${initialValues.poza}`} alt="poza" width={50} />
          )}
        </FormGroup>
        <FormGroup>
          <label>CNP</label>
          <Field name="cnp" type="text" className="form-control" />
        </FormGroup>
        <FormGroup>
          <label>Data naștere</label>
          <Field name="datanastere" type="date" className="form-control" />
        </FormGroup>
        <Button type="submit" className="mt-3">{children}</Button>
      </Form>
    </Formik>
  );
}