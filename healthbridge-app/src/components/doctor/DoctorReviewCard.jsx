import React, { useState } from "react";
import ReviewResponseForm from "./ReviewResponseForm";
import { MessageCircle, Trash2, Edit } from "lucide-react";

const DoctorReviewCard = ({ review, doctorId, onUpdate }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [editingResponse, setEditingResponse] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-center">
            <span className="text-lg font-semibold text-gray-700">
              {review.patientInitials}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{review.patientName}</h3>
              {review.verifiedPatient && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  Verified Patient
                </span>
              )}
              {review.billUrl && (
                <a
                  href={review.billUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200"
                >
                  Bill Attached
                </a>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded capitalize ${getStatusColor(review.moderationStatus)}`}>
            {review.moderationStatus}
          </span>
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
          {review.ratings && Object.entries(review.ratings).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < value ? "bg-yellow-400" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Overall:</span>
            <span className="text-2xl font-bold text-yellow-500">
              {review.overallRating}
            </span>
            <span className="text-sm text-gray-500">/5</span>
          </div>
          <div className="text-sm font-medium">
            {review.recommend ? (
              <span className="text-green-600">✓ Would Recommend</span>
            ) : (
              <span className="text-red-600">✗ Would Not Recommend</span>
            )}
          </div>
        </div>
      </div>

      {/* Review Text */}
      {review.reviewText && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-gray-700">{review.reviewText}</p>
        </div>
      )}

      {review.flags?.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-sm font-semibold text-red-700">Review flags</p>
          <div className="flex flex-wrap gap-2">
            {review.flags.map((flag) => (
              <span key={flag} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                {flag.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Response Section */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle size={18} />
          Doctor Response
        </h4>

        {review.response?.text ? (
          <div className="space-y-3">
            <p className="text-gray-700 p-3 bg-white rounded border border-gray-200">
              {review.response.text}
            </p>
            <p className="text-xs text-gray-500">
              Responded on {new Date(review.response.respondedAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingResponse(true)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this response?")) {
                    onUpdate();
                  }
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResponseForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            Add Response
          </button>
        )}
      </div>

      {/* Response Form */}
      {(showResponseForm || editingResponse) && (
        <ReviewResponseForm
          reviewId={review.id}
          existingResponse={editingResponse ? review.response?.text : null}
          isEditing={editingResponse}
          onClose={() => {
            setShowResponseForm(false);
            setEditingResponse(false);
          }}
          onSuccess={() => {
            setShowResponseForm(false);
            setEditingResponse(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};

export default DoctorReviewCard;
