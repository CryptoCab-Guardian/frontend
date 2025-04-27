
  
type TabType = "Completed" | "Accepted" | "Upcoming";

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center space-x-4 mt-8 mb-6">
      {(["Upcoming", "Accepted", "Completed"] as TabType[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg ${
            activeTab === tab ? "bg-black text-white" : "bg-gray-200 text-black"
          } transition-colors`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};