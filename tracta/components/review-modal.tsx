"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { RatingInput } from "./ui/rating";
import { Badge } from "./ui/badge";
import { saveReview } from "@/lib/storage";
import { TRANSPORTISTA_TAGS, CLIENTE_TAGS } from "@/lib/constants";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  toUserId: string;
  toUserType: "transportista" | "cliente";
  fromName?: string;
  tripId?: string;
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  toUserId,
  toUserType,
  fromName = "Operación",
  tripId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = toUserType === "transportista" ? TRANSPORTISTA_TAGS : CLIENTE_TAGS;

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
      saveReview({
        id: uuidv4(),
        fromName,
        toUserId,
        toUserType,
        rating,
        tags: selectedTags,
        comment: comment.trim() || undefined,
        relatedTripId: tripId,
        createdAt: new Date().toISOString(),
      });
      toast.success("Calificación registrada");
      onSuccess?.();
      onClose();
      setRating(5);
      setSelectedTags([]);
      setComment("");
    } catch {
      toast.error("Error al registrar la calificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calificar">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <RatingInput value={rating} onChange={setRating} />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario (opcional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte la experiencia del servicio..."
            rows={3}
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-500">{comment.length}/500 caracteres</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar calificación"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
