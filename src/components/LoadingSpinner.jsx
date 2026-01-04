import "./LoadingSpinner.css";

const LoadingSpinner = ({ message = "Loading cryptocurrency data" }) => {
  return (
    <div className="center-spinner">
      <div className="spinner-card">
        <div className="spinner-icon"></div>
        <p className="spinner-message">{message}</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;