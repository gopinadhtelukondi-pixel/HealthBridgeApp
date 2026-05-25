import React, { useState } from "react";
import { addReviewResponse, updateReviewResponse, deleteReviewResponse } from "../../services/api";
import { X, Send, Trash2, Loader } from "lucide-react";

const ReviewResponseForm = ({
  reviewId,
  existingResponse,
  isEditing,
  onClose,
  onSuccess,
}) => {
  const [text, setText] = useState(existingResponse || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const MAX_CHARS = 500;
  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError("Response cannot be empty");
      return;
    }

    if (isOverLimit) {
      setError("Response exceeds character limit");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await updateReviewResponse(reviewId, text);
      } else {
        await addReviewResponse(reviewId, { text });
      }

      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit response");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    try {
      setLoading(true);
      setError(null);
      await deleteReviewResponse(reviewId);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to delete response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full md:w-1/3 rounded-t-lg md:rounded-lg shadow-lg md:m-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Response" : "Add Response"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a professional response to this review..."
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                isOverLimit
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
              disabled={loading}
            />
            <div className="flex items-center justify-between mt-2">
              <p className={`text-sm ${isOverLimit ? "text-red-600 font-medium" : "text-gray-500"}`}>
                {charCount}/{MAX_CHARS} characters
              </p>
              {charCount > MAX_CHARS - 50 && (
                <p className="text-xs text-yellow-600">
                  Approaching character limit
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !text.trim() || isOverLimit}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  {isEditing ? "Update" : "Submit"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewResponseForm;
