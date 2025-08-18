"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { getTranslation } from "@/lib/translations";
import { submitAppointment } from "@/lib/appointment-service";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Heart,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  sessionType: string;
  preferredDate: string;
  preferredTime: string;
}

interface FormErrors {
  [key: string]: string;
}

export function BookingForm() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    sessionType: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>("");

  const sessionTypes = [
    { value: "individual", labelKey: "booking.sessionType.individual" },
    { value: "couples", labelKey: "booking.sessionType.couples" },
    { value: "family", labelKey: "booking.sessionType.family" },
    { value: "consultation", labelKey: "booking.sessionType.consultation" },
  ];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = getTranslation("booking.validation.name", language);
    }

    if (!formData.email.trim()) {
      newErrors.email = getTranslation("booking.validation.email", language);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = getTranslation("booking.validation.email", language);
    }

    if (!formData.phone.trim()) {
      newErrors.phone = getTranslation("booking.validation.phone", language);
    }

    if (!formData.sessionType) {
      newErrors.sessionType = getTranslation(
        "booking.validation.sessionType",
        language
      );
    }

    if (!formData.preferredDate) {
      newErrors.date = getTranslation("booking.validation.date", language);
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!formData.preferredTime) {
      newErrors.time = getTranslation("booking.validation.time", language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!validateForm()) {
  //     return
  //   }

  //   setIsSubmitting(true)
  //   setErrors((prev) => ({ ...prev, submit: "" }))

  //   try {
  //     const result = await submitAppointment(formData)

  //     if (result.success) {
  //       setAppointmentId(result.appointmentId || "")
  //       setIsSubmitted(true)
  //       setFormData({
  //         fullName: "",
  //         email: "",
  //         phone: "",
  //         sessionType: "",
  //         preferredDate: "",
  //         preferredTime: "",
  //       })
  //     } else {
  //       setErrors({ submit: result.error || getTranslation("booking.error", language) })
  //     }
  //   } catch (error) {
  //     console.error("Submission error:", error)
  //     if (error instanceof Error) {
  //       if (error.message.includes("network") || error.message.includes("fetch")) {
  //         setErrors({ submit: "Network error. Please check your connection and try again." })
  //       } else {
  //         setErrors({ submit: error.message })
  //       }
  //     } else {
  //       setErrors({ submit: getTranslation("booking.error", language) })
  //     }
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      // 1. Create a new object with the correct property names
      const appointmentData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        sessionType: formData.sessionType,
        date: formData.preferredDate,
        time: formData.preferredTime,
      };

      // 2. Pass the new object to the submitAppointment function
      const result = await submitAppointment(appointmentData);

      if (result.success) {
        setAppointmentId(result.appointmentId || "");
        setIsSubmitted(true);
        // Reset the form state
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          sessionType: "",
          preferredDate: "",
          preferredTime: "",
        });
      } else {
        setErrors({
          submit: result.error || getTranslation("booking.error", language),
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (error instanceof Error) {
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          setErrors({
            submit:
              "Network error. Please check your connection and try again.",
          });
        } else {
          setErrors({ submit: error.message });
        }
      } else {
        setErrors({ submit: getTranslation("booking.error", language) });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setAppointmentId("");
    setErrors({});
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      sessionType: "",
      preferredDate: "",
      preferredTime: "",
    });
  };

  if (isSubmitted) {
    return (
      <section id="booking" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {getTranslation("booking.success", language)}
              </h3>
              {appointmentId && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Reference ID: {appointmentId.slice(-8).toUpperCase()}
                  </span>
                </div>
              )}
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className="w-4 h-4" />
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              {getTranslation("booking.title", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {getTranslation("booking.name", language)}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder={getTranslation(
                    "booking.name.placeholder",
                    language
                  )}
                  className={errors.fullName ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {getTranslation("booking.email", language)}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={getTranslation(
                    "booking.email.placeholder",
                    language
                  )}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {getTranslation("booking.phone", language)}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={getTranslation(
                    "booking.phone.placeholder",
                    language
                  )}
                  className={errors.phone ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Session Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {getTranslation("booking.sessionType", language)}
                </Label>
                <Select
                  value={formData.sessionType}
                  onValueChange={(value) =>
                    handleInputChange("sessionType", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={errors.sessionType ? "border-destructive" : ""}
                  >
                    <SelectValue
                      placeholder={getTranslation(
                        "booking.sessionType.placeholder",
                        language
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {getTranslation(type.labelKey, language)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sessionType && (
                  <p className="text-sm text-destructive">
                    {errors.sessionType}
                  </p>
                )}
              </div>

              {/* Date and Time Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Preferred Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {getTranslation("booking.date", language)}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      handleInputChange("preferredDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className={errors.date ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date}</p>
                  )}
                </div>

                {/* Preferred Time */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {getTranslation("booking.time", language)}
                  </Label>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value) =>
                      handleInputChange("preferredTime", value)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      className={errors.time ? "border-destructive" : ""}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && (
                    <p className="text-sm text-destructive">{errors.time}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {getTranslation("booking.submitting", language)}
                  </div>
                ) : (
                  getTranslation("booking.submit", language)
                )}
              </Button>

              {errors.submit && (
                <p className="text-sm text-destructive text-center">
                  {errors.submit}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
