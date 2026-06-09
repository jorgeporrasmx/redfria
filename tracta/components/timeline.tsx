"use client";

import { Checkpoint } from "@/lib/models";
import { formatDateTime } from "@/lib/utils";
import { MapPin } from "lucide-react";

export function Timeline({ checkpoints }: { checkpoints: Checkpoint[] }) {
  if (!checkpoints.length) {
    return (
      <p className="text-sm text-gray-400">Aún no hay actualizaciones de ruta.</p>
    );
  }

  const ordered = [...checkpoints].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <ol className="relative border-l border-gray-200 ml-2">
      {ordered.map((cp, i) => (
        <li key={cp.id} className="mb-5 ml-4">
          <span
            className={`absolute -left-1.5 mt-1 h-3 w-3 rounded-full ${
              i === 0 ? "bg-primary-600" : "bg-gray-300"
            }`}
          />
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{cp.label}</h4>
            <time className="text-xs text-gray-400">
              {formatDateTime(cp.timestamp)}
            </time>
          </div>
          {cp.location && (
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin className="h-3 w-3" /> {cp.location}
            </p>
          )}
          {cp.note && <p className="text-xs text-gray-500 mt-0.5">{cp.note}</p>}
        </li>
      ))}
    </ol>
  );
}
