import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getRestaurantById } from "../api/restaurantApi";
import { getFoodItems } from "../api/foodItemApi";

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

type FoodItem = {
  _id: string;
  restaurantId: { _id: string; name: string } | string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
};

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    cartCount,
    cartItems,
    removeFromCart,
  } = useCart();

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [foodItems, setFoodItems] =
    useState<FoodItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFilter, setSelectedFilter] =
    useState<"ALL" | "VEG" | "NON-VEG">("ALL");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [restaurantData, foodItemsData] =
          await Promise.all([
            getRestaurantById(id),
            getFoodItems(id),
          ]);

        setRestaurant(restaurantData);

        const restaurantFoodItems =
          foodItemsData.filter((item: FoodItem) => {
            const itemRestId =
              typeof item.restaurantId === "object"
                ? item.restaurantId._id
                : item.restaurantId;

            return itemRestId === id;
          });

        setFoodItems(restaurantFoodItems);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesVeg =
        selectedFilter === "ALL"
          ? true
          : selectedFilter === "VEG"
          ? item.isVeg
          : !item.isVeg;

      return matchesSearch && matchesVeg;
    });
  }, [foodItems, searchQuery, selectedFilter]);

  const getItemQuantity = (itemId: string) => {
    const found = cartItems.find(
      (item) => String(item.id) === String(itemId)
    );

    return found ? found.quantity : 0;
  };

  /*
   * Get restaurant ID as a string.
   *
   * If restaurantId is populated:
   *    { _id: "...", name: "..." }
   *
   * Otherwise:
   *    "..."
   */
  const getRestaurantId = (item: FoodItem): string => {
    return typeof item.restaurantId === "object"
      ? item.restaurantId._id
      : item.restaurantId;
  };

  /*
   * Add a food item to cart.
   *
   * Important:
   * - id = MongoDB food item _id
   * - foodItemId = MongoDB food item _id
   * - restaurantId = restaurant's MongoDB _id
   */
  const handleAddToCart = (item: FoodItem) => {
    addToCart({
      id: item._id,
      foodItemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: getRestaurantId(item),
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-base font-semibold text-gray-500">
          Loading restaurant...
        </p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl">🌮</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {error || "Restaurant not found"}
          </h1>

          <Link
            to="/restaurants"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            ← Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-28">
      <div className="mx-auto max-w-[1100px] px-6 pt-6 md:px-12 lg:px-16">

        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            to="/restaurants"
            className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            ← Back to restaurants
          </Link>
        </div>

        {/* Restaurant Hero */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="relative h-64 w-full sm:h-80 md:h-96">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {restaurant.name}
            </h1>

            <p className="mt-2 text-sm font-medium text-gray-500">
              {restaurant.cuisine.join(" • ")}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1 text-sm font-bold text-white shadow-sm">
                ★ {restaurant.rating}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-700">
                ⏱️ {restaurant.deliveryTime} mins
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-700">
                🛵 ₹{restaurant.deliveryFee} delivery
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["ALL", "VEG", "NON-VEG"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setSelectedFilter(filter)
                  }
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    selectedFilter === filter
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter === "ALL"
                    ? "All Items"
                    : filter === "VEG"
                    ? "🌱 Veg"
                    : "🍗 Non-Veg"}
                </button>
              )
            )}
          </div>
        </div>

        {/* Food Items */}
        <main className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Menu ({filteredFoodItems.length})
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose your favorite dishes
            </p>
          </div>

          {filteredFoodItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredFoodItems.map((item) => {
                const qty = getItemQuantity(item._id);

                return (
                  <div
                    key={item._id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row"
                  >
                    <div className="flex flex-1 flex-col justify-between pr-0 sm:pr-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              item.isVeg
                                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border border-rose-200 bg-rose-50 text-rose-700"
                            }`}
                          >
                            ●{" "}
                            {item.isVeg
                              ? "VEG"
                              : "NON-VEG"}
                          </span>
                        </div>

                        <h3 className="mt-2 text-lg font-bold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg font-extrabold text-gray-900">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex shrink-0 flex-col items-center sm:mt-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-32 w-full rounded-xl object-cover sm:h-32 sm:w-32"
                      />

                      <div className="-mt-4 z-10">
                        {!item.isAvailable ||
                        !item.isActive ? (
                          <span className="rounded-xl bg-gray-200 px-4 py-1.5 text-xs font-bold text-gray-500">
                            Unavailable
                          </span>
                        ) : qty > 0 ? (
                          <div className="flex items-center rounded-xl bg-emerald-600 text-white shadow-md">
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item._id)
                              }
                              className="rounded-l-xl px-3 py-1.5 font-bold transition hover:bg-emerald-700"
                            >
                              -
                            </button>

                            <span className="px-2 text-xs font-extrabold">
                              {qty}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleAddToCart(item)
                              }
                              className="rounded-r-xl px-3 py-1.5 font-bold transition hover:bg-emerald-700"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleAddToCart(item)
                            }
                            className="rounded-xl border border-emerald-500 bg-white px-5 py-1.5 text-xs font-extrabold text-emerald-600 shadow-sm transition hover:bg-emerald-600 hover:text-white"
                          >
                            + ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <div className="text-5xl">🍽️</div>

              <h3 className="mt-3 text-lg font-bold text-gray-900">
                No food items found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try clearing your search query or filter
                settings.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="flex w-full items-center justify-between rounded-2xl bg-emerald-600 p-4 font-bold text-white shadow-xl transition hover:bg-emerald-700 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-800 text-sm font-extrabold">
                {cartCount}
              </span>

              <span className="text-sm font-semibold">
                Item{cartCount > 1 ? "s" : ""} added
              </span>
            </div>

            <span className="text-sm font-bold">
              View Cart →
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default RestaurantDetails;