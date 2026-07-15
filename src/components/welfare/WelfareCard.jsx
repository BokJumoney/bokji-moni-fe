import './WelfareCard.css';

export default function WelfareCard({ title, description }) {
  return (
    <div className="welfare-card">
      <div className="welfare-card__header">
        <span className="welfare-card__icon">📋</span>
        <span className="welfare-card__label">추천 복지</span>
      </div>
      <h4 className="welfare-card__title">{title}</h4>
      {description && (
        <p className="welfare-card__desc">{description}</p>
      )}
    </div>
  );
}
