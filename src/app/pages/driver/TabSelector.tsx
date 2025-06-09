import { FaClock, FaCarSide, FaCheckCircle } from "react-icons/fa";

type TabType = "Completed" | "Accepted" | "Upcoming";

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  // Define tab data with icons
  const tabs = [
    {
      id: "Upcoming" as TabType,
      label: "Upcoming",
      icon: <FaClock className="mr-2" />
    },
    {
      id: "Accepted" as TabType,
      label: "Accepted",
      icon: <FaCarSide className="mr-2" />
    },
    {
      id: "Completed" as TabType,
      label: "Completed",
      icon: <FaCheckCircle className="mr-2" />
    }
  ];

  return (
    <div className="flex bg-gray-200 p-1 rounded-lg shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md transform -translate-y-px"
              : "bg-transparent text-gray-700 hover:bg-gray-300/50"
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};