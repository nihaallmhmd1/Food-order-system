import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Adjust import path if needed
import { getCategories } from "../api/categoryApi";
import { getRestaurants } from "../api/restaurantApi";
import { searchAll } from "../api/searchApi";

interface Category {
  _id: string;
  name: string;
  image?: string;
  imageUrl?: string;
  icon?: string;
  count?: string;
}

interface Restaurant {
  _id: string;
  name: string;
  cuisine?: string | string[];
  tag?: string;
  rating?: number | string;
  deliveryTime?: string;
  time?: string;
  deliveryFee?: string;
  delivery?: string;
  image?: string;
  img?: string;
}

interface SearchRestaurant {
  _id: string;
  name: string;
  image?: string;
  rating?: number;
  deliveryTime?: string;
}

interface SearchFoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  restaurantId?: {
    _id: string;
    name: string;
    image?: string;
  };
  categoryId?: {
    _id: string;
    name: string;
  };
}

interface SearchCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  restaurantId?: {
    _id: string;
    name: string;
    image?: string;
  };
}

interface SearchResults {
  restaurants: SearchRestaurant[];
  foodItems: SearchFoodItem[];
  categories: SearchCategory[];
}

function Home() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
  restaurants: [],
  foodItems: [],
  categories: [],
});
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [categoriesData, restaurantsData] = await Promise.all([
          getCategories(),
          getRestaurants(),
        ]);

        setCategories(categoriesData || []);
        setPopularRestaurants(restaurantsData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load home page data");
      } finally {
        setLoading(false);
      }
    };

    

    fetchHomeData();
  }, []);

  useEffect(() => {
  const query = search.trim();

  if (!query) {
    setSearchResults({
      restaurants: [],
      foodItems: [],
      categories: [],
    });
    setShowSearchResults(false);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      setSearchLoading(true);
      setShowSearchResults(true);

      const response = await searchAll(query);

      setSearchResults(response.data);
    } catch (err) {
      console.error("Search failed:", err);

      setSearchResults({
        restaurants: [],
        foodItems: [],
        categories: [],
      });
    } finally {
      setSearchLoading(false);
    }
  }, 300);

  

  return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowSearchResults(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800">
      {/* 1. HERO SECTION */}
      <section className="relative z-50 flex min-h-screen flex-col items-center justify-between overflow-visible bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center px-4 py-10 text-center sm:px-6">
        <div className="absolute inset-0 z-0 bg-black/45 backdrop-blur-[2px]" />

        {/* Navbar on top layer */}
        <header className="relative z-40 w-full max-w-[1100px] mx-auto">
          <Navbar />
        </header>

        {/* Hero Content */}
        <div className="relative z-10 my-auto flex max-w-3xl flex-col items-center px-4 py-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
            <span>🚀</span>
            <span>Delicious food, delivered fast</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Your favorite food, <br /> delivered fast.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/90 sm:text-xl">
            Discover the best restaurants around you and order your favorite meals with just a few clicks.
          </p>

          <div ref={searchRef} className="relative mt-8 w-full max-w-md">
  {/* Search Box */}
  <div className="flex w-full items-center gap-2 rounded-full bg-white/90 p-2 shadow-2xl backdrop-blur-md transition-all duration-300 focus-within:ring-4 focus-within:ring-emerald-500/40 hover:bg-white">
    <span className="pl-3 text-lg text-gray-400">🔍</span>

    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onFocus={() => {
        if (search.trim()) {
          setShowSearchResults(true);
        }
      }}
      placeholder="Search food or restaurants..."
      className="w-full bg-transparent px-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
    />

    <button
      type="button"
      onClick={() => setShowSearchResults(true)}
      className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95"
    >
      Search
    </button>
  </div>

  {/* Search Results */}
  {showSearchResults && search.trim() && (
    <div className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[420px] overflow-y-auto rounded-2xl bg-white p-3 text-left shadow-2xl">
      
      {searchLoading ? (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          Searching...
        </div>
      ) : (
        <>
          {/* Restaurants */}
          {searchResults.restaurants.length > 0 && (
            <div>
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                Restaurants
              </p>

              {searchResults.restaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurants/${restaurant._id}`}
                  onClick={() => setShowSearchResults(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-emerald-50"
                >
                  <div className="h-11 w-11 overflow-hidden rounded-lg bg-gray-100">
                    {restaurant.image ? (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        🍽️
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {restaurant.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Restaurant
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Food Items */}
          {searchResults.foodItems.length > 0 && (
            <div className="mt-2">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                Food
              </p>

              {searchResults.foodItems.map((food) => (
                <Link
                  key={food._id}
                  to={`/restaurants/${food.restaurantId?._id}`}
                  onClick={() => setShowSearchResults(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-emerald-50"
                >
                  <div className="h-11 w-11 overflow-hidden rounded-lg bg-gray-100">
                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        🍴
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {food.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {food.restaurantId?.name || "Restaurant"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Categories */}
          {searchResults.categories.length > 0 && (
            <div className="mt-2">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                Categories
              </p>

              {searchResults.categories.map((category) => (
                <Link
                  key={category._id}
                  to="/restaurants"
                  onClick={() => setShowSearchResults(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-emerald-50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-xl">
                    🏷️
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Category
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchResults.restaurants.length === 0 &&
            searchResults.foodItems.length === 0 &&
            searchResults.categories.length === 0 && (
              <div className="px-4 py-8 text-center">
                <div className="text-3xl">🔍</div>

                <p className="mt-2 text-sm font-semibold text-gray-800">
                  No results found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Try searching for food, restaurants or categories.
                </p>
              </div>
            )}
        </>
      )}
    </div>
  )}
</div>

          <div className="mt-8">
            <Link to="/restaurants" className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-500/30 active:scale-95">
              Get Started 
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section id="categories-section" className="relative z-10 py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Explore by Category</h2>
              <p className="mt-1 text-sm text-gray-500">Find whatever satisfies your craving right now</p>
            </div>
            <Link to="/restaurants" className="hidden text-sm font-semibold text-emerald-600 hover:underline sm:block">
              View All Categories →
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          ) : error ? (
            <p className="mt-6 text-sm text-red-500">{error}</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => {
                const categoryImg = cat.image || cat.imageUrl;
                const isUrl = categoryImg && (categoryImg.startsWith("http") || categoryImg.startsWith("/"));

                return (
                  <div
                    key={cat._id}
                    className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-stone-100 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-50">
                      {isUrl ? (
                        <img
                          src={categoryImg}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{cat.icon === "Noodles" ? "🍜" : cat.icon || "🍽️"}</span>
                      )}
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-gray-900">{cat.name}</h3>
                    <span className="mt-0.5 text-xs text-gray-400">{cat.count || "Explore"}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. FEATURED RESTAURANTS */}
      <section className="relative z-10 bg-white py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Popular Near You</h2>
              <p className="mt-1 text-sm text-gray-500">Top-rated spots ready for fast delivery</p>
            </div>
            <Link to="/restaurants" className="text-sm font-semibold text-emerald-600 hover:underline">
              See All →
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularRestaurants.map((res) => {
                const imageUrl = res.image || res.img || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600";
                const cuisineTag = Array.isArray(res.cuisine) ? res.cuisine.join(" • ") : res.tag || "Restaurant";
                const ratingDisplay = res.rating ? res.rating : "4.5";
                const deliveryTime = res.deliveryTime || res.time || "20-30 min";
                const deliveryPrice = res.deliveryFee || res.delivery || "Free Delivery";

                return (
                  <Link
                    key={res._id}
                    to={`/restaurants/${res._id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                      <img
                        src={imageUrl}
                        alt={res.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-800 backdrop-blur-md shadow-sm">
                        ⭐ {ratingDisplay}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {res.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{cuisineTag}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-medium text-gray-600">
                        <span>🕒 {deliveryTime}</span>
                        <span className="text-emerald-600 font-semibold">{deliveryPrice}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="relative z-10 overflow-hidden py-12">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-600 p-8 text-white shadow-2xl sm:p-12">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none z-0" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none z-0" />

            <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                  <span>🔥</span> Special Offer
                </span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                  Get 50% Off <br />
                  <span className="text-emerald-200">Your First Order</span>
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-emerald-100 sm:text-base">
                  Use code <span className="rounded bg-white/20 px-2 py-1 font-mono font-bold text-white uppercase tracking-wider backdrop-blur-sm">FOODIE50</span> at checkout to unlock instant savings on select top-rated restaurants.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/restaurants"
                    className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-emerald-900 shadow-xl transition-all duration-300 hover:bg-emerald-50 hover:scale-105 active:scale-95"
                  >
                    Claim Discount Now
                  </Link>
                  <span className="text-xs font-medium text-emerald-100">
                    *Valid for new users only
                  </span>
                </div>
              </div>

              <div className="relative flex justify-center lg:col-span-5">
                <div className="relative w-full max-w-xs sm:max-w-sm">
                  <div className="aspect-square overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl backdrop-blur-md">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800"
                      alt="Delicious Pizza Special"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-xl text-gray-900 flex items-center gap-3 border border-gray-100 z-10">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-extrabold text-sm">
                      50%
                    </span>
                    <div>
                      <p className="text-xs font-bold">Instant Discount</p>
                      <p className="text-[10px] text-gray-500">Applied at checkout</p>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-gray-900 shadow-lg z-10">
                    ⚡ Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="relative z-10 bg-stone-50 py-20">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Easy & Quick</span>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">How Foodie Works</h2>
            <p className="mt-2 text-sm text-gray-500">Get your favorite food delivered in 3 simple steps</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="group relative flex flex-col items-center rounded-3xl border border-gray-200/60 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">
              <div className="absolute top-4 right-4 text-xs font-bold text-stone-300 group-hover:text-emerald-500 transition-colors">
                01
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                📍
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">Choose Your Location</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Enter your address or browse local restaurants near you to view curated menus.
              </p>
            </div>

            <div className="group relative flex flex-col items-center rounded-3xl border border-gray-200/60 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">
              <div className="absolute top-4 right-4 text-xs font-bold text-stone-300 group-hover:text-emerald-500 transition-colors">
                02
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                🍕
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">Select Favorite Food</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Pick from hundreds of fresh dishes, customize your order, and complete payment smoothly.
              </p>
            </div>

            <div className="group relative flex flex-col items-center rounded-3xl border border-gray-200/60 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">
              <div className="absolute top-4 right-4 text-xs font-bold text-stone-300 group-hover:text-emerald-500 transition-colors">
                03
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                🚀
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">Fast Doorstep Delivery</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Sit back while our rider delivers your food hot and fresh straight to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 6. FOOTER / DETAILS SECTION */}
      <footer className="relative z-10 bg-stone-100 pt-16 pb-8 border-t border-stone-200 text-stone-600">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5">
            <div className="md:col-span-1 flex flex-col items-start">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm text-white shadow-sm">
                  🍔
                </span>
                Foodie
              </Link>
              <p className="mt-4 text-xs text-stone-500 leading-relaxed">
                Delivering taste and happiness straight to your doorstep, anytime, anywhere.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Company</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li><Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-emerald-600 transition-colors">Careers</Link></li>
                <li><Link to="/team" className="hover:text-emerald-600 transition-colors">Team</Link></li>
                <li><Link to="/pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Contact Us</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li><Link to="/help" className="hover:text-emerald-600 transition-colors">Help & Support</Link></li>
                <li><Link to="/partner" className="hover:text-emerald-600 transition-colors">Partner With Us</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-600 transition-colors">Ride With Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Legal</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li><Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/cookie-policy" className="hover:text-emerald-600 transition-colors">Cookie Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Follow Us</h4>
              <div className="mt-4 flex gap-4 text-base text-gray-700">
                <a href="#" className="hover:text-emerald-600 transition-colors">🌐</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">📷</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">📘</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">🐦</a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <p>© {new Date().getFullYear()} Foodie Technologies Inc. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <span className="text-emerald-600">♥</span> for good food.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;