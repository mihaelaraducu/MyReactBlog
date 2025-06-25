import  { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import {POSTS_URL, UPLOADS_URL}from "../config";
import type { Post } from "../types/Post";
import { replaceHtmlTagsRecursive } from "../utils/replaceHtmlTagsRecursive";


export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    console.log("primesc datele");
    axios
      .get(POSTS_URL + "last3")
      .then(({ data }) => {
        console.log(data["data"]);
        const updatedData = replaceHtmlTagsRecursive(data["data"]);
        setPosts(updatedData as Post[]);
      })
      .catch((error) => {
        console.log(error);
      });
  },[]);

  return (
    <>
      <Header />
      <section className="bg-light py-3 shadow-sm">
        <div className="container">
          <div className="row">
            <h1>The last posts</h1>

            {posts.map((data:Post, index:number) => (
              <div
                key={index}
                className="col-sm-6 col-md-4 col-lg-4  d-flex align-items-stretch"
              >
                <div className="card mb-4">
                  <a href="#!">
                    <img
                      className="card-img-top"
                      src={`${UPLOADS_URL}/${data.poza}`}
                      alt="..."
                    />
                  </a>
                  <div className="card-body d-flex flex-column">
                    <div className="small text-muted">
                      Category: {data.categorie_nume}
                    </div>
                    <h2 className="card-title h4">{data.titlu} </h2>
                    {/* <p className="card-text" dangerouslySetInnerHTML={{ __html: data.continut.substring(0, 250)}} /> */}
                    <p className="card-text">
                      {data.continut ? data.continut.substring(0, 100) : ""}
                    </p>
                    <Link
                      to={"/post/" + data.id}
                      className="btn btn-primary mt-auto align-self-start"
                    >
                      Read more
                    </Link>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}