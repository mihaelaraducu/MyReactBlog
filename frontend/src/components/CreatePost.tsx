import  { useState, useEffect, useContext, type ChangeEvent } from "react";
import "../assets/Login.css";
import { AuthContext } from "../context/authContext";
import { useNavigate, Navigate } from "react-router-dom";
// import TiptapEditor from "../utils/TiptapEditor";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button } from "react-bootstrap";
import axios from "axios";
import {POSTS_URL} from "../config";

type Category = {
  id: number;
  nume: string;
};

type PostFormValues = {
  titlu: string;
  categorie_id: string;
  poza: File | null;
  user_id: number;
  continut: string;
};



export default function CreatePost() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const user_id = currentUser.id as number;
  const [selectCategories, setSelectCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  

  const initialValues: PostFormValues = {
    titlu: "",
    categorie_id: "",
    poza: null,
    user_id: user_id,
    continut: "",
  };

  const validationSchema = Yup.object().shape({
    titlu: Yup.string().required("Camp obligatoriu!"),
    continut: Yup.string().required("Camp obligatoriu!"),
    categorie_id: Yup.string().required("Camp obligatoriu!"),
    poza: Yup.mixed().required("Camp obligatoriu!"),
  });

  useEffect(() => {
    axios
      .get<{ data: Category[] }>(POSTS_URL + "categories")
      .then(({ data }) => setSelectCategories(data.data))
      .catch((error) => console.log(error));
  }, []);

  const handleQuillChange = (value: string, setFieldValue: (field: string, value: any) => void) => {
    setContinut(value);
    setFieldValue("continut", value);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFieldValue("poza", file);
  };

  const handleSubmit = async (values: PostFormValues) => {
    const formData = new FormData();
    formData.append("titlu", values.titlu);
    formData.append("continut", values.continut);
    formData.append("categorie_id", values.categorie_id);
    formData.append("user_id", String(user_id));
    if (values.poza) {
      formData.append("poza", values.poza);
    }

    try {
      const res = await axios.post(POSTS_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert("Post successfully created");
        navigate("/view-posts");
      } else {
        throw new Error("Eroare la creare postare");
      }
    } catch (err: any) {
      alert("Something went wrong");
      console.log(err?.response?.data || err);
    }
  };

  const loggedInUser = localStorage.getItem("authenticated");
  if (loggedInUser === "false") {
    return <Navigate replace to="/posts" />;
  }

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">Add New Post</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap px-4 px-md-5">
              <div className="icon d-flex align-items-center justify-content-center">
                <i className="bi bi-card-heading"></i>
              </div>
              <h3 className="text-center mb-4">
                Completeaza corect campurile!
              </h3>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                enableReinitialize
                validationSchema={validationSchema}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <FormGroup>
                      <label htmlFor="titlu">Titlu</label>
                      <Field
                        name="titlu"
                        type="text"
                        className="form-control"
                        placeholder="Titlu"
                      />
                      <ErrorMessage
                        name="titlu"
                        className="d-block invalid-feedback"
                        component="span"
                      />
                    </FormGroup>
                   {/* <FormGroup>
                      <label htmlFor="continut">Continut articol</label>
                      <TiptapEditor
                        value={values.continut}
                        onChange={(val) => setFieldValue("continut", val)}
                      />
                      <ErrorMessage
                        name="continut"
                        className="d-block invalid-feedback"
                        component="span"
                      />
                    </FormGroup> */}
                    <FormGroup>
                      <label htmlFor="continut">Continut articol</label>
                      <Field
                        as="textarea"
                        name="continut"
                        id="continut"
                        className="form-control"
                        rows={20}
                        placeholder="Scrie continutul articolului aici..."
                      />
                      <ErrorMessage
                        name="continut"
                        component="span"
                        className="d-block invalid-feedback"
                      />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="poza">Poza</label>
                      <input
                        name="poza"
                        type="file"
                        id="file"
                        accept="image/*"
                        className="form-control form-control-lg"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                      />
                      <ErrorMessage
                        name="poza"
                        className="d-block invalid-feedback"
                        component="span"
                      />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="categorie_id">Categorie</label>
                      <Field
                        name="categorie_id"
                        as="select"
                        className="form-control"
                      >
                        <option key={0} value="">
                          Select Categorie
                        </option>
                        {selectCategories.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.nume}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="categorie_id"
                        className="d-block invalid-feedback"
                        component="span"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Field
                        name="user_id"
                        type="hidden"
                        value={user_id}
                      />
                      <Button
                        variant="danger"
                        size="lg"
                        className="btn btn-primary rounded submit p-3 px-5 my-3"
                        type="submit"
                      >
                        Adauga articol
                      </Button>
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}