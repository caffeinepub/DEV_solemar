import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { ArrowLeft, Calendar, CheckCircle, Twitter, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

interface BookingState {
  referenceCode?: string;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  name?: string;
  tweetPosted?: boolean;
  tweetError?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  return Math.max(
    1,
    Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export default function BookingConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as BookingState) ?? {};

  const {
    referenceCode = "SOL-000000",
    checkIn = "",
    checkOut = "",
    guestCount = 1,
    name = "Guest",
    tweetPosted,
    tweetError,
  } = state;

  // Log tweet result as required
  useEffect(() => {
    if (tweetPosted !== undefined || tweetError !== undefined) {
      if (tweetPosted) {
        console.log("[Tweet] Posted successfully for booking", referenceCode);
      } else if (tweetError) {
        console.log("[Tweet] Failed to post:", tweetError);
      }
    }
  }, [referenceCode, tweetPosted, tweetError]);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16"
      data-ocid="booking_confirm.page"
    >
      {/* Decorative wave background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-ambient">
            <CheckCircle className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome,{" "}
            <span className="font-semibold text-foreground">{name}</span>. Your
            seaside escape awaits.
          </p>
        </motion.div>

        {/* Reference code card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-primary text-primary-foreground rounded-2xl px-8 py-6 text-center mb-6 shadow-lifted"
          data-ocid="booking_confirm.reference_card"
        >
          <p className="text-sm uppercase tracking-widest opacity-80 mb-2 font-body">
            Booking Reference
          </p>
          <p className="font-display text-4xl md:text-5xl font-bold tracking-wider">
            {referenceCode}
          </p>
          <p className="text-xs opacity-70 mt-2 font-body">
            Keep this code for your records
          </p>
        </motion.div>

        {/* Details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-warm p-6 mb-6 space-y-4"
          data-ocid="booking_confirm.details_card"
        >
          {checkIn && checkOut && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Calendar
                  className="w-5 h-5 text-secondary"
                  strokeWidth={1.5}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                  Dates
                </p>
                <p className="font-semibold text-foreground text-sm">
                  {formatDate(checkIn)} → {formatDate(checkOut)}
                </p>
                {nights > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="h-px bg-border" />

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-secondary" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                Guests
              </p>
              <p className="font-semibold text-foreground text-sm">
                {guestCount} {guestCount === 1 ? "guest" : "guests"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tweet status */}
        {(tweetPosted !== undefined || tweetError !== undefined) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6"
            data-ocid="booking_confirm.tweet_status"
          >
            {tweetPosted ? (
              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <Twitter className="w-4 h-4 text-primary" />
                <span>Your arrival has been shared on Twitter/X 🌊</span>
                <Badge variant="outline" className="text-xs">
                  Posted
                </Badge>
              </div>
            ) : tweetError ? (
              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <Twitter className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs">Tweet not posted</span>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-accent/20 border border-accent/30 rounded-xl px-5 py-4 mb-8 text-center"
          data-ocid="booking_confirm.info_note"
        >
          <p className="text-sm text-foreground/80">
            🏖️ A confirmation has been noted. You'll find us at Muro Alto, PE,
            Brasil — arrive to the sound of waves.
          </p>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: "/" })}
            className="gap-2 transition-smooth hover:bg-primary hover:text-primary-foreground hover:border-primary"
            data-ocid="booking_confirm.back_home_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
