import LoadingSpinner from "./LoadingSpinner";
import "./RouteLoadingFallback.css";

/**
 * Route Loading Fallback Component
 * 
 * Optimized fallback UI for lazy-loaded route components.
 * Provides smooth transitions with minimal layout shift.
 */
const RouteLoadingFallback = ({ message = "Loading page..." }) => {
  return (
    <div className="route-loading-fallback">
      <LoadingSpinner message={message} />
    </div>
  );
};

export default RouteLoadingFallback;
