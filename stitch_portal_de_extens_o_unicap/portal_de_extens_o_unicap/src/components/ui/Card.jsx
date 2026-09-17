import PropTypes from "prop-types";

export default function Card({ children, className = "", accent = false }) {
  return (
    <div
      className={`card ${accent ? "border-l-4 border-primary" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  accent: PropTypes.bool
};
