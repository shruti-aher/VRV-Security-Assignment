import React, { useEffect, useState } from "react";
import { FiUsers, FiKey, FiShield, FiUserCheck } from "react-icons/fi";
import { api } from "../services/api";
import { User, Role } from "../types";
import { useNavigate } from "react-router-dom";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  path: string;
}

interface UserRole {
  name: string;
  userCount: number;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [usersPerRole, setUsersPerRole] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersData, rolesData] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
        ]);

        setUsers(usersData);
        setRoles(rolesData);

        const userRoleCounts = rolesData.map((role) => ({
          name: role.name,
          userCount: usersData.filter((user) => user.role === role.name).length,
        }));

        setUsersPerRole(userRoleCounts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats: StatItem[] = [
    {
      label: "Total Users",
      value: users.length,
      icon: <FiUsers className="w-7 h-7" />,
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      path: "/users",
    },
    {
      label: "Total Roles",
      value: roles.length,
      icon: <FiKey className="w-7 h-7" />,
      color: "bg-gradient-to-r from-green-500 to-teal-500",
      path: "/roles",
    },
    {
      label: "Total Permissions",
      value: roles.reduce(
        (acc, role) => acc + (role.permissions?.length || 0),
        0
      ),
      icon: <FiShield className="w-7 h-7" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      path: "/roles",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 w-2 h-8 mr-3 rounded-full"></span>
          Dashboard Overview
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate(stat.path)}
            >
              <div className={`${stat.color} h-2 rounded-t-lg`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-4 rounded-full text-white ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-gray-800">
                    {stat.value}
                  </div>
                </div>
                <div className="mt-4 text-base md:text-lg text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Users Per Role */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
              <FiUserCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500" />
              Users Per Role
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersPerRole.map((role, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-shadow shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 font-medium">
                      {role.name}
                    </span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 py-1 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium">
                    {role.userCount} Users
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
