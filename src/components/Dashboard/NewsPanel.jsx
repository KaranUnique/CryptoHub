import React, { useState, useEffect } from 'react';
import { fetchCoinNews, analyzeSentiment } from '../../utils/newsService';
import './NewsPanel.css';

const NewsPanel = ({ coinId, coinName }) => {
  const [news, setNews] = useState([]);
  const [sentiment, setSentiment] = useState('neutral');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      if (!coinId) return;

      setLoading(true);
      try {
        const newsData = await fetchCoinNews(coinId);
        setNews(newsData);
        setSentiment(analyzeSentiment(newsData));
      } catch (error) {
        console.error('Error loading news:', error);
        setNews([]);
        setSentiment('neutral');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [coinId]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return '#4caf50';
      case 'bearish': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="news-panel">
        <div className="news-header">
          <h3>📰 News & Sentiment</h3>
        </div>
        <div className="news-loading">
          <div className="loading-skeleton"></div>
          <div className="loading-skeleton"></div>
          <div className="loading-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-panel">
      <div className="news-header" onClick={() => setExpanded(!expanded)}>
        <h3>📰 News & Sentiment</h3>
        <div className="sentiment-badge" style={{ backgroundColor: getSentimentColor(sentiment) }}>
          {getSentimentIcon(sentiment)} {sentiment.toUpperCase()}
        </div>
        <button className="expand-btn">{expanded ? '−' : '+'}</button>
      </div>

      {expanded && (
        <div className="news-content">
          {news.length === 0 ? (
            <div className="no-news">
              <p>No recent news available for {coinName}</p>
            </div>
          ) : (
            <div className="news-list">
              {news.map((article, index) => (
                <div key={index} className="news-item">
                  <div className="news-meta">
                    <span className="news-source">{article.source}</span>
                    <span className="news-time">{formatTimeAgo(article.timestamp)}</span>
                  </div>
                  <h4 className="news-title">{article.title}</h4>
                  <div className="news-sentiment">
                    <span
                      className="sentiment-indicator"
                      style={{ color: getSentimentColor(article.sentiment) }}
                    >
                      {getSentimentIcon(article.sentiment)} {article.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPanel;