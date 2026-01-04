import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import "./Blog.css";

import { blogPosts } from "../data/blogDetailsData";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); //  Added navigate hook
  const blog = blogPosts[id];

  if (!blog) {
    return <h2 style={{ textAlign: "center" }}>Blog not found</h2>;
  }

  return (
    <div className="blog-page">
      {/* Blog Title */}
      <h1 data-aos="fade-in" className="blog-title">{blog.title}</h1>
      <p data-aos="fade-in" className="blog-card-date">{blog.date}</p>

      {/* Center Image */}
      <div data-aos="zoom-in" className="blog-hero">
        <img src={blog.image} alt={blog.title} />
      </div>

      {/* Table of Contents */}
      <div data-aos="fade-in" className="blog-desc">
        <h3>Table of Contents</h3>
        <ul>
          {blog.toc.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Blog Content */}
      {blog.sections.map((section, index) => (
        <div data-aos="fade-up" key={index} className="blog-desc">
          <h2>{section.heading}</h2>
          <p style={{ whiteSpace: "pre-line" }}>{section.text}</p>
        </div>
      ))}

      {/*  Go Back Button - Added at the end */}
      <div data-aos="fade-out" className="blog-back-container">
        <button
          className="blog-back-btn"
          onClick={() => navigate(-1)} // go back button will move on back
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
