import logoSrc from '../../assets/cavsulit-logo.png';

/** Square CavSulit mark (green field + star-in-C) */
export function CavSulitMark({ size, className = '' }) {
  const sizeProps = size != null ? { width: size, height: size } : {};

  return (
    <img
      src={logoSrc}
      alt=""
      {...sizeProps}
      className={`flex-shrink-0 object-contain ${className}`}
    />
  );
}
