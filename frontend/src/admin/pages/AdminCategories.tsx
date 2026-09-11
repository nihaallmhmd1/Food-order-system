import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
} from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";

function AdminCategories() {
  const { user } = useAuth();
  const roleName = typeof user?.role === "object" ? user.role.name : user?.role;
  const assignedRestaurantId =
    typeof user?.restaurantId === "object" && user.restaurantId !== null
      ? user.restaurantId._id
      : user?.restaurantId || "";
  const isRestaurantAdmin = roleName === "restaurantadmin";
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [restaurantId, setRestaurantId] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------
  // Fetch Categories
  // ---------------------------------
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------------------------
  // Reset Form
  // ---------------------------------
  const resetForm = () => {
    setName("");
    setImage("");
    setRestaurantId("");
    setEditingId(null);
    setError("");
  };

  // ---------------------------------
  // Open Add Modal
  // ---------------------------------
  const handleAddCategory = () => {
    resetForm();
    if (isRestaurantAdmin) setRestaurantId(assignedRestaurantId);
    setShowModal(true);
  };

  // ---------------------------------
  // Close Modal
  // ---------------------------------
  const handleCloseModal = () => {
    if (saving) return;

    resetForm();
    setShowModal(false);
  };

  // ---------------------------------
  // Submit
  // ---------------------------------
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    if (!isRestaurantAdmin && !restaurantId.trim()) {
      setError("Restaurant ID is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        name: name.trim(),
        image: image.trim(),
        ...(isRestaurantAdmin ? {} : { restaurantId: restaurantId.trim() }),
      };

      if (editingId) {
        await updateCategory(editingId, data);
      } else {
        await createCategory(data);
      }

      resetForm();
      setShowModal(false);

      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------
  // Edit
  // ---------------------------------
  const handleEdit = (category: Category) => {
    const categoryWithRestaurant = category as Category & {
      restaurantId?: string;
    };

    setEditingId(category._id);
    setName(category.name);
    setImage(category.image || category.imageUrl || "");
    setRestaurantId(isRestaurantAdmin ? assignedRestaurantId : categoryWithRestaurant.restaurantId || "");

    setError("");
    setShowModal(true);
  };

  // ---------------------------------
  // Delete
  // ---------------------------------
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((category) => category._id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete category"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* --------------------------------
            Page Header
        -------------------------------- */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Categories
            </h1>

            <p className="mt-1 text-gray-500">
              Manage food categories for your restaurants
            </p>
          </div>

          {/* Add Category Button */}
          <button
            type="button"
            onClick={handleAddCategory}
            className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
          >
            + Add Category
          </button>
        </div>

        {/* --------------------------------
            Error
        -------------------------------- */}
        {error && !showModal && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* --------------------------------
            Categories Table
        -------------------------------- */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              All Categories
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {categories.length} categories found
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">
                No categories found.
              </p>

              <button
                type="button"
                onClick={handleAddCategory}
                className="mt-4 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Add Your First Category
              </button>
            </div>
          ) : (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full"> 

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Image
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      ID
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => {
                    const categoryImage =
                      category.image ||
                      category.imageUrl;

                    return (
                      <tr
                        key={category._id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* Image */}
                        <td className="px-6 py-4">
                          {categoryImage ? (
                            <img
                              src={categoryImage}
                              alt={category.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-600">
                              {category.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-gray-500">
                            {category._id}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(category)
                              }
                              className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(category._id)
                              }
                              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {categories.map((category) => {
              const categoryImage = category.image || category.imageUrl;
              return (
                <div
                  key={category._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {categoryImage ? (
                      <img
                        src={categoryImage}
                        alt={category.name}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-lg font-semibold text-emerald-600">
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="truncate font-mono text-xs text-gray-500">
                        {category._id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ==================================
          ADD / EDIT CATEGORY MODAL
      ================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingId
                    ? "Update the category details"
                    : "Create a new food category"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Modal Error */}
            {error && (
              <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="space-y-5">

                {/* Category Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Eg. Shawaya"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {!isRestaurantAdmin && <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Restaurant ID
                  </label>

                  <input
                    type="text"
                    value={restaurantId}
                    onChange={(e) =>
                      setRestaurantId(e.target.value)
                    }
                    placeholder="Enter restaurant ID"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-1.5 text-xs text-gray-500">
                    Enter the ID of the restaurant this
                    category belongs to.
                  </p>
                </div>}

                {/* Image URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Image URL
                  </label>

                  <input
                    type="text"
                    value={image}
                    onChange={(e) =>
                      setImage(e.target.value)
                    }
                    placeholder="https://example.com/shawaya.jpg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Image Preview */}
                {image.trim() && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Image Preview
                    </p>

                    <img
                      src={image}
                      alt="Category preview"
                      className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                )}

              </div>

              {/* Buttons */}
              <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Category"
                    : "Add Category"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;