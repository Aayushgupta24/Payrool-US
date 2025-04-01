import { useState } from "react";
import { FiUsers, FiBriefcase, FiLogOut } from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex`}>
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-green-500 to-blue-500 p-6 text-white">
        <h2 className="text-2xl font-bold mb-6">Growth Pods</h2>
        <nav>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-md">
              <FiBriefcase size={20} />
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-md">
              <FiUsers size={20} />
              <span>Users</span>
            </li>
            <li
              className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-md mt-12 cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </li>
            <li className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-md mt-4 cursor-pointer">
              <FiLogOut size={20} />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Raj R</h1>
        
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="text-sm text-gray-600">Number of Companies</p>
            <h2 className="text-3xl font-bold">18</h2>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="text-sm text-gray-600">Number of Active People</p>
            <h2 className="text-3xl font-bold">25</h2>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
              Add New Company
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
