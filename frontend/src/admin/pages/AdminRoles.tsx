// src/admin/pages/AdminRoles.tsx

import { useMemo, useState } from "react";
import { useEffect } from "react";
import {
  createRole,
  deleteRole,
  getAllRoles,
  updateRole,
  type Role,
} from "../../api/roleApi";

const PROCESS_OPTIONS = [
  { key: "dashboard", label: "Dashboard", description: "View dashboard statistics" },
  { key: "restaurants", label: "Restaurants", description: "Create, edit, and delete restaurants" },
  { key: "categories", label: "Categories", description: "Manage food categories" },
  { key: "food-items", label: "Food Items", description: "Manage menu items" },
  { key: "orders", label: "Orders", description: "View and manage orders" },
  { key: "users", label: "Users", description: "Manage users and assign roles" },
  { key: "roles", label: "Roles", description: "Create roles and manage access" },
];

const canConfigureAccess = (role: Role) =>
  role.name !== "admin" && role.name !== "customer";

function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [accessRole, setAccessRole] = useState<Role | null>(null);
  const [accessPermissions, setAccessPermissions] = useState<string[]>([]);
  const [savingAccess, setSavingAccess] = useState(false);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    getAllRoles()
      .then(setRoles)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load roles"));
  }, []);

  const filteredRoles = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    if (!searchValue) return roles;

    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchValue) ||
        role.description.toLowerCase().includes(searchValue)
    );
  }, [roles, search]);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormName("");
    setFormDescription("");
    setShowModal(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormDescription(role.description);
    setShowModal(true);
  };

  const handleOpenAccess = (role: Role) => {
    setError("");
    setAccessRole(role);
    setAccessPermissions(role.permissions || []);
  };

  const togglePermission = (permission: string) => {
    setAccessPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  };

  const handleSaveAccess = async () => {
    if (!accessRole) return;

    setError("");
    setSavingAccess(true);
    try {
      const savedRole = await updateRole(accessRole._id, {
        name: accessRole.name,
        description: accessRole.description,
        permissions: accessPermissions,
      });
      setRoles((current) =>
        current.map((role) => role._id === savedRole._id ? savedRole : role)
      );
      setAccessRole(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save access");
    } finally {
      setSavingAccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const roleData = {
        name: formName.trim(),
        description: formDescription.trim(),
        permissions: editingRole?.permissions || [],
      };

      if (!roleData.name || !roleData.description) {
        setError("Role name and description are required");
        return;
      }

      const savedRole = editingRole
        ? await updateRole(editingRole._id, roleData)
        : await createRole(roleData);

      setRoles((prev) =>
        editingRole
          ? prev.map((role) => role._id === savedRole._id ? savedRole : role)
          : [...prev, savedRole]
      );
      setShowModal(false);
      setEditingRole(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role: Role) => {
    const confirmed = window.confirm(`Are you sure you want to delete the role "${role.name}"?`);
    if (!confirmed) return;

    try {
      await deleteRole(role._id);
      setRoles((prev) => prev.filter((item) => item._id !== role._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete role");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Roles</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, update, and manage system user roles.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            + Add New Role
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Roles</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{roles.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active Status</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">Active</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search roles by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoles.map((role) => (
                  <tr key={role._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        {role.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {role.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canConfigureAccess(role) && (
                        <button
                          onClick={() => handleOpenAccess(role)}
                          className="mr-2 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                          Access
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(role)}
                        className="mr-2 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
          {filteredRoles.map((role) => (
            <div key={role._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  {role.name}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{role.description}</p>
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                {canConfigureAccess(role) && (
                  <button
                    onClick={() => handleOpenAccess(role)}
                    className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    Access
                  </button>
                )}
                <button
                  onClick={() => handleOpenEdit(role)}
                  className="flex-1 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                >
                  Edit Role
                </button>
                <button
                  onClick={() => handleDelete(role)}
                  className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete Role
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900">
                {editingRole ? "Edit Role" : "Create New Role"}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">
                    Role Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Moderator"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe role responsibilities..."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setShowModal(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                  >
                    {saving ? "Saving..." : editingRole ? "Save Changes" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {accessRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Manage Access
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose which admin processes <span className="font-semibold text-slate-700">{accessRole.name}</span> can access.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close access window"
                  onClick={() => setAccessRole(null)}
                  className="text-xl text-slate-400 hover:text-slate-700"
                >
                  x
                </button>
              </div>

              <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {PROCESS_OPTIONS.map((process) => (
                  <label
                    key={process.key}
                    className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        {process.label}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {process.description}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={accessPermissions.includes(process.key)}
                      onChange={() => togglePermission(process.key)}
                      className="h-5 w-5 accent-emerald-600"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={savingAccess}
                  onClick={() => setAccessRole(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingAccess}
                  onClick={handleSaveAccess}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {savingAccess ? "Saving..." : "Save Access"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRoles;