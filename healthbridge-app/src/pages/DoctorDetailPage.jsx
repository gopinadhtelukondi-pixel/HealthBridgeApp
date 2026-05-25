import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createReview, getDoctorById, getDoctorRanking, getDoctorReviews, uploadReviewBill } from "@/services/api";
import { DoctorDetail } from "@/components/features/doctors/DoctorDetail";
import { RankingInsight } from "@/components/features/doctors/RankingInsight";
import { ReviewForm } from "@/components/features/reviews/ReviewForm";
import { ReviewList } from "@/components/features/reviews/ReviewList";
import { useApp } from "@/context/AppContext";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, addToast } = useApp();

  const [doctor, setDoctor] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const fetchReviews = async (doctorId) => {
    try {
      setReviewsLoading(true);
      const data = await getDoctorReviews(doctorId);
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching doctor reviews:", err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchRanking = async (doctorId) => {
    try {
      const data = await getDoctorRanking(doctorId);
      setRanking(data);
    } catch (err) {
      console.error("Error fetching doctor ranking:", err);
      setRanking(null);
    }
  };

  useEffect(() => {
    if (doctor) {
      fetchReviews(doctor._id || doctor.id);
      fetchRanking(doctor._id || doctor.id);
    }
  }, [doctor]);

  const validateReview = (review) => {
    if (!currentUser) return "Login as patient to write a review.";
    if (currentUser.role !== "patient") return "Only patients can submit treatment reviews.";
    if (!review.text || !review.text.trim() || review.text.trim().length < 20) return "Review text must be at least 20 characters.";
    if (!review.ratings || Object.values(review.ratings).some((value) => Number.isNaN(value) || value < 1 || value > 5)) {
      return "Please provide valid rating values between 1 and 5.";
    }
    return "";
  };

  const handleReviewSubmit = async (review) => {
    const validationError = validateReview(review);
    if (validationError) {
      addToast(validationError, "error");
      return false;
    }

    try {
      setSubmittingReview(true);
      if (review.billFile) {
        const uploadResponse = await uploadReviewBill(review.billFile);
        review.billUrl = uploadResponse.billUrl;
        delete review.billFile;
      }

      const result = await createReview(review);
      const message = result.moderationStatus === 'pending'
        ? 'Review submitted and will appear once approved by admin.'
        : 'Review submitted successfully.'
      addToast(message, 'success');
      await fetchReviews(doctor._id || doctor.id);
      await fetchRanking(doctor._id || doctor.id);
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Could not submit review", "error");
      return false;
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-ink-muted">
        <p className="text-3xl">Loading doctor details...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20 text-ink-muted page-enter">
        <p className="text-[16px] mb-4">Doctor not found.</p>

        <button
          onClick={() => navigate("/search")}
          className="text-accent font-semibold cursor-pointer bg-transparent border-none font-sans hover:text-success"
        >
          Back to search
        </button>
      </div>
    );
  }

  const reviewSection = (
    <div className="space-y-6">
      <RankingInsight ranking={ranking} />
      <ReviewList reviews={reviews} loading={reviewsLoading} />

      {currentUser?.role === "patient" ? (
        <ReviewForm
          doctor={doctor}
          currentUser={currentUser}
          onSubmit={handleReviewSubmit}
          submitting={submittingReview}
        />
      ) : (
        <div className="card p-6 text-sm text-ink-muted">
          Login as a patient to share your treatment experience for this doctor.
        </div>
      )}
    </div>
  );

  return <DoctorDetail doctor={doctor} reviewSection={reviewSection} />;
}
