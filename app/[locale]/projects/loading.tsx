import SkeletonCard from "@/app/[locale]/components/ui/skeleton-card";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-8 pb-20">
      <div className="container mx-auto px-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto mb-10 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8}).map((_, i) => (
            <SkeletonCard key={i} variant="card" />
          ))}
        </div>
      </div>
    </div>
  );
}
