/**
 * Loading State for Projects Page
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
