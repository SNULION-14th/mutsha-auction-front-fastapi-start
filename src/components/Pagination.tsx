type Props = {
  totalItems: number;
  pageSize?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function buildPages(current: number, total: number) {
  const pages: (number | "...")[] = [];
  const push = (v: number | "...") => pages.push(v);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) push(i);
    return pages;
  }
  push(1);
  if (current > 3) push("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    push(p);
  }
  if (current < total - 2) push("...");
  push(total);
  return pages;
}

export default function Pagination({
  totalItems,
  pageSize = 6,
  currentPage,
  onPageChange,
  className = "",
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pages = buildPages(currentPage, totalPages);

  if (totalPages <= 1) return null;

  const base =
    "h-8 min-w-8 px-2 rounded-full text-base flex items-center justify-center transition";
  const disabled =
    "text-scale-300 bg-transparent cursor-not-allowed border border-transparent";
  const normal =
    "text-scale-500 hover:text-scale-600 hover:bg-scale-100 border border-transparent";
  const active = "bg-brand-primary text-bg-white font-bold";

  return (
    <div
      className={`w-full flex items-center justify-center gap-2 ${className}`}
    >
      <button
        className={`${base} ${currentPage === 1 ? disabled : normal}`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className={`${base} ${disabled}`}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${base} ${p === currentPage ? active : normal}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={`${base} ${currentPage === totalPages ? disabled : normal}`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        ›
      </button>
    </div>
  );
}
