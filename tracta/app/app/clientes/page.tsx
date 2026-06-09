"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClientes, getViajes } from "@/lib/storage";
import { Cliente, Viaje } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RatingDisplay } from "@/components/ui/rating";
import { Plus, Search, Building2, MapPin, Phone } from "lucide-react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setClientes(getClientes());
    setViajes(getViajes());
  }, []);

  const countTrips = (id: string) => viajes.filter((v) => v.clienteId === id).length;

  const filtered = clientes.filter((c) =>
    c.companyName.toLowerCase().includes(query.toLowerCase()) ||
    c.contactName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">{clientes.length} embarcadores</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/app/clientes/nuevo"><Plus className="h-4 w-4" /> Nuevo cliente</Link>
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        <Input placeholder="Buscar cliente..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          No hay clientes. <Link href="/app/clientes/nuevo" className="text-primary-600 underline">Crea el primero</Link>.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/app/clientes/${c.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                        <Building2 className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">{c.companyName}</h3>
                        <p className="text-xs text-gray-500">{c.contactName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500 mt-3">
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {c.city}, {c.state}</p>
                    <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {c.phone}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {c.ratingAvg > 0 ? <RatingDisplay rating={c.ratingAvg} count={c.ratingCount} size="sm" /> : <span className="text-xs text-gray-400">Sin calificación</span>}
                    <span className="text-xs font-medium text-gray-500">{countTrips(c.id)} viajes</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
