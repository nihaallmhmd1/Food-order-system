import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-400">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Left Content */}
            <div className="max-w-2xl">
              
              {/* Small Heading */}
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-white sm:text-base">
                Delicious food, delivered
              </p>

              {/* Main Heading */}
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
                Your favorite food,
                <br className="hidden sm:block" />
                delivered fast.
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-base leading-7 text-white/95 sm:text-lg sm:leading-8">
                Discover the best restaurants around you and order your
                favorite meals with just a few clicks.
              </p>

              {/* Search */}
              <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-xl">
                
                <div className="flex min-w-0 flex-1 items-center px-3 sm:px-4">
                  <span className="mr-3 text-xl">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for food or restaurants..."
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
                  />
                </div>

                <button
                  className="rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-[0.98] sm:px-8"
                >
                  Search
                </button>
              </div>

              {/* Browse Restaurants */}
              <div className="mt-6">
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3"
                >
                  Browse restaurants
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72 lg:h-96 lg:w-96">
                
                {/* Decorative Circle */}
                <div className="absolute inset-0 rounded-full bg-orange-400/30 blur-2xl" />

                {/* Burger */}
                <div className="relative z-10 w-44 sm:w-56 lg:w-72">
                  
                  {/* Sesame Burger Bun */}
                  <div className="relative h-20 rounded-t-[90px] bg-[#e9b36c] shadow-lg sm:h-24 lg:h-28">
                    <div className="absolute left-[22%] top-5 h-2.5 w-2.5 rounded-full bg-white/80" />
                    <div className="absolute left-[43%] top-3 h-2.5 w-2.5 rounded-full bg-white/80" />
                    <div className="absolute left-[65%] top-6 h-2.5 w-2.5 rounded-full bg-white/80" />
                    <div className="absolute left-[32%] top-11 h-2.5 w-2.5 rounded-full bg-white/80" />
                    <div className="absolute left-[57%] top-12 h-2.5 w-2.5 rounded-full bg-white/80" />
                  </div>

                  {/* Lettuce */}
                  <div className="relative -mt-1 h-6 rounded-full bg-green-500 sm:h-7 lg:h-8">
                    <div className="absolute -left-2 top-1 h-5 w-12 rounded-full bg-green-500 sm:w-16 lg:w-20" />
                    <div className="absolute -right-2 top-1 h-5 w-12 rounded-full bg-green-500 sm:w-16 lg:w-20" />
                  </div>

                  {/* Tomato */}
                  <div className="relative -mt-2 h-5 overflow-hidden bg-pink-500 sm:h-6 lg:h-7">
                    <div className="absolute -left-3 -top-1 h-7 w-16 rounded-full bg-pink-500 sm:w-20 lg:w-24" />
                    <div className="absolute right-[-10px] -top-1 h-7 w-16 rounded-full bg-pink-500 sm:w-20 lg:w-24" />
                  </div>

                  {/* Cheese */}
                  <div className="relative h-5 bg-yellow-400 sm:h-6 lg:h-7">
                    <div className="absolute -bottom-2 left-[10%] h-5 w-16 rotate-6 bg-yellow-400 sm:w-24 lg:w-28" />
                    <div className="absolute -bottom-2 right-[10%] h-5 w-16 -rotate-6 bg-yellow-400 sm:w-24 lg:w-28" />
                  </div>

                  {/* Patty */}
                  <div className="relative -mt-1 h-12 rounded-full bg-[#76504f] shadow-md sm:h-14 lg:h-16" />

                  {/* Bottom Bun */}
                  <div className="relative h-10 rounded-b-2xl bg-[#e89a76] shadow-lg sm:h-12 lg:h-14" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-3">
          
          <div className="rounded-2xl bg-orange-50 p-6">
            <div className="mb-3 text-3xl">🍔</div>
            <h3 className="text-lg font-bold text-gray-900">
              Great food
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Discover delicious meals from your favorite restaurants.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-6">
            <div className="mb-3 text-3xl">⚡</div>
            <h3 className="text-lg font-bold text-gray-900">
              Fast delivery
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Get your favorite food delivered quickly to your doorstep.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-6">
            <div className="mb-3 text-3xl">❤️</div>
            <h3 className="text-lg font-bold text-gray-900">
              Easy ordering
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Simple ordering experience with just a few clicks.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;