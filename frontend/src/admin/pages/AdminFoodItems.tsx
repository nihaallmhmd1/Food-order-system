import { useEffect, useMemo, useState } from "react";
import {
  createFoodItem,
  deleteFoodItem,
  getFoodItems,
  updateFoodItem,
  type FoodItem,
} from "../../api/foodItemApi";
import { getRestaurants } from "../../api/restaurantApi";
import { getCategories } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";

interface Restaurant {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  restaurantId: string;
}

function AdminFoodItems() {
  const { user } = useAuth();
  const roleName = typeof user?.role === "object" ? user.role.name : user?.role;
  const assignedRestaurantId =
    typeof user?.restaurantId === "object" && user.restaurantId !== null
      ? user.restaurantId._id
      : user?.restaurantId || "";
  const isRestaurantAdmin = roleName === "restaurantadmin";
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Food Item
  const [showAddModal, setShowAddModal] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Edit Food Item
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFoodItem, setEditingFoodItem] = useState<FoodItem | null>(
    null
  );

  // Categories scoped to the edit modal only, so they never clash with
  // the "add" modal's categories list if both were ever open in sequence.
  const [editCategories, setEditCategories] = useState<Category[]>([]);

  const [editRestaurant, setEditRestaurant] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFoodName, setEditFoodName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editIsVeg, setEditIsVeg] = useState(true);
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [editSortOrder, setEditSortOrder] = useState("0");

  const [editFormLoading, setEditFormLoading] = useState(false);
  const [editFormError, setEditFormError] = useState("");

  // ==============================
  // FETCH FOOD ITEMS
  // ==============================

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFoodItems();

      setFoodItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FETCH RESTAURANTS
  // ==============================

  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();

      setRestaurants(data);
    } catch (err) {
      console.error("Failed to load restaurants:", err);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {
    fetchFoodItems();
    if (isRestaurantAdmin) {
      setSelectedRestaurant(assignedRestaurantId);
      setEditRestaurant(assignedRestaurantId);
    } else {
      fetchRestaurants();
    }
  }, [assignedRestaurantId, isRestaurantAdmin]);

  // ==============================
  // FETCH CATEGORIES (Add modal)
  // ==============================

  const fetchCategories = async (restaurantId: string) => {
    try {
      setCategories([]);

      if (!restaurantId) {
        return;
      }

      const data = await getCategories(restaurantId);

      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    }
  };

  // Load categories when restaurant changes (Add modal)
  useEffect(() => {
    if (selectedRestaurant) {
      fetchCategories(selectedRestaurant);
    } else {
      setCategories([]);
    }

    setSelectedCategory("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurant]);

  // ==============================
  // FETCH CATEGORIES (Edit modal) — refetches when the restaurant
  // dropdown inside the Edit modal itself changes, not just on open
  // ==============================

  const fetchEditCategories = async (restaurantId: string) => {
    try {
      if (!restaurantId) {
        setEditCategories([]);
        return;
      }

      const data = await getCategories(restaurantId);

      setEditCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setEditCategories([]);
    }
  };

  useEffect(() => {
    if (showEditModal && editRestaurant) {
      fetchEditCategories(editRestaurant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRestaurant]);

  // ==============================
  // SEARCH
  // ==============================

  const filteredFoodItems = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return foodItems;
    }

    return foodItems.filter((item) => {
      const restaurantName =
        typeof item.restaurantId === "object" ? item.restaurantId.name : "";

      const categoryName =
        typeof item.categoryId === "object" ? item.categoryId.name : "";

      return (
        item.name.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue) ||
        restaurantName.toLowerCase().includes(searchValue) ||
        categoryName.toLowerCase().includes(searchValue)
      );
    });
  }, [foodItems, search]);

  // ==============================
  // HELPERS
  // ==============================

  const getRestaurantName = (item: FoodItem) => {
    return typeof item.restaurantId === "object"
      ? item.restaurantId.name
      : "Unknown";
  };

  const getCategoryName = (item: FoodItem) => {
    return typeof item.categoryId === "object"
      ? item.categoryId.name
      : "Unknown";
  };

  // ==============================
  // AVAILABILITY
  // ==============================

  const handleAvailabilityChange = async (
    item: FoodItem,
    isAvailable: boolean
  ) => {
    try {
      setError("");

      const updatedItem = await updateFoodItem(item._id, { isAvailable });

      setFoodItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem._id === item._id
            ? { ...currentItem, ...updatedItem }
            : currentItem
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update availability"
      );
    }
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async (item: FoodItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteFoodItem(item._id);

      setFoodItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem._id !== item._id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete food item"
      );
    }
  };

  // ==============================
  // CREATE FOOD ITEM
  // ==============================

  const handleCreateFoodItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setFormError("");

      if (!selectedRestaurant && !isRestaurantAdmin) {
        setFormError("Please select a restaurant.");
        return;
      }

      if (!selectedCategory) {
        setFormError("Please select a category.");
        return;
      }

      if (!foodName.trim()) {
        setFormError("Food name is required.");
        return;
      }

      if (!description.trim()) {
        setFormError("Description is required.");
        return;
      }

      if (!price || Number(price) < 0) {
        setFormError("Please enter a valid price.");
        return;
      }

      setFormLoading(true);

      const newFoodItem = await createFoodItem({
        ...(isRestaurantAdmin ? {} : { restaurantId: selectedRestaurant }),
        categoryId: selectedCategory,
        name: foodName.trim(),
        description: description.trim(),
        price: Number(price),
        image: image.trim(),
        isVeg,
        isAvailable,
        sortOrder: Number(sortOrder) || 0,
      });

      // Add new item to table
      setFoodItems((currentItems) => [newFoodItem, ...currentItems]);

      // Reset form
      resetForm();

      setShowAddModal(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create food item"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==============================
  // EDIT FOOD ITEM (open modal + prefill)
  // ==============================

  const handleEditClick = async (item: FoodItem) => {
    setEditingFoodItem(item);

    const restaurantId =
      typeof item.restaurantId === "object"
        ? item.restaurantId._id
        : item.restaurantId;

    const categoryId =
      typeof item.categoryId === "object"
        ? item.categoryId._id
        : item.categoryId;

    setEditRestaurant(restaurantId);
    setEditCategory(categoryId);
    setEditFoodName(item.name);
    setEditDescription(item.description);
    setEditPrice(String(item.price));
    setEditImage(item.image || "");
    setEditIsVeg(item.isVeg);
    setEditIsAvailable(item.isAvailable);
    setEditSortOrder(String(item.sortOrder ?? 0));

    setEditFormError("");
    setEditCategories([]);

    // Load categories for the selected restaurant
    try {
      const data = await getCategories(restaurantId);
      setEditCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }

    setShowEditModal(true);
  };

  // ==============================
  // UPDATE FOOD ITEM
  // ==============================

  const handleUpdateFoodItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingFoodItem) {
      return;
    }

    try {
      setEditFormError("");

      if (!editRestaurant && !isRestaurantAdmin) {
        setEditFormError("Please select a restaurant.");
        return;
      }

      if (!editCategory) {
        setEditFormError("Please select a category.");
        return;
      }

      if (!editFoodName.trim()) {
        setEditFormError("Food name is required.");
        return;
      }

      if (!editDescription.trim()) {
        setEditFormError("Description is required.");
        return;
      }

      if (!editPrice || Number(editPrice) < 0) {
        setEditFormError("Please enter a valid price.");
        return;
      }

      setEditFormLoading(true);

      const updatedFoodItem = await updateFoodItem(editingFoodItem._id, {
        ...(isRestaurantAdmin ? {} : { restaurantId: editRestaurant }),
        categoryId: editCategory,
        name: editFoodName.trim(),
        description: editDescription.trim(),
        price: Number(editPrice),
        image: editImage.trim(),
        isVeg: editIsVeg,
        isAvailable: editIsAvailable,
        sortOrder: Number(editSortOrder) || 0,
      });

      // Update the item in the table immediately
      setFoodItems((currentItems) =>
        currentItems.map((item) =>
          item._id === editingFoodItem._id
            ? { ...item, ...updatedFoodItem }
            : item
        )
      );

      setShowEditModal(false);
      setEditingFoodItem(null);
    } catch (err) {
      setEditFormError(
        err instanceof Error ? err.message : "Failed to update food item"
      );
    } finally {
      setEditFormLoading(false);
    }
  };

  // ==============================
  // RESET FORMS
  // ==============================

  const resetForm = () => {
    setFoodName("");
    setDescription("");
    setPrice("");
    setImage("");
    setIsVeg(true);
    setIsAvailable(true);
    setSortOrder("0");
    setSelectedRestaurant("");
    setSelectedCategory("");
    setCategories([]);
    setFormError("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingFoodItem(null);
    setEditCategories([]);
    setEditFormError("");
  };

  // ==============================
  // STATS
  // ==============================

  const availableCount = foodItems.filter((item) => item.isAvailable).length;
  const vegCount = foodItems.filter((item) => item.isVeg).length;

  // ==============================
  // UI
  // ==============================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Food Items</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage food items across your restaurants.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError("");
              setShowAddModal(true);
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            + Add Food Item
          </button>
        </div>

        {/* ================= STATS ================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Food Items</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {foodItems.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Available</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {availableCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Vegetarian</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {vegCount}
            </p>
          </div>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search food items, restaurants or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= LOADING / TABLE ================= */}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading food items...</p>
          </div>
        ) : filteredFoodItems.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="font-medium text-slate-700">No food items found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search.
            </p>
          </div>
        ) : (
          <>
            {/* ================= DESKTOP ================= */}

            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Food
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Restaurant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredFoodItems.map((item) => (
                      <tr key={item._id} className="transition hover:bg-slate-50">
                        {/* Food */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xl">
                                🍽️
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-slate-900">
                                  {item.name}
                                </p>

                                {item.isVeg && (
                                  <span className="rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                                    VEG
                                  </span>
                                )}
                              </div>

                              <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Restaurant */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {getRestaurantName(item)}
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {getCategoryName(item)}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          ₹{item.price.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleAvailabilityChange(item, !item.isAvailable)
                            }
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              item.isAvailable
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(item)}
                              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= MOBILE ================= */}

            <div className="space-y-4 md:hidden">
              {filteredFoodItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl">
                        🍽️
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.name}
                          </p>

                          {item.isVeg && (
                            <span className="mt-1 inline-block rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                              VEG
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-slate-900">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {getRestaurantName(item)}
                      </p>

                      <p className="text-xs text-slate-400">
                        {getCategoryName(item)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <button
                      onClick={() =>
                        handleAvailabilityChange(item, !item.isAvailable)
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        item.isAvailable
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= ADD FOOD MODAL ================= */}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Add Food Item
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add a new food item to your restaurant.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateFoodItem} className="space-y-5 p-6">
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                {!isRestaurantAdmin && <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Restaurant
                  </label>

                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select restaurant</option>

                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>}

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={!selectedRestaurant}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      {selectedRestaurant
                        ? "Select category"
                        : "Select restaurant first"}
                    </option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Food Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Food Name
                  </label>

                  <input
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Chicken Biryani"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the food item..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Price + Sort Order */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Image URL
                  </label>

                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/food.jpg"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={isVeg}
                      onChange={(e) => setIsVeg(e.target.checked)}
                      className="h-4 w-4 accent-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Vegetarian
                      </p>
                      <p className="text-xs text-slate-400">
                        Mark this item as vegetarian
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="h-4 w-4 accent-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Available
                      </p>
                      <p className="text-xs text-slate-400">
                        Customers can order this item
                      </p>
                    </div>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowAddModal(false);
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {formLoading ? "Creating..." : "Create Food Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= EDIT FOOD MODAL ================= */}

        {showEditModal && editingFoodItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Edit Food Item
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update "{editingFoodItem.name}".
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateFoodItem} className="space-y-5 p-6">
                {editFormError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {editFormError}
                  </div>
                )}

                {!isRestaurantAdmin && <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Restaurant
                  </label>

                  <select
                    value={editRestaurant}
                    onChange={(e) => {
                      setEditRestaurant(e.target.value);
                      setEditCategory("");
                    }}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select restaurant</option>

                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>}

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    disabled={!editRestaurant}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      {editRestaurant ? "Select category" : "Select restaurant first"}
                    </option>

                    {editCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Food Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Food Name
                  </label>

                  <input
                    type="text"
                    value={editFoodName}
                    onChange={(e) => setEditFoodName(e.target.value)}
                    placeholder="e.g. Chicken Biryani"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Describe the food item..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Price + Sort Order */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={editSortOrder}
                      onChange={(e) => setEditSortOrder(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Image URL
                  </label>

                  <input
                    type="url"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://example.com/food.jpg"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={editIsVeg}
                      onChange={(e) => setEditIsVeg(e.target.checked)}
                      className="h-4 w-4 accent-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Vegetarian
                      </p>
                      <p className="text-xs text-slate-400">
                        Mark this item as vegetarian
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={editIsAvailable}
                      onChange={(e) => setEditIsAvailable(e.target.checked)}
                      className="h-4 w-4 accent-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Available
                      </p>
                      <p className="text-xs text-slate-400">
                        Customers can order this item
                      </p>
                    </div>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={editFormLoading}
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editFormLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFoodItems;
