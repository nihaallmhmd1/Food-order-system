import { useEffect, useState } from "react";
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  type CreateRestaurantData,
} from "../../api/restaurantApi";

interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  cuisine?: string;
  deliveryTime?: string;
  address?: string;
  image?: string;
}

function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);

  const [formData, setFormData] =
    useState<CreateRestaurantData>({
      name: "",
      description: "",
      cuisine: "",
      deliveryTime: "",
      address: "",
      rating: 0,
      deliveryFee: 0,
      minimumOrder: 0,
      image: "",
      bannerImage: "",
      phone: "",
      isOpen: true,
      isActive: true,
    });

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRestaurants();

      setRestaurants(data);
    } catch (err) {
      console.error(err);

      setError("Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "rating" ||
        name === "deliveryFee" ||
        name === "minimumOrder"
          ? Number(value)
          : value,
    }));
  };

  const handleEdit = (restaurant: Restaurant) => {
  setEditingRestaurantId(restaurant._id);

  setFormData({
    name: restaurant.name || "",
    description: restaurant.description || "",
    cuisine: restaurant.cuisine || "",
    deliveryTime: restaurant.deliveryTime || "",
    address: restaurant.address || "",
    rating: 0,
    deliveryFee: 0,
    minimumOrder: 0,
    image: restaurant.image || "",
    bannerImage: "",
    phone: "",
    isOpen: true,
    isActive: true,
  });

  setShowForm(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleDelete = async (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this restaurant?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    await deleteRestaurant(id);

    // Remove the deleted restaurant from the current list
    setRestaurants((previous) =>
      previous.filter(
        (restaurant) => restaurant._id !== id
      )
    );
  } catch (err) {
    console.error(err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to delete restaurant"
    );
  }
};


  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setSaving(true);
    setError("");

    if (editingRestaurantId) {
      // UPDATE
      const updatedRestaurant = await updateRestaurant(
        editingRestaurantId,
        formData
      );

      setRestaurants((previous) =>
        previous.map((restaurant) =>
          restaurant._id === editingRestaurantId
            ? updatedRestaurant
            : restaurant
        )
      );
    } else {
      // CREATE
      const restaurant = await createRestaurant(formData);

      setRestaurants((previous) => [
        restaurant,
        ...previous,
      ]);
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      cuisine: "",
      deliveryTime: "",
      address: "",
      rating: 0,
      deliveryFee: 0,
      minimumOrder: 0,
      image: "",
      bannerImage: "",
      phone: "",
      isOpen: true,
      isActive: true,
    });

    setEditingRestaurantId(null);
    setShowForm(false);
  } catch (err) {
    console.error(err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to save restaurant"
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Restaurants
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage all restaurants.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {showForm ? "Cancel" : "+ Add Restaurant"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add Restaurant Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            {editingRestaurantId ? "Edit Restaurant" : "Add Restaurant"}
        </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Restaurant Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="Enter restaurant name"
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Cuisine *
              </label>

              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="Indian, Chinese, Italian..."
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="Enter restaurant description"
              />
            </div>

            {/* Delivery Time */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Delivery Time *
              </label>

              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="30-40 mins"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Address *
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="Restaurant address"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="9876543210"
              />
            </div>

            {/* Delivery Fee */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Delivery Fee
              </label>

              <input
                type="number"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Minimum Order */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Minimum Order
              </label>

              <input
                type="number"
                name="minimumOrder"
                value={formData.minimumOrder}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rating
              </label>

              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Image */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="https://..."
              />
            </div>

            {/* Banner */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Banner Image URL
              </label>

              <input
                type="url"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                placeholder="https://..."
              />
            </div>

            {/* Is Open */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) =>
                  setFormData((previous) => ({
                    ...previous,
                    isOpen: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">
                Restaurant is open
              </span>
            </label>

            {/* Submit */}
            <div className="flex items-end justify-end md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? editingRestaurantId ? "Updating..." : "Creating..."
                        : editingRestaurantId ? "Update Restaurant" : "Create Restaurant"} 
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Restaurant List */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="text-sm text-gray-500">
            Loading restaurants...
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Restaurant
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Cuisine
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Delivery
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Address
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {restaurants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No restaurants found.
                    </td>
                  </tr>
                ) : (
                  restaurants.map((restaurant) => (
                    <tr
                      key={restaurant._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {restaurant.image ? (
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                              🍽️
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {restaurant.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {restaurant.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {restaurant.cuisine || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {restaurant.deliveryTime || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {restaurant.address || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <button onClick={() => handleEdit(restaurant)}
                            className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100">
                                Edit
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDelete(restaurant._id)}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                                Delete
                            </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-500">
              Total restaurants:{" "}
              <span className="font-semibold text-gray-800">
                {restaurants.length}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRestaurants;