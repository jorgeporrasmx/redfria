"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { RatingInput } from "./ui/rating";
import { Badge } from "./ui/badge";
import { saveReview } from "@/lib/storage";
import { CarrierTags, ShipperTags } from "@/lib/models";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  toUserId: string;
  toUserType: "carrier" | "shipper";
  fromUserId: string;
  shipmentId?: string;
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  toUserId,
  toUserType,
  fromUserId,
  shipmentId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = toUserType === "carrier" ? CarrierTags : ShipperTags;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);

    try {
      const review = {
        id: uuidv4(),
        fromUserId,
        toUserId,
        toUserType,
        rating,
        tags: selectedTags,
        comment: comment.trim() || undefined,
        createdAt: new Date().toISOString(),
        relatedShipmentId: shipmentId,
      };

      saveReview(review);
      toast.success("Calificación enviada correctamente");
      onSuccess?.();
      onClose();

      // Reset form
      setRating(5);
      setSelectedTags([]);
      setComment("");
    } catch {
      toast.error("Error al enviar la calificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calificar">
      <div className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <RatingInput value={rating} onChange={setRating} />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Características (opcional)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="focus:outline-none"
              >
                <Badge
                  variant={selectedTags.includes(tag) ? "success" : "outline"}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {tag}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario (opcional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia..."
            rows={3}
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-500">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Calificación"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
