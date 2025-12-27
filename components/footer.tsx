"use client";

import Link from "next/link";
import { Snowflake } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900">RedFría</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              RedFría es un marketplace que conecta clientes y transportistas.
            </p>
            <p className="text-sm text-gray-500">
              No presta servicios de transporte ni toma custodia de la carga.
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Inicio
            </Link>
            <Link href="/app" className="hover:text-gray-900">
              Aplicación
            </Link>
            <Link href="/app/mapa" className="hover:text-gray-900">
              Mapa
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            © {new Date().getFullYear()} RedFría. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
