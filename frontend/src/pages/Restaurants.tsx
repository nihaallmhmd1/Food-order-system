import { useState } from "react";
import { Link } from "react-router-dom";

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
};

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Spice Garden",
    cuisine: "Indian",
    rating: 4.5,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
  },
  {
    id: 2,
    name: "Pizza House",
    cuisine: "Pizza",
    rating: 4.3,
    deliveryTime: "20-25 min",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    id: 3,
    name: "Burger Hub",
    cuisine: "Burgers",
    rating: 4.4,
    deliveryTime: "20-25 min",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 4,
    name: "Dragon Bowl",
    cuisine: "Chinese",
    rating: 4.2,
    deliveryTime: "30-35 min",
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d",
  },
  {
    id: 5,
    name: "Biryani Palace",
    cuisine: "Biryani",
    rating: 4.6,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1697155406055-2db32d47ca07?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.1,
    deliveryTime: "30-40 min",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
  },
];

function Restaurants() {
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const cuisines = [
    "All",
    "Indian",
    "Pizza",
    "Burgers",
    "Chinese",
    "Biryani",
    "Mexican",
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(search.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "All" ||
      restaurant.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Header */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">

          <h1 className="text-3xl font-bold md:text-4xl">
            Restaurants near you
          </h1>

          <p className="mt-2 text-gray-500">
            Discover the best food and restaurants around you.
          </p>

          {/* Search */}
          <div className="mt-6 flex max-w-2xl overflow-hidden rounded-xl border bg-gray-50">

            <span className="flex items-center px-4 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full bg-transparent px-2 py-4 outline-none"
            />

          </div>

        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Filters */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">

          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 font-medium transition ${
                selectedCuisine === cuisine
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 shadow-sm hover:bg-orange-50"
              }`}
            >
              {cuisine}
            </button>
          ))}

        </div>

        {/* Restaurant count */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            {filteredRestaurants.length} restaurants
          </h2>

          <button className="rounded-lg border bg-white px-4 py-2 text-sm font-medium">
            ⚙ Filters
          </button>

        </div>

        {/* Restaurant cards */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredRestaurants.map((restaurant) => (

              <div
                key={restaurant.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}
                <div className="relative h-52 overflow-hidden">

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <span className="absolute bottom-3 left-3 rounded-lg bg-white px-3 py-1 text-sm font-semibold shadow">
                    {restaurant.deliveryTime}
                  </span>

                </div>

                {/* Details */}
                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {restaurant.name}
                  </h3>

                  <p className="mt-1 text-gray-500">
                    {restaurant.cuisine}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <span className="rounded-md bg-green-600 px-2 py-1 text-sm font-semibold text-white">
                      ★ {restaurant.rating}
                    </span>

                    <Link
                      to={`/restaurants/${restaurant.id}`}
                      className="font-semibold text-orange-500 hover:text-orange-600"
                    >
                      View Menu →
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>
        ) : (

          /* Empty state */
          <div className="rounded-2xl bg-white py-20 text-center">

            <div className="text-6xl">🍽️</div>

            <h3 className="mt-4 text-xl font-bold">
              No restaurants found
            </h3>

            <p className="mt-2 text-gray-500">
              Try searching for something else.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Restaurants;