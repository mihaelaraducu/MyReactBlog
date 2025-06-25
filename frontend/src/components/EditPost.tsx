import  { useState, useEffect, useContext } from "react";
import "../assets/Login.css";
import { AuthContext } from "../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
// import LexicalEditor from "../utils/LexicalEditor";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button } from "react-bootstrap";
import axios from "axios";
import {POSTS_URL} from "../config";


export default function EditPost() {
  const navigate = useNavigate();
  let { id } = useParams(); // Preluăm ID-ul articolului din URL
  const { currentUser } = useContext(AuthContext);
  const user_id = currentUser ? currentUser.id : null;
  const [selectCategories, setSelectCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [continut, setContinut] = useState({ value: "" });

  const [infoData, setInfoData] = useState({
    id: "",
    titlu: "",
    categorie_id: "",
    poza: "",
    user_id: user_id,
    continut: "",
  });

  const validationSchema = Yup.object().shape({
    titlu: Yup.string().required("Camp obligatoriu!"),
    continut: Yup.string().required("Camp obligatoriu!"),
    categorie_id: Yup.string().required("Camp obligatoriu!"),
    // poza: Yup.mixed().required("Camp obligatoriu!")  // Poza poate să nu fie obligatorie la editare
  });

  useEffect(() => {
    // Preluăm categoriile disponibile
    axios
      .get(POSTS_URL + "categories")
      .then(({ data }) => {
        setSelectCategories(data["data"]);
      })
      .catch((error) => {
        console.log(error);
      });

    // Preluăm datele articolului pentru a-l edita
    axios
      .get(`${POSTS_URL}${id}`)
      .then(({ data }) => {
        setInfoData(data["data"]);
        setContinut({ value: data["data"].continut });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = event.target;
  setInfoData({ ...infoData, [name]: value });
};

  

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    
    alert(1234);
    const formData = new FormData();
    formData.append("id", infoData.id);
    formData.append("titlu", infoData.titlu);
    formData.append("continut", continut.value);
    formData.append("categorie_id", infoData.categorie_id);
    formData.append("user_id", user_id);
    if (selectedFile) {
      formData.append("poza", selectedFile);
    }

    axios
      .put(`${POSTS_URL}${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert("Post successfully updated");
          navigate("/view-posts");
        } else Promise.reject();
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err.response.data);
      });
  };

  const loggedInUser = localStorage.getItem("authenticated");
  if (loggedInUser === "false") {
    navigate("/view-posts");
  } else {
    return (
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">Edit Post</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="login-wrap px-4 px-md-5">
                <div className="icon d-flex align-items-center justify-content-center">
                 <i className="bi bi-pencil-square"></i>
                </div>
                <h3 className="text-center mb-4">
                  Completează corect câmpurile!
                </h3>
                <Formik
                  initialValues={infoData}
                  onSubmit={handleSubmit}
                  enableReinitialize
                  validationSchema={validationSchema}
                >
                  <Form>
                    <FormGroup>
                      <label htmlFor="titlu">Titlu</label>
                      <Field
                        name="titlu"
                        type="text"
                        className="form-control"
                        placeholder="Titlu"
                        onChange={handleInputChange}
                      />
                      <ErrorMessage
                        name="titlu"
                        className="d-block invalid-feedback"
                        component="span"
                      />
                    </FormGroup>
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
                        onChange={(e) => {
                          setSelectedFile(e.target.files[0]);
                          handleFileChange(e.target.files[0]);
                        }}
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
                        onChange={handleInputChange}
                      >
                        <option key={0} value="">
                          Selectează categorie
                        </option>
                        {selectCategories.map((option, index) => (
                          <option key={index} value={option.id}>
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
                        onChange={handleInputChange}
                      />
                      <Button
                        variant="danger"
                        size="lg"
                        className=" btn btn-primary rounded submit p-3 px-5 my-3"
                        
                        type="submit"
                      >
                        Actualizează articol
                      </Button>
                    </FormGroup>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}