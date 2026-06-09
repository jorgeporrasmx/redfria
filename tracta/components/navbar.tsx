"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { Truck, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/app", label: "Tablero" },
  { href: "/app/viajes", label: "Viajes" },
  { href: "/app/clientes", label: "Clientes" },
  { href: "/app/transportistas", label: "Transportistas" },
  { href: "/app/mapa", label: "Mapa" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/app"
      ? pathname === "/app"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary-600" />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {BRAND.name}
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(link.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="ml-2">
              <Link href="/app/viajes/nuevo">+ Nuevo viaje</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-lg transition-colors",
                  isActive(link.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/app/viajes/nuevo"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium rounded-lg text-primary-600 bg-primary-50"
            >
              + Nuevo viaje
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
