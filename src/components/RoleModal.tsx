import React from "react";
import { Role } from "../types";

interface RoleModalProps {
  showModal: boolean;
  role: Omit<Role, "_id"> & { _id?: string };
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  onRoleChange: (name: string) => void;
  onPermissionToggle: (permission: string) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({
  showModal,
  role,
  isEditing,
  onClose,
  onSave,
  onRoleChange,
  onPermissionToggle,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
          {isEditing ? "Edit Role" : "Add New Role"}
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="role-name"
              className="block text-sm font-medium text-gray-600"
            >
              Role Name
            </label>
            <input
              id="role-name"
              type="text"
              placeholder="Enter role name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={role.name}
              onChange={(e) => onRoleChange(e.target.value)}
              disabled={isEditing}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600">Permissions</h4>
            <div className="flex flex-wrap gap-3 mt-2">
              {["read", "write", "delete"].map((permission) => (
                <label
                  key={permission}
                  className="inline-flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(permission)}
                    onChange={() => onPermissionToggle(permission)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {permission}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? "Save Changes" : "Add Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
