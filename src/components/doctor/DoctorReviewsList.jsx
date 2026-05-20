import React, { useState, useEffect } from "react";
import { fetchDoctorDashboardReviews } from "../services/api";
import DoctorReviewCard from "./DoctorReviewCard";
import { Search, ChevronLeft, ChevronRight, Loader } from "lucide-react";

const DoctorReviewsList = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadReviews();
  }, [doctorId, status, sort, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDoctorDashboardReviews(doctorId, {
        status,
        sort,
        page,
        limit,
        search: search || undefined,
      });
      setReviews(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadReviews();
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handleReviewUpdate = () => {
    loadReviews();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadReviews}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No reviews found</p>
        </div>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            {reviews.map((review) => (
              <DoctorReviewCard
                key={review.id}
                review={review}
                doctorId={doctorId}
                onUpdate={handleReviewUpdate}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReviewsList;
