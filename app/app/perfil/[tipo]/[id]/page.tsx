"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, AvailabilityBadge } from "@/components/ui/badge";
import { RatingDisplay } from "@/components/ui/rating";
import { ReviewModal } from "@/components/review-modal";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  getCarrierById,
  getShipperById,
  getReviewsForUser,
  getShippers,
} from "@/lib/storage";
import { Carrier, Shipper, Review } from "@/lib/models";
import { formatRelativeTime } from "@/lib/utils";
import {
  MapPin,
  Thermometer,
  Package,
  MessageCircle,
  Star,
  Building,
  Phone,
  Calendar,
  Truck,
  User,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const tipo = params.tipo as string;
  const id = params.id as string;

  const [profile, setProfile] = useState<Carrier | Shipper | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (tipo === "carrier") {
      const carrier = getCarrierById(id);
      setProfile(carrier || null);
    } else if (tipo === "shipper") {
      const shipper = getShipperById(id);
      setProfile(shipper || null);
    }

    const userReviews = getReviewsForUser(id);
    setReviews(userReviews);
    setIsLoading(false);
  }, [tipo, id]);

  const handleReviewSuccess = () => {
    // Reload profile data after review
    if (tipo === "carrier") {
      const carrier = getCarrierById(id);
      setProfile(carrier || null);
    } else if (tipo === "shipper") {
      const shipper = getShipperById(id);
      setProfile(shipper || null);
    }
    const userReviews = getReviewsForUser(id);
    setReviews(userReviews);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <CardSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Perfil no encontrado
            </h2>
            <p className="text-gray-600 mb-4">
              El perfil que buscas no existe o ha sido eliminado.
            </p>
            <Button asChild>
              <Link href="/app">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCarrier = tipo === "carrier";
  const carrier = isCarrier ? (profile as Carrier) : null;
  const shipper = !isCarrier ? (profile as Shipper) : null;

  // Get first shipper as mock current user for reviews
  const shippers = getShippers();
  const currentUserId = shippers[0]?.id || "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
              {isCarrier ? (
                <Truck className="h-8 w-8 text-primary-600" />
              ) : (
                <Building className="h-8 w-8 text-primary-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.companyName}
                  </h1>
                  <p className="text-gray-500">
                    {isCarrier ? "Transportista" : "Cliente"}
                  </p>
                </div>
                {carrier && (
                  <AvailabilityBadge status={carrier.availabilityStatus} />
                )}
              </div>

              {profile.ratingAvg > 0 && (
                <div className="mt-3">
                  <RatingDisplay
                    rating={profile.ratingAvg}
                    count={profile.ratingCount}
                    size="lg"
                  />
                </div>
              )}

              {/* Tags */}
              {profile.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {carrier && (
              <Button asChild variant="whatsapp">
                <a
                  href={`https://wa.me/${carrier.phone.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contactar por WhatsApp
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsReviewModalOpen(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Calificar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>{isCarrier ? carrier?.contactName : shipper?.contactName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Miembro desde {formatRelativeTime(profile.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Carrier-specific details */}
        {carrier && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles de la Unidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {carrier.city}, {carrier.state}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Thermometer className="h-4 w-4" />
                <span>
                  {carrier.tempRangeMin}°C a {carrier.tempRangeMax}°C
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="h-4 w-4" />
                <span>{carrier.capacityPallets} pallets</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="h-4 w-4" />
                <span className="capitalize">
                  {carrier.unitType === "reefer"
                    ? "Refrigerado"
                    : carrier.unitType}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Calificaciones ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aún no hay calificaciones</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setIsReviewModalOpen(true)}
              >
                Sé el primero en calificar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>

                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {review.comment && (
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        toUserId={id}
        toUserType={tipo as "carrier" | "shipper"}
        fromUserId={currentUserId}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
}
