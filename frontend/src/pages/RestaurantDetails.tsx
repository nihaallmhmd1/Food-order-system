import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

type FoodItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

const restaurants = [
  {
    id: 1,
    name: "Spice Garden",
    cuisine: "Indian • North Indian",
    rating: 4.5,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
  },
  {
    id: 2,
    name: "Pizza House",
    cuisine: "Pizza • Italian",
    rating: 4.3,
    deliveryTime: "20-25 min",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
  {
    id: 3,
    name: "Burger Hub",
    cuisine: "Burgers • Fast Food",
    rating: 4.4,
    deliveryTime: "20-25 min",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
];

const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Chicken Biryani",
    description:
      "Fragrant basmati rice with tender chicken and aromatic spices.",
    price: 220,
    category: "Biryani",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c",
  },
  {
    id: 2,
    name: "Butter Chicken",
    description:
      "Creamy tomato-based chicken curry with rich Indian spices.",
    price: 260,
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
  },
  {
    id: 3,
    name: "Paneer Tikka",
    description:
      "Grilled paneer with peppers, onions and Indian spices.",
    price: 180,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
  },
  {
    id: 4,
    name: "Garlic Naan",
    description:
      "Soft naan topped with garlic and fresh coriander.",
    price: 70,
    category: "Breads",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950",
  },
];

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const restaurant = restaurants.find(
    (restaurant) => restaurant.id === Number(id)
  );

  const { addToCart, cartCount } = useCart();

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl">😕</div>

          <h1 className="mt-4 text-2xl font-bold">
            Restaurant not found
          </h1>

          <Link
            to="/restaurants"
            className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white"
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Restaurant Hero */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">

          <Link
            to="/restaurants"
            className="text-sm font-medium text-orange-500"
          >
            ← Back to restaurants
          </Link>

          <div className="mt-6 overflow-hidden rounded-3xl">

            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="h-52 w-full object-cover sm:h-64 md:h-80"
            />

          </div>

          <div className="py-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row">

              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  {restaurant.name}
                </h1>

                <p className="mt-2 text-gray-500">
                  {restaurant.cuisine}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 sm:gap-4">

                  <span className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white">
                    ★ {restaurant.rating}
                  </span>

                  <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
                    🕐 {restaurant.deliveryTime}
                  </span>

                  <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
                    🛵 Free delivery
                  </span>

                </div>
              </div>

              <div className="rounded-xl border bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Delivery
                </p>

                <p className="mt-1 font-semibold">
                  25-30 minutes
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Menu */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Menu
          </h2>

          <p className="mt-1 text-gray-500">
            Choose your favorite dishes
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">

          {["All", "Biryani", "Starters", "Main Course", "Breads"].map(
            (category) => (
              <button
                key={category}
                className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 font-medium shadow-sm hover:bg-orange-50"
              >
                {category}
              </button>
            )
          )}

        </div>

        {/* Food Items */}
        <div className="grid gap-5">

          {foodItems.map((item) => (

            <div
              key={item.id}
              className="flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row"
            >

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full rounded-xl object-cover sm:h-36 sm:w-40"
              />

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between">

                <div>

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="text-xl font-bold">
                      {item.name}
                    </h3>

                    <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                      ● VEG
                    </span>

                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                </div>

                <div className="mt-4 flex items-center justify-between">

                  <p className="text-lg font-bold">
                    ₹{item.price}
                  </p>

                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="rounded-lg border-2 border-orange-500 px-5 py-2 font-bold text-orange-500 transition hover:bg-orange-500 hover:text-white"
                  >
                    + Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 sm:bottom-5 sm:w-[calc(100%-3rem)] sm:max-w-[560px]">

          <button
            onClick={() => navigate("/cart")}
            className="flex w-full items-center justify-between gap-4 rounded-2xl bg-orange-500 px-5 py-4 font-bold text-white shadow-2xl transition-all duration-200 hover:bg-orange-600 active:scale-[0.98] sm:px-7 sm:py-5"
          >

            <span className="text-sm sm:text-base md:text-lg">
              {cartCount} item{cartCount > 1 ? "s" : ""} added
            </span>

            <span className="whitespace-nowrap text-sm sm:text-base md:text-lg">
              View Cart →
            </span>

          </button>

        </div>
      )}

    </div>
  );
}

export default RestaurantDetails;