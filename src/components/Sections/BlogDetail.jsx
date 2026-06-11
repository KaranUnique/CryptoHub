import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
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
import { generateBlogPosts } from "../../data/blogData";
import { useAuth } from "../../context/useAuth";
import { toggleBookmark, getBookmarks } from "../../services/bookmarkService";

const BlogDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const blogPosts = generateBlogPosts();
  const { currentUser } = useAuth();

  // State for interactions
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [_loadingBookmark, setLoadingBookmark] = useState(true);

  // 🔒 SAFELY find blog - handle both slug and id params
  const blogId = id || slug;
  const blog = blogPosts.find(
    (post) => post.id === Number(blogId) || post.slug === blogId,
  );

  // Check if bookmarked on load
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (currentUser && blog) {
        try {
          const bookmarks = await getBookmarks(currentUser.uid);
          setIsBookmarked(bookmarks.includes(blog.id));
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      }
      setLoadingBookmark(false);
    };

    checkBookmarkStatus();
  }, [currentUser, blog]);

  // ✅ Early return
  if (!blog) {
    return (
      <div className="blog-detail-error">
        <h2>Blog not found</h2>
        <button onClick={() => navigate("/blog")} className="back-to-blog-btn">
          ← Back to All Insights
        </button>
      </div>
    );
  }

  // Sections are the single source of truth for body + TOC (avoids toc/section count mismatches)
  const sections =
    blog.content?.sections?.length > 0
      ? blog.content.sections
      : [
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
        ];

  const scrollToSection = (index) => {
    document
      .getElementById(`blog-section-${index}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Demo views
  const views = Math.floor(Math.random() * 2000) + 500;

  const handleBookmark = async () => {
    if (!currentUser) {
      toast.error("Please login to bookmark articles");
      navigate("/login");
      return;
    }

    try {
      const isNowBookmarked = await toggleBookmark(currentUser.uid, blog.id);
      setIsBookmarked(isNowBookmarked);

      if (isNowBookmarked) {
        toast.success("Article saved to bookmarks");
      } else {
        toast.success("Article removed from bookmarks");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  return (
    <div className="blog-detail-page">
      {/* Breadcrumb */}
      <motion.div
        className="breadcrumb"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button onClick={() => navigate("/blog")} className="breadcrumb-link">
          <FiArrowLeft aria-hidden="true" /> All Insights
        </button>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">{blog.category || "Article"}</span>
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
          <Meta icon={<FiUser aria-hidden="true" />} label="AUTHOR" value="Thomas Wright" />
          <Meta
            icon={<FiCalendar aria-hidden="true" />}
            label="PUBLISHED"
            value={blog.date || "N/A"}
          />
          <Meta
            icon={<FiClock aria-hidden="true" />}
            label="READ TIME"
            value={blog.readTime || "N/A"}
          />
          <Meta icon={<FiEye aria-hidden="true" />} label="VIEWS" value={views.toLocaleString()} />
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
              {sections.map((section, i) => (
                <li key={i} className="toc-item-wrap">
                  <button
                    type="button"
                    className="toc-item"
                    onClick={() => scrollToSection(i)}
                  >
                    <span className="toc-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="toc-text">{section.heading}</span>
                  </button>
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
          {sections.map((section, i) => (
            <div
              key={i}
              id={`blog-section-${i}`}
              className="content-section"
            >
              <h2 className="section-heading">{section.heading}</h2>
              <p className="section-text">{section.text}</p>
            </div>
          ))}

          <div className="blog-detail-footer">
            <button
              onClick={() => navigate("/blog")}
              className="back-to-blog-btn"
            >
              <FiArrowLeft aria-hidden="true" /> Back to All Insights
            </button>
          </div>
        </motion.article>

        {/* Floating Actions */}
        <div className="floating-actions">
          <Action
            icon={<FiBookmark fill={isBookmarked ? "currentColor" : "none"} />}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
            onClick={handleBookmark}
            active={isBookmarked}
          />
          <Action icon={<FiShare2 />} title="Share" onClick={handleShare} />
          <Action
            icon={<FiExternalLink />}
            title="Open in new tab"
            onClick={handleOpenNewTab}
          />
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

const Action = ({ icon, title, onClick, active }) => (
  <motion.button
    className={`action-btn ${active ? "active" : ""}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    title={title}
    aria-label={title}
    onClick={onClick}
  >
    {icon}
  </motion.button>
);

export default BlogDetail;
