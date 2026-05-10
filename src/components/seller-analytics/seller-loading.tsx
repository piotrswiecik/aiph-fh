export function SellerDashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-10 animate-pulse">
      <div className="h-3 w-40 bg-black/10 rounded mb-8" />
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <div className="h-8 w-64 bg-black/10 rounded mb-3" />
          <div className="h-4 w-80 max-w-full bg-black/10 rounded" />
        </div>
        <div className="h-9 w-28 bg-black/10 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 border-y border-black/10 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="py-5 md:border-r border-black/10 last:border-r-0">
            <div className="h-3 w-20 bg-black/10 rounded mb-3" />
            <div className="h-7 w-16 bg-black/10 rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-0 border-t border-black/10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-[56px_1fr] gap-4 py-4 border-b border-black/10">
            <div className="size-14 bg-black/10 rounded" />
            <div>
              <div className="h-4 w-56 max-w-full bg-black/10 rounded mb-3" />
              <div className="h-3 w-full bg-black/10 rounded mb-2" />
              <div className="h-3 w-2/3 bg-black/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
