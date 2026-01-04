import "./Blog.css";

import { useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogData";

export default function Blog() {

  const navigate = useNavigate();

  return (
    <div className="blog-page">
      <div data-aos="fade-in" className="blog-title">CryptoHub Blog</div>
      <p data-aos="zoom-out" className="blog-desc">
        Insights, practical guides, and helpful tips for everyone who is interested in learning about cryptocurrency and understanding how the crypto world works.
      </p>
      <div className="blog-list">
        {blogPosts.map((post, idx) => (
          <div data-aos={idx % 2 === 0 ? "fade-right" : "fade-left"} className="blog-card" 
          key={idx}
          onClick={() => navigate(`/blog/${idx}`)}
          style={{ cursor: "pointer" }}
          >
            <h3 className="blog-card-title">{post.title}</h3>
            <div className="blog-card-date">{post.date}</div>
            <div className="blog-card-excerpt">{post.excerpt}</div>
            {/* In a real app, add a 'Read more' link or modal for full content */}
          </div>
        ))}
      </div>
    </div>
  );
}
