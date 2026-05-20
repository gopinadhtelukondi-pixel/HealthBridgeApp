import React, { useState, useEffect } from "react";
import { fetchDoctorDashboard, fetchDoctorAnalytics } from "../services/api";
import DoctorAnalyticsCard from "../components/doctor/DoctorAnalyticsCard";
import ProfileEditForm from "../components/doctor/ProfileEditForm";
import DoctorReviewsList from "../components/doctor/DoctorReviewsList";
import Toast from "../components/ui/Toast";
import { Loader } from "lucide-react";

const DoctorDashboardPage = ({ doctorId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [doctorId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboard, analytics] = await Promise.all([
        fetchDoctorDashboard(doctorId),
        fetchDoctorAnalytics(doctorId),
      ]);
      setDashboardData(dashboard);
      setAnalyticsData(analytics);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
      setToast({ type: "error", message: "Failed to load dashboard" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your profile, reviews, and analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && analyticsData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DoctorAnalyticsCard
                  title="Total Reviews"
                  value={analyticsData.totalReviews}
                  color="blue"
                />
                <DoctorAnalyticsCard
                  title="Average Rating"
                  value={analyticsData.overallAverage}
                  color="green"
                  max={5}
                />
                <DoctorAnalyticsCard
                  title="Recommendation Rate"
                  value={`${analyticsData.recommendationPercentage}%`}
                  color="purple"
                />
                <DoctorAnalyticsCard
                  title="Response Rate"
                  value={`${analyticsData.responseRate}%`}
                  color="orange"
                />
              </div>

              {/* Detailed Analytics */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rating Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analyticsData.averageRatings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Sentiment Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Positive</span>
                      <span className="text-lg font-semibold text-green-600">
                        {analyticsData.sentimentBreakdown.positive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Neutral</span>
                      <span className="text-lg font-semibold text-yellow-600">
                        {analyticsData.sentimentBreakdown.neutral}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Negative</span>
                      <span className="text-lg font-semibold text-red-600">
                        {analyticsData.sentimentBreakdown.negative}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && <DoctorReviewsList doctorId={doctorId} />}

          {activeTab === "profile" && dashboardData && (
            <ProfileEditForm
              doctor={dashboardData.doctor}
              onSuccess={() => {
                loadDashboard();
                setToast({ type: "success", message: "Profile updated successfully" });
              }}
              onError={(error) => {
                setToast({ type: "error", message: error });
              }}
            />
          )}
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default DoctorDashboardPage;
