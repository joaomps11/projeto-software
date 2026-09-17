import PropTypes from "prop-types";

export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...rest
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-label-md text-on-surface font-semibold"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${error ? "border-error focus:ring-error" : ""}`}
        {...rest}
      />
      {error && (
        <span className="font-body-sm text-error text-sm">{error}</span>
      )}
      {hint && !error && (
        <span className="font-body-sm text-on-surface-variant">{hint}</span>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.node,
  error: PropTypes.node,
  hint: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string
};
