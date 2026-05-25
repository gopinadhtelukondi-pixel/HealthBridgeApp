import React from "react";
import { TrendingUp, Star, ThumbsUp, MessageSquare } from "lucide-react";

const DoctorAnalyticsCard = ({ title, value, color = "blue", max }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  const iconMap = {
    blue: <MessageSquare size={24} />,
    green: <Star size={24} />,
    purple: <ThumbsUp size={24} />,
    orange: <TrendingUp size={24} />,
  };

  const displayValue = max ? `${value}/${max}` : value;

  return (
    <div className={`border rounded-lg p-6 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{displayValue}</p>
        </div>
        <div className="opacity-50">{iconMap[color]}</div>
      </div>
    </div>
  );
};

export default DoctorAnalyticsCard;
