function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "0",
      icon: "👥",
    },
    {
      title: "Restaurants",
      value: "0",
      icon: "🍽️",
    },
    {
      title: "Food Items",
      value: "0",
      icon: "🍔",
    },
    {
      title: "Total Orders",
      value: "0",
      icon: "🛒",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome to the Foodie administration panel.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>

          <p className="text-sm text-gray-500">
            Latest orders will appear here.
          </p>
        </div>

        <div className="flex min-h-32 items-center justify-center rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">
            No recent orders available.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;