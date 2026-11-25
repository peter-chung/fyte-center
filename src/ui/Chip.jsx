// Pill for event and fighter facts (date, location, height, ...).
function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
      {Icon ? <Icon aria-hidden="true" className="h-3.5 w-3.5 text-neutral-400" /> : null}
      {children}
    </span>
  );
}

export default Chip;
