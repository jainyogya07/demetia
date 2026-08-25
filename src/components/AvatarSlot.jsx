export default function AvatarSlot({ name = '', photoUrl = '', size = 56, label }) {
  const initials = String(name)
    .split(/\s+/)
    .filter((part) => part && !/^dr\.?$/i.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '•';

  return (
    <div
      className="ss-avatar-slot"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      aria-label={label || name || 'Profile photo placeholder'}
    >
      {photoUrl ? <img src={photoUrl} alt="" /> : <span>{initials}</span>}
    </div>
  );
}
