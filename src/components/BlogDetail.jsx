import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiClock,
  FiEye,
  FiBookmark,
  FiShare2,
  FiExternalLink,
} from "react-icons/fi";
import "./Blog.css";
import { generateBlogPosts } from "./Blog";

const BlogDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const blogPosts = generateBlogPosts();

  // 🔒 SAFELY find blog - handle both slug and id params
  // The route /blog/:slug will put the value in 'slug' even if it's a number
  const blogId = id || slug;
  const blog = blogPosts.find((post) => 
    post.id === Number(blogId) || post.slug === blogId
  );

  // ✅ Early return → removes ALL "possibly undefined" warnings
  if (!blog) {
    return (
      <div className="blog-detail-error">
        <h2>Blog not found</h2>
        <button
          onClick={() => navigate("/blog")}
          className="back-to-blog-btn"
        >
          ← Back to All Insights
        </button>
      </div>
    );
  }

  // ✅ Normalized content (no undefined access anywhere)
  const content = {
    toc: blog.content?.toc ?? [
      "Introduction",
      "Overview",
      "Key Points",
      "Analysis",
      "Conclusion",
    ],
    sections: blog.content?.sections ?? [
      {
        heading: "Introduction",
        text:
          blog.excerpt ||
          "This article provides insights into the latest cryptocurrency trends.",
      },
      {
        heading: "Overview",
        text:
          "This article is currently being prepared with detailed analysis and insights.",
      },
    ],
  };

  // Demo views
  const views = Math.floor(Math.random() * 2000) + 500;

  return (
    <div className="blog-detail-page">
      {/* Breadcrumb */}
      <motion.div
        className="breadcrumb"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate("/blog")}
          className="breadcrumb-link"
        >
          <FiArrowLeft /> All Insights
        </button>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">
          {blog.category || "Article"}
        </span>
      </motion.div>

      {/* Header */}
      <motion.div
        className="blog-detail-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="blog-detail-tags">
          <span
            className="category-badge"
            style={{ background: blog.badgeColor || "#4559DC" }}
          >
            {blog.category?.toUpperCase() || "ARTICLE"}
          </span>
          <span className={`access-tag ${blog.tag?.toLowerCase() || "free"}`}>
            {blog.tag || "Free"}
          </span>
        </div>

        <h1 className="blog-detail-title">{blog.title}</h1>
        <p className="blog-detail-excerpt">{blog.excerpt}</p>

        <div className="blog-metadata">
          <Meta icon={<FiUser />} label="AUTHOR" value="Thomas Wright" />
          <Meta icon={<FiCalendar />} label="PUBLISHED" value={blog.date || "N/A"} />
          <Meta icon={<FiClock />} label="READ TIME" value={blog.readTime || "N/A"} />
          <Meta icon={<FiEye />} label="VIEWS" value={views.toLocaleString()} />
        </div>
      </motion.div>

      <div className="blog-detail-content-wrapper">
        {/* TOC */}
        <motion.aside
          className="blog-detail-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="sidebar-sticky">
            <h3 className="sidebar-title">Contents</h3>
            <ul className="blog-toc">
              {content.toc.map((item, i) => (
                <li key={i} className="toc-item">
                  <span className="toc-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="toc-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.article
          className="blog-detail-main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {content.sections.map((section, i) => (
            <div key={i} className="content-section">
              <h2 className="section-heading">{section.heading}</h2>
              <p className="section-text">{section.text}</p>
            </div>
          ))}

          <div className="blog-detail-footer">
            <button
              onClick={() => navigate("/blog")}
              className="back-to-blog-btn"
            >
              <FiArrowLeft /> Back to All Insights
            </button>
          </div>
        </motion.article>

        {/* Floating Actions */}
        <div className="floating-actions">
          <Action icon={<FiBookmark />} title="Bookmark" />
          <Action icon={<FiShare2 />} title="Share" />
          <Action icon={<FiExternalLink />} title="Open in new tab" />
        </div>
      </div>
    </div>
  );
};

/* ---------- Small helper components ---------- */

const Meta = ({ icon, label, value }) => (
  <div className="metadata-card">
    <span className="metadata-icon">{icon}</span>
    <div className="metadata-content">
      <span className="metadata-label">{label}</span>
      <span className="metadata-value">{value}</span>
    </div>
  </div>
);

const Action = ({ icon, title }) => (
  <motion.button
    className="action-btn"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    title={title}
  >
    {icon}
  </motion.button>
);

export default BlogDetail;
