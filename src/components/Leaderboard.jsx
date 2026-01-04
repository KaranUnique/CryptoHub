import React from "react";
import { useLeaderboard } from "../context/LeaderboardContext";
import { useAuth } from "../context/AuthContext";
import "./Leaderboard.css";

function Leaderboard() {
  const { leaderboard, userRank, loading } = useLeaderboard();
  const { currentUser } = useAuth();

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-loading">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">🏆 Leaderboard</h2>
        <p className="leaderboard-subtitle">
          Top crypto enthusiasts ranked by activity
        </p>
        {userRank && (
          <div className="user-rank-badge">
            Your Rank: #{userRank}
          </div>
        )}
      </div>

      <div className="leaderboard-list">
        {leaderboard.length === 0 ? (
          <div className="no-data">
            <p>No leaderboard data yet. Start tracking coins to climb the ranks!</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`leaderboard-item ${currentUser?.uid === entry.uid ? "current-user" : ""
                } ${index < 3 ? `rank-${index + 1}` : ""}`}
            >
              <div className="rank-badge">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && `#${index + 1}`}
              </div>

              <div className="user-info">
                {entry.photoURL ? (
                  <img
                    src={entry.photoURL}
                    alt={entry.displayName}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {entry.displayName?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="user-details">
                  <span className="user-name">
                    {entry.displayName || "Anonymous"}
                    {currentUser?.uid === entry.uid && (
                      <span className="you-badge">You</span>
                    )}
                  </span>
                  <span className="user-activities">
                    {entry.activitiesCount || 0} activities
                  </span>
                </div>
              </div>

              <div className="score-info">
                <span className="score-value">{entry.score || 0}</span>
                <span className="score-label">points</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="leaderboard-footer">
        <div className="points-guide">
          <h3>How to earn points:</h3>
          <ul>
            <li>View a coin: <strong>+1 point</strong></li>
            <li>Add to portfolio: <strong>+5 points</strong></li>
            <li>Update portfolio: <strong>+2 points</strong></li>
            <li>Set price alert: <strong>+3 points</strong></li>
            <li>View chart: <strong>+2 points</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
