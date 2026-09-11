import { useEffect, useMemo, useState } from "react";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUserRole,
  type AdminUser,
} from "../../api/userApi";
import { getAllRoles, type Role } from "../../api/roleApi";
import { getRestaurants } from "../../api/restaurantApi";

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [restaurants, setRestaurants] = useState<{ _id: string; name: string }[]>([]);
  const [pendingRoleIds, setPendingRoleIds] = useState<Record<string, string>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const [newRestaurantId, setNewRestaurantId] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    getAllRoles()
      .then(setRoles)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load roles");
      });
    getRestaurants()
      .then(setRestaurants)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load restaurants");
      });
  }, []);

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.role.toLowerCase().includes(searchValue)
    );
  }, [users, search]);

  const handleRoleChange = async (
    userId: string,
    roleId: string,
    assignedRestaurantId?: string | null
  ) => {
    try {
      setError("");

      const selectedRole = roles.find((role) => role._id === roleId);
      if (selectedRole?.name === "restaurantadmin" && !assignedRestaurantId) {
        setError("Select a restaurant for the restaurant admin");
        return;
      }

      const updatedUser = await updateUserRole(userId, roleId, assignedRestaurantId);

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId ? updatedUser : user
        )
      );
      setPendingRoleIds((current) => {
        const next = { ...current };
        delete next[userId];
        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update user role"
      );
    }
  };

  const getRoleId = (roleName: string) =>
    roles.find((role) => role.name === roleName)?._id || "";

  const formatRoleName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  const roleNeedsRestaurant = (roleName: string) => roleName === "restaurantadmin";

  const selectedRoleId = (user: AdminUser) =>
    pendingRoleIds[user._id] || getRoleId(user.role);

  const selectedRoleName = (user: AdminUser) =>
    roles.find((role) => role._id === selectedRoleId(user))?.name || user.role;

  const handleRoleSelection = (user: AdminUser, roleId: string) => {
    setPendingRoleIds((current) => ({ ...current, [user._id]: roleId }));
    const selectedRole = roles.find((role) => role._id === roleId);
    if (selectedRole?.name === "restaurantadmin") {
      if (user.restaurantId) {
        handleRoleChange(user._id, roleId, user.restaurantId);
      } else {
        setError("Select a restaurant for the restaurant admin");
      }
      return;
    }
    handleRoleChange(user._id, roleId, null);
  };

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteUser(user._id);

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser._id !== user._id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete user"
      );
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    const selectedRole = roles.find((role) => role._id === newRoleId);
    if (!selectedRole) {
      setError("Select a role");
      return;
    }
    if (selectedRole.name === "restaurantadmin" && !newRestaurantId) {
      setError("Select a restaurant for the restaurant admin");
      return;
    }
    try {
      setCreating(true);
      setError("");
      const user = await createUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        roleId: newRoleId,
        restaurantId: selectedRole.name === "restaurantadmin" ? newRestaurantId : null,
      });
      setUsers((current) => [user, ...current]);
      setShowCreateModal(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRoleId("");
      setNewRestaurantId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const adminCount = users.filter((user) => user.role === "admin").length;
  const customerCount = users.filter(
    (user) => user.role === "customer"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customers and administrators.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Users</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Customers</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {customerCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Admins</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {adminCount}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading users...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="font-medium text-slate-700">
              No users found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                              {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium text-slate-900">
                                {user.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                ID: {user._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={selectedRoleId(user)}
                            onChange={(e) =>
                              handleRoleSelection(user, e.target.value)
                            }
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${
                              user.role === "admin"
                                ? "border-purple-200 bg-purple-50 text-purple-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {roles.map((role) => (
                              <option key={role._id} value={role._id}>
                                {formatRoleName(role.name)}
                              </option>
                            ))}
                          </select>
                          {roleNeedsRestaurant(selectedRoleName(user)) && (
                            <select
                              value={user.restaurantId || ""}
                              onChange={(e) =>
                                handleRoleChange(
                                  user._id,
                                  selectedRoleId(user),
                                  e.target.value
                                )
                              }
                              className="ml-2 rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-emerald-500"
                            >
                              <option value="">Select restaurant</option>
                              {restaurants.map((restaurant) => (
                                <option key={restaurant._id} value={restaurant._id}>
                                  {restaurant.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(user)}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="break-all text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        Role
                      </p>

                      <select
                        value={selectedRoleId(user)}
                        onChange={(e) =>
                          handleRoleSelection(user, e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-emerald-500"
                      >
                        {roles.map((role) => (
                          <option key={role._id} value={role._id}>
                            {formatRoleName(role.name)}
                          </option>
                        ))}
                      </select>
                      {roleNeedsRestaurant(selectedRoleName(user)) && (
                        <select
                          value={user.restaurantId || ""}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              selectedRoleId(user),
                              e.target.value
                            )
                          }
                          className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-emerald-500"
                        >
                          <option value="">Select restaurant</option>
                          {restaurants.map((restaurant) => (
                            <option key={restaurant._id} value={restaurant._id}>
                              {restaurant.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Joined
                      </p>

                      <p className="mt-2 text-sm text-slate-700">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(user)}
                    className="mt-4 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete User
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreateUser} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">Create User</h2>
            <input required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            <input required minLength={6} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            <select required value={newRoleId} onChange={(e) => setNewRoleId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm">
              <option value="">Select role</option>
              {roles.map((role) => <option key={role._id} value={role._id}>{formatRoleName(role.name)}</option>)}
            </select>
            {roles.find((role) => role._id === newRoleId)?.name === "restaurantadmin" && (
              <select required value={newRestaurantId} onChange={(e) => setNewRestaurantId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm">
                <option value="">Select restaurant</option>
                {restaurants.map((restaurant) => <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>)}
              </select>
            )}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreateModal(false)} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={creating} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{creating ? "Creating..." : "Create User"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;