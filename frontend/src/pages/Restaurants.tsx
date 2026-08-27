import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getRestaurants } from "../api/restaurantApi";

type Restaurant = {
  _id: string;
  name: string;
  description?: string;
  cuisine: string[];
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  image: string;
};

function Restaurants() {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Keep search state in sync if the navbar sends a new ?search= value
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  const cuisines = [
    "All",
    ...Array.from(
      new Set(restaurants.flatMap((restaurant) => restaurant.cuisine))
    ),
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchText) ||
      restaurant.cuisine.some((cuisine) =>
        cuisine.toLowerCase().includes(searchText)
      );

    const matchesCuisine =
      selectedCuisine === "All" ||
      restaurant.cuisine.includes(selectedCuisine);

    return matchesSearch && matchesCuisine;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-emerald-800">
          Loading restaurants...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500">{error}</p>
          <p className="mt-2 text-gray-500">
            Make sure your backend server is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-6 pb-12">
        {/* Cuisine Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
                selectedCuisine === cuisine
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Header Count & Filter */}
        <div className="mb-6 flex items-center justify-between border-t border-gray-200 pt-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {filteredRestaurants.length} Restaurants deliver to you
          </h1>

          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-xs">
            <span>⚙</span> Filters
          </button>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurants/${restaurant._id}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-xs border border-gray-100 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-2 left-3 rounded-md bg-white/90 px-2 py-0.5 text-xs font-bold text-gray-800 shadow-xs">
                    {restaurant.deliveryTime} mins
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700">
                      {restaurant.name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                      {restaurant.cuisine.join(", ")}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                      ★ {restaurant.rating}
                    </span>

                    <span className="text-xs font-semibold text-emerald-700 group-hover:underline">
                      View Menu →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white py-16 text-center border border-gray-100 shadow-xs">
            <div className="text-5xl">🍽️</div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              No restaurants found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try searching for standard cuisines or alternate dish names.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Restaurants;
