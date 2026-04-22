import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { addDays, format, isAfter, isBefore, parseISO } from "date-fns";
import { CalendarIcon, Loader2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useBackend } from "../hooks/use-backend";
import type { BookingFormData } from "../types";

const today = format(new Date(), "yyyy-MM-dd");
const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

export function BookingForm() {
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      checkIn: today,
      checkOut: tomorrow,
      guestCount: 2,
      name: "",
      email: "",
    },
  });

  const checkInValue = watch("checkIn");

  const onSubmit = async (data: BookingFormData) => {
    if (!actor || isFetching) {
      toast.error("Still connecting to backend. Please try again.");
      return;
    }

    // Validate dates
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);

    if (!isAfter(checkOutDate, checkInDate)) {
      toast.error("Check-out must be after check-in.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reference = await actor.createBooking(
        data.checkIn,
        data.checkOut,
        BigInt(data.guestCount),
        data.name,
        data.email,
      );

      await navigate({
        to: "/booking-confirm",
        state: {
          referenceCode: reference,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guestCount: data.guestCount,
          name: data.name,
          tweetPosted: true,
          tweetError: undefined,
        } as unknown as Record<string, unknown>,
      });
    } catch (err) {
      console.error("[Booking error]", err);
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="booking"
      className="py-16 bg-background"
      data-ocid="booking.section"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Book Your Stay
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Reserve your slice of paradise — no hidden fees, no credit card
            required upfront.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto card-warm p-8 shadow-lifted"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Date row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="checkIn"
                  className="font-body text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <CalendarIcon size={14} className="text-primary" />
                  Check-in
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  min={today}
                  data-ocid="booking.checkin.input"
                  {...register("checkIn", {
                    required: "Check-in date is required",
                    validate: (v) =>
                      !isBefore(parseISO(v), parseISO(today)) ||
                      "Check-in cannot be in the past",
                  })}
                  className="font-body text-sm"
                />
                {errors.checkIn && (
                  <p
                    className="text-destructive text-xs font-body"
                    data-ocid="booking.checkin.field_error"
                  >
                    {errors.checkIn.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="checkOut"
                  className="font-body text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <CalendarIcon size={14} className="text-primary" />
                  Check-out
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  min={
                    checkInValue
                      ? format(addDays(parseISO(checkInValue), 1), "yyyy-MM-dd")
                      : tomorrow
                  }
                  data-ocid="booking.checkout.input"
                  {...register("checkOut", {
                    required: "Check-out date is required",
                  })}
                  className="font-body text-sm"
                />
                {errors.checkOut && (
                  <p
                    className="text-destructive text-xs font-body"
                    data-ocid="booking.checkout.field_error"
                  >
                    {errors.checkOut.message}
                  </p>
                )}
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-1.5">
              <Label
                htmlFor="guestCount"
                className="font-body text-sm font-semibold text-foreground flex items-center gap-1.5"
              >
                <Users size={14} className="text-primary" />
                Number of Guests
              </Label>
              <select
                id="guestCount"
                data-ocid="booking.guests.select"
                {...register("guestCount", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="font-body text-sm font-semibold text-foreground"
              >
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Maria Silva"
                data-ocid="booking.name.input"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name too short" },
                })}
                className="font-body text-sm"
              />
              {errors.name && (
                <p
                  className="text-destructive text-xs font-body"
                  data-ocid="booking.name.field_error"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="font-body text-sm font-semibold text-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="maria@email.com"
                data-ocid="booking.email.input"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="font-body text-sm"
              />
              {errors.email && (
                <p
                  className="text-destructive text-xs font-body"
                  data-ocid="booking.email.field_error"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isFetching}
              className="w-full font-body font-semibold text-base py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-ocid="booking.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Booking…
                </>
              ) : (
                "Reserve Now"
              )}
            </Button>

            {(isSubmitting || isFetching) && (
              <p
                className="text-center text-sm text-muted-foreground font-body"
                data-ocid="booking.loading_state"
              >
                {isFetching && !isSubmitting
                  ? "Connecting to server…"
                  : "Processing your booking…"}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
