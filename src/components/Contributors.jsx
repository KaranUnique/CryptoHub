import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./contributors.css";

const OWNER = "KaranUnique";
const REPO = "CryptoHub";
const GITHUB_API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;
const PER_PAGE = 100;
const ITEMS_PER_PAGE_DISPLAY = 6;

// Precompiled regex for level extraction (avoid re-creating per call)
const LEVEL_REGEX = /level[\s-]*(1|2|3)/;

// Project Admin Config
const PROJECT_ADMIN = {
  username: "KaranUnique",
  repo: "CryptoHub",
  repoUrl: `https://github.com/${OWNER}/${REPO}`,
  githubUrl: `https://github.com/${OWNER}`,
  avatarUrl: `https://avatars.githubusercontent.com/${OWNER}?v=4&s=200`,
  description: "Project Creator & Lead Maintainer"
};

// Points per level
const LEVEL_POINTS = { 1: 2, 2: 5, 3: 11 };

// Rank thresholds (sorted descending for early exit)
const RANK_THRESHOLDS = [
  { min: 30, label: "Gold 🥇" },
  { min: 20, label: "Silver 🥈" },
  { min: 10, label: "Bronze 🥉" },
];

const RANK_MAP = {
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  contributor: "Contributor",
};

const getLevelFromPr = (pr) => {
  const title = pr.title?.toLowerCase() || "";
  const titleMatch = title.match(LEVEL_REGEX);
  if (titleMatch) return Number(titleMatch[1]);

  if (Array.isArray(pr.labels)) {
    for (const label of pr.labels) {
      const name = (label?.name || "").toLowerCase();
      const labelMatch = name.match(LEVEL_REGEX);
      if (labelMatch) return Number(labelMatch[1]);
    }
  }

  return null;
};

const getRankFromPoints = (points) => {
  for (const { min, label } of RANK_THRESHOLDS) {
    if (points >= min) return label;
  }
  return "Contributor";
};

// Precompute rank CSS class from rank string (memoized outside render)
const rankClassCache = new Map();
const getRankClass = (rank) => {
  if (rankClassCache.has(rank)) return rankClassCache.get(rank);
  const cls = rank.toLowerCase().replace(/ /g, "-").replace(/[🥇🥈🥉]/gu, "").replace(/-$/, "");
  rankClassCache.set(rank, cls);
  return cls;
};

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

// Extracted ContributorCard to avoid re-renders of sibling cards
const ContributorCard = React.memo(({ contributor, onOpenModal, onOpenGitHub }) => {
  const rankClass = getRankClass(contributor.rank);
  return (
    <article className={`contributor-card contributor-rank-${rankClass}`}>
      <div className="contributor-header">
        <div className="contributor-avatar-wrapper">
          <img
            src={contributor.avatar_url}
            alt={contributor.username}
            className="contributor-avatar"
            loading="lazy"
            width="90"
            height="90"
          />
        </div>
        <div className="contributor-basic-info">
          <h2 className="contributor-username">{contributor.username}</h2>
          <p className={`contributor-rank contributor-rank-${rankClass}`}>
            {contributor.rank}
          </p>
        </div>
      </div>

      <div className="contributor-stats">
        <div className="contributor-stat-item">
          <span className="contributor-stat-label">Points</span>
          <span className="contributor-stat-value">{contributor.totalPoints}</span>
        </div>
        <div className="contributor-stat-item">
          <span className="contributor-stat-label">Merged PRs</span>
          <span className="contributor-stat-value">{contributor.totalPRs}</span>
        </div>
      </div>

      <div className="contributor-actions">
        <button
          className="btn btn-primary btn-view-prs"
          onClick={() => onOpenModal(contributor)}
        >
          View PR details
        </button>
        <button
          className="btn btn-outline btn-view-github"
          onClick={() => onOpenGitHub(contributor.html_url)}
        >
          GitHub Profile →
        </button>
      </div>
    </article>
  );
});

ContributorCard.displayName = "ContributorCard";

// Process raw PR data into contributor map (pure function, no side effects)
const buildContributors = (mergedPrs) => {
  const map = {};

  for (const pr of mergedPrs) {
    const user = pr.user;
    if (!user) continue;

    const { login: username, avatar_url, html_url } = user;
    const level = getLevelFromPr(pr);
    const points = level ? LEVEL_POINTS[level] || 0 : 0;

    if (!map[username]) {
      map[username] = {
        username,
        avatar_url,
        html_url,
        totalPoints: 0,
        totalPRs: 0,
        prs: [],
      };
    }

    map[username].totalPRs += 1;
    map[username].totalPoints += points;
    map[username].prs.push({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      html_url: pr.html_url,
      merged_at: pr.merged_at,
      level,
      points,
    });
  }

  return Object.values(map).map((c) => ({
    ...c,
    rank: getRankFromPoints(c.totalPoints),
  }));
};

const Contributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("most_points");
  const [selectedRankFilter, setSelectedRankFilter] = useState("all");
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // AbortController ref for cleanup on unmount
  const abortRef = useRef(null);

  // Debounce search to avoid filtering on every keystroke
  const debouncedSearch = useDebounce(search, 250);

  // Fetch with AbortController support
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchAllMergedPRs = async () => {
      setLoading(true);
      setError("");

      try {
        let page = 1;
        let mergedPrs = [];

        while (true) {
          const url = `${GITHUB_API_BASE}/pulls?state=closed&per_page=${PER_PAGE}&page=${page}`;
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/vnd.github+json',
              'User-Agent': 'CryptoHub-Contributors-App',
            },
          });

          if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
          }

          const data = await response.json();
          const merged = data.filter((pr) => pr.merged_at);
          mergedPrs = mergedPrs.concat(merged);

          if (data.length < PER_PAGE) break;
          page += 1;
        }

        setContributors(buildContributors(mergedPrs));
      } catch (err) {
        if (err.name === "AbortError") return; // Unmounted, ignore
        console.error("Fetch error:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMergedPRs();

    return () => controller.abort(); // Cleanup on unmount
  }, []);

  // Memoize aggregate stats to avoid recalculation in render
  const stats = useMemo(() => {
    let totalPRs = 0;
    let totalPoints = 0;
    for (const c of contributors) {
      totalPRs += c.totalPRs;
      totalPoints += c.totalPoints;
    }
    return { count: contributors.length, totalPRs, totalPoints };
  }, [contributors]);

  const filteredContributors = useMemo(() => {
    let result = contributors;

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter((c) => c.username.toLowerCase().includes(q));
    }

    if (selectedRankFilter !== "all") {
      const selectedRank = RANK_MAP[selectedRankFilter];
      if (selectedRank) {
        result = result.filter((c) => c.rank.startsWith(selectedRank));
      }
    }

    // Only copy when we need to sort (sort mutates)
    result = [...result];

    if (sortBy === "most_points") {
      result.sort((a, b) => b.totalPoints - a.totalPoints);
    } else if (sortBy === "most_prs") {
      result.sort((a, b) => b.totalPRs - a.totalPRs);
    }

    return result;
  }, [contributors, debouncedSearch, selectedRankFilter, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, selectedRankFilter]);

  // Calculate pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE_DISPLAY;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE_DISPLAY;
  const currentContributors = filteredContributors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContributors.length / ITEMS_PER_PAGE_DISPLAY);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenModal = useCallback((contributor) => {
    setSelectedContributor(contributor);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedContributor(null);
    setShowModal(false);
  }, []);

  const handleOpenGitHubProfile = useCallback((url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleOpenRepo = useCallback(() => {
    window.open(PROJECT_ADMIN.repoUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="contributors-page">
      {/* Header Section */}
      <section className="contributors-header">
        <h1 className="contributors-title">Our Amazing Contributors</h1>
        <p className="contributors-subtitle">
          Meet the talented developers who help make CryptoHub better every day.
        </p>

        <div className="contributors-stats">
          <div className="contributors-stat-card">
            <span className="stat-label">Contributors</span>
            <span className="stat-value">{stats.count}</span>
          </div>

          <div className="contributors-stat-card">
            <span className="stat-label">Total PRs</span>
            <span className="stat-value">{stats.totalPRs}</span>
          </div>

          <div className="contributors-stat-card">
            <span className="stat-label">Total Points</span>
            <span className="stat-value">{stats.totalPoints}</span>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="contributors-controls">
        <input
          type="text"
          className="contributors-search-input"
          placeholder="Search contributor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="contributors-filters">
          <select
            className="contributors-select contributors-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="most_points">Most Contributions (Points)</option>
            <option value="most_prs">Most PRs</option>
          </select>

          <select
            className="contributors-select contributors-rank-select"
            value={selectedRankFilter}
            onChange={(e) => setSelectedRankFilter(e.target.value)}
          >
            <option value="all">All Contributors</option>
            <option value="gold">Gold Only</option>
            <option value="silver">Silver Only</option>
            <option value="bronze">Bronze Only</option>
            <option value="contributor">Contributors</option>
          </select>
        </div>
      </section>

      {/*  NEW PROJECT ADMIN SECTION  */}
      <section className="project-admin-section">
        <div className="project-admin-container">
          <div className="project-admin-header">
            <div className="project-admin-avatar-wrapper">
              <img
                src={PROJECT_ADMIN.avatarUrl}
                alt={PROJECT_ADMIN.username}
                className="project-admin-avatar"
                loading="lazy"
                width="120"
                height="120"
              />
              <div className="admin-badge">👑</div>
            </div>
            <div className="project-admin-info">
              <h2 className="project-admin-title">Project Admin</h2>
              <p className="project-admin-username">{PROJECT_ADMIN.username}</p>
              <p className="project-admin-description">{PROJECT_ADMIN.description}</p>
            </div>
          </div>

          <div className="project-admin-repo">
            <h3 className="project-admin-repo-title">Repository</h3>
            <div className="project-admin-repo-link" onClick={handleOpenRepo}>
              <span className="repo-name">{PROJECT_ADMIN.repo}</span>
              <span className="repo-icon">📂</span>
            </div>
          </div>

          <div className="project-admin-actions">
            <button
              className="btn btn-primary project-admin-btn"
              onClick={() => handleOpenGitHubProfile(PROJECT_ADMIN.githubUrl)}
            >
              View GitHub Profile →
            </button>
            <button
              className="btn btn-outline project-admin-btn"
              onClick={handleOpenRepo}
            >
              Open Repository 📚
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="contributors-content">
        {loading && (
          <div className="loading-container">
            <p className="contributors-loading">Loading contributor data from GitHub...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="contributors-error">{error}</p>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Stats will show "No contributors found" - normal if repo has no merged PRs yet.
            </p>
          </div>
        )}

        {!loading && !error && filteredContributors.length === 0 && (
          <div className="empty-state">
            <p className="contributors-empty">No contributors found.</p>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              No merged pull requests in KaranUnique/CryptoHub yet.
              <br />Stats show 0 contributors, 0 PRs, 0 points ✅
            </p>
          </div>
        )}

        {!loading && !error && filteredContributors.length > 0 && (
          <>
            <div className="contributors-grid">
              {currentContributors.map((c) => (
                <ContributorCard
                  key={c.username}
                  contributor={c}
                  onOpenModal={handleOpenModal}
                  onOpenGitHub={handleOpenGitHubProfile}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="contributors-pagination">
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo; Prev
                </button>

                {/* Windowed/ellipsis pagination to avoid rendering a button for every page */}
                {(() => {
                  const visiblePages = [];
                  const maxVisible = 7; // show all pages if totalPages is small

                  if (totalPages <= maxVisible) {
                    // Small number of pages: render all
                    for (let page = 1; page <= totalPages; page++) {
                      visiblePages.push(page);
                    }
                  } else {
                    const firstPage = 1;
                    const lastPage = totalPages;
                    const windowSize = 2; // number of pages to show on each side of current

                    let start = Math.max(currentPage - windowSize, firstPage + 1);
                    let end = Math.min(currentPage + windowSize, lastPage - 1);

                    // Ensure window stays within bounds between first+1 and last-1
                    start = Math.max(start, firstPage + 1);
                    end = Math.min(end, lastPage - 1);

                    visiblePages.push(firstPage);

                    // Left ellipsis
                    if (start > firstPage + 1) {
                      visiblePages.push("ellipsis-left");
                    }

                    // Pages around current
                    for (let page = start; page <= end; page++) {
                      visiblePages.push(page);
                    }

                    // Right ellipsis
                    if (end < lastPage - 1) {
                      visiblePages.push("ellipsis-right");
                    }

                    visiblePages.push(lastPage);
                  }

                  return visiblePages.map((item, index) => {
                    if (typeof item === "string") {
                      // Ellipsis placeholder
                      return (
                        <span
                          key={item + "-" + index}
                          className="pagination-ellipsis"
                        >
                          &hellip;
                        </span>
                      );
                    }

                    const pageNumber = item;
                    return (
                      <button
                        key={pageNumber}
                        className={`pagination-btn ${currentPage === pageNumber ? "active" : ""}`}
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  });
                })()}
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal for PR details */}
      {showModal && selectedContributor && (
        <div className="contributors-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="contributors-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="contributors-modal-header">
              <h2 className="contributors-modal-title">
                PRs by {selectedContributor.username}
              </h2>
              <button
                className="contributors-modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <div className="contributors-modal-body">
              {selectedContributor.prs.length === 0 && (
                <p className="contributors-modal-empty">
                  No merged pull requests found for this contributor.
                </p>
              )}

              {selectedContributor.prs.length > 0 && (
                <ul className="contributors-modal-pr-list">
                  {selectedContributor.prs.map((pr) => (
                    <li key={pr.id} className="contributors-modal-pr-item">
                      <div className="contributors-modal-pr-main">
                        <a
                          href={pr.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contributors-modal-pr-title"
                        >
                          #{pr.number} — {pr.title}
                        </a>
                        <span className="contributors-modal-pr-date">
                          Merged at: {pr.merged_at
                            ? new Date(pr.merged_at).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="contributors-modal-pr-meta">
                        <span className="contributors-modal-pr-level">
                          Level: {pr.level ? `Level ${pr.level}` : "Not specified"}
                        </span>
                        <span className="contributors-modal-pr-points">
                          Points: {pr.points}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="contributors-modal-footer">
              <button
                className="btn btn-secondary contributors-modal-close-btn"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contributors;
