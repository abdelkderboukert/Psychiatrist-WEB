"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageCircle, User, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getTranslation } from "@/lib/translations";
import { FeedbackService, type Feedback } from "@/lib/feedback-service";
import type { Timestamp } from "firebase/firestore";

export function FeedbackSection() {
  const { language } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load feedback from Firebase
  // useEffect(() => {
  //   const loadFeedback = async () => {
  //     try {
  //       setLoading(true);
  //       const approvedFeedback = await FeedbackService.getApprovedFeedback();
  //       setFeedbacks(approvedFeedback);
  //     } catch (error) {
  //       console.error("Failed to load feedback:", error);
  //       const sampleFeedbacks: Feedback[] = [
  //         {
  //           id: "1",
  //           name: "Sarah M.",
  //           rating: 5,
  //           message:
  //             "Dr. Sarah helped me through a very difficult time. Her compassionate approach and professional expertise made all the difference in my healing journey.",
  //           date: "2024-01-15",
  //           approved: true,
  //           language: "en",
  //         },
  //         {
  //           id: "2",
  //           name: "Ahmed K.",
  //           rating: 5,
  //           message:
  //             "Excellent therapist with deep understanding of cultural nuances. I felt heard and supported throughout my sessions.",
  //           date: "2024-01-10",
  //           approved: true,
  //           language: "en",
  //         },
  //         {
  //           id: "3",
  //           name: "Marie L.",
  //           rating: 4,
  //           message:
  //             "Professional and caring approach. The sessions were very helpful for my anxiety management.",
  //           date: "2024-01-05",
  //           approved: true,
  //           language: "en",
  //         },
  //       ];
  //       setFeedbacks(sampleFeedbacks);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadFeedback();
  // }, []);

  useEffect(() => {
    const loadFeedback = async () => {
      const sampleFeedbacks: Feedback[] = [
        {
          id: "1",
          name: "farah M.",
          rating: 5,
          message:
            "Dr. farah helped me through a very difficult time. Her compassionate approach and professional expertise made all the difference in my healing journey.",
          date: "2024-01-15",
          approved: true,
          language: "en",
        },
        {
          id: "2",
          name: "Ahmed K.",
          rating: 5,
          message:
            "Excellent therapist with deep understanding of cultural nuances. I felt heard and supported throughout my sessions.",
          date: "2024-01-10",
          approved: true,
          language: "en",
        },
        {
          id: "3",
          name: "Marie L.",
          rating: 4,
          message:
            "Professional and caring approach. The sessions were very helpful for my anxiety management.",
          date: "2024-01-05",
          approved: true,
          language: "en",
        },
      ];
      try {
        setLoading(true);
        const approvedFeedback = await FeedbackService.getApprovedFeedback();

        if (approvedFeedback.length === 0) {
          // If no approved feedback is found, use the sample data
          setFeedbacks(sampleFeedbacks);
        } else {
          // Otherwise, use the data from Firebase
          setFeedbacks(approvedFeedback);
        }
      } catch (error) {
        console.error("Failed to load feedback:", error);

        // Use sample data as a fallback on error
        setFeedbacks(sampleFeedbacks);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = getTranslation("feedback.validation.name", language);
    }
    if (formData.rating === 0) {
      newErrors.rating = getTranslation("feedback.validation.rating", language);
    }
    if (!formData.message.trim()) {
      newErrors.message = getTranslation(
        "feedback.validation.message",
        language
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await FeedbackService.submitFeedback({
        ...formData,
        language,
      });

      setSubmitStatus("success");
      setFormData({ name: "", rating: 0, message: "" });
      setShowForm(false);

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={
              interactive && onRatingChange
                ? () => onRatingChange(star)
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Timestamp | string) => {
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString();
    }
    return date.toDate().toLocaleDateString();
  };

  return (
    <section className="py-16 bg-gradient-to-br from-sage-50 to-ocean-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold font-serif text-amber-600 mb-4">
            {getTranslation("feedback.title", language)}
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            {getTranslation("feedback.subtitle", language)}
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="mb-8 p-4 bg-sage-100 border border-sage-200 rounded-lg text-sage-800 text-center">
            {getTranslation("feedback.form.success", language)}
          </div>
        )}

        {/* Feedback Form Toggle */}
        <div className="text-center mb-12">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-ocean-600 hover:bg-ocean-700 text-black"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {getTranslation("feedback.form.title", language)}
          </Button>
        </div>

        {/* Feedback Form */}
        {showForm && (
          <Card className="max-w-2xl mx-auto mb-12 border-sage-200">
            <CardHeader>
              <CardTitle className="text-charcoal">
                {getTranslation("feedback.form.title", language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {getTranslation("feedback.form.name", language)}
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={getTranslation(
                      "feedback.form.name.placeholder",
                      language
                    )}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {getTranslation("feedback.form.rating", language)}
                  </label>
                  {renderStars(formData.rating, true, (rating) =>
                    setFormData({ ...formData, rating })
                  )}
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2 text-black">
                    {getTranslation("feedback.form.message", language)}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={getTranslation(
                      "feedback.form.message.placeholder",
                      language
                    )}
                    rows={4}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {submitStatus === "error" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {getTranslation("feedback.form.error", language)}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-ocean-600 hover:bg-ocean-700 text-black"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {isSubmitting
                      ? getTranslation("feedback.form.submitting", language)
                      : getTranslation("feedback.form.submit", language)}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-ocean-600 mx-auto mb-4" />
            <p className="text-charcoal/60">Loading feedback...</p>
          </div>
        )}

        {/* Feedback Display */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <Card
                  key={feedback.id}
                  className="border-sage-200 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-ocean-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-ocean-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal">
                          {feedback.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          {renderStars(feedback.rating)}
                          <span className="text-sm text-charcoal/60">
                            {feedback.rating}{" "}
                            {getTranslation("feedback.stars", language)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-charcoal/80 leading-relaxed">
                      {feedback.message}
                    </p>
                    <p className="text-sm text-charcoal/50 mt-4">
                      {formatDate(feedback.date)}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <MessageCircle className="w-16 h-16 text-charcoal/30 mx-auto mb-4" />
                <p className="text-charcoal/60">
                  {getTranslation("feedback.noFeedback", language)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
