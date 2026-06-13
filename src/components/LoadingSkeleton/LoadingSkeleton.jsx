import './LoadingSkeleton.css';

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-row skeleton-teams">
            <div className="skeleton-team">
              <div className="skeleton-avatar" />
              <div className="skeleton-line w-60" />
            </div>
            <div className="skeleton-vs">
              <div className="skeleton-line w-20" />
            </div>
            <div className="skeleton-team right">
              <div className="skeleton-line w-60" />
              <div className="skeleton-avatar" />
            </div>
          </div>
          <div className="skeleton-row">
            <div className="skeleton-bar" />
          </div>
          <div className="skeleton-row skeleton-probs">
            <div className="skeleton-line w-30" />
            <div className="skeleton-line w-20" />
            <div className="skeleton-line w-30" />
          </div>
        </div>
      ))}
    </div>
  );
}
