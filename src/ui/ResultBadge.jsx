const resultStyles = {
  W: { label: "W", classes: "bg-green-600 text-white" },
  L: { label: "L", classes: "bg-red-600 text-white" },
  D: { label: "D", classes: "bg-neutral-500 text-white" },
  NC: { label: "NC", classes: "bg-neutral-500 text-white" },
};

// W / L / D / NC for a fight in a fighter's history; "Next" for a booked one.
function ResultBadge({ entry, size = "md" }) {
  const style = resultStyles[entry.result];
  const sizeClasses = size === "sm" ? "h-6 w-5 px-0 text-[10px] sm:w-8 sm:text-xs" : "h-7 w-12 px-2 text-xs";

  if (!style) {
    return (
      <span
        className={`inline-flex ${sizeClasses} shrink-0 items-center justify-center rounded-md font-semibold ring-1 ring-neutral-300 dark:ring-neutral-600`}
      >
        {entry.completed ? "–" : "Next"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex ${sizeClasses} shrink-0 items-center justify-center rounded-md font-semibold ${style.classes}`}
      title={entry.opponent ? `${style.label} vs ${entry.opponent.name}` : undefined}
    >
      {style.label}
    </span>
  );
}

export default ResultBadge;
