"use client";

import React, { useState } from "react";
import { Plus, Search, Grid, List, Table2, MoreVertical, Edit, Trash, Star, Filter } from "lucide-react";
import Image from "next/image";

// Mock data
const mockProperties = [
  {
    id: "1",
    title: "Modern Villa in Riyadh",
    price: 1500000,
    location: "Al Malqa, Riyadh",
    specs: { beds: 4, baths: 5, area: 450 },
    status: "Active",
    purpose: "Sale",
    featured: true,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Luxury Apartment with Sea View",
    price: 85000,
    location: "Al Shati, Jeddah",
    specs: { beds: 3, baths: 2, area: 180 },
    status: "Pending",
    purpose: "Rent",
    featured: false,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  // Add more mock properties as needed
];

export default function PropertiesPage() {
  const [view, setView] = useState<"grid" | "list" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your real estate listings</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-md">
            <button onClick={() => setView("grid")} className={`p-2 rounded-sm ${view === "grid" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 rounded-sm ${view === "list" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setView("table")} className={`p-2 rounded-sm ${view === "table" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}><Table2 className="w-4 h-4" /></button>
          </div>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search properties..." 
            className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm bg-background">
            <option value="">Type</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="land">Land</option>
          </select>
          <select className="border rounded-md px-3 py-2 text-sm bg-background">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
          <button className="border rounded-md px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted">
            <Filter className="w-4 h-4" /> More Filters
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {mockProperties.length > 0 ? (
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {mockProperties.map((property) => (
            <div key={property.id} className="bg-card rounded-lg border overflow-hidden flex flex-col group">
              <div className="relative h-48 sm:h-56">
                <Image src={property.image} alt={property.title} fill className="object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-md shadow-sm ${
                    property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                  {property.featured && (
                    <span className="px-2 py-1 text-xs font-medium rounded-md shadow-sm bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      {property.location}
                    </p>
                  </div>
                  <button className="p-1 hover:bg-muted rounded text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-auto pt-4 border-t">
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="flex items-center gap-1 font-medium">{property.specs.beds} Beds</span>
                    <span className="flex items-center gap-1 font-medium">{property.specs.baths} Baths</span>
                    <span className="flex items-center gap-1 font-medium">{property.specs.area} sqm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">SAR {property.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground border px-2 py-1 rounded">{property.purpose}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border rounded-lg bg-card">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-1 mb-4">Try adjusting your filters or add a new property.</p>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md inline-flex items-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      )}
      
      {/* Pagination mock */}
      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-sm text-muted-foreground">Showing 1 to 2 of 2 entries</p>
        <div className="flex gap-1">
          <button className="border px-3 py-1 rounded hover:bg-muted text-sm disabled:opacity-50" disabled>Prev</button>
          <button className="border px-3 py-1 rounded bg-primary text-primary-foreground text-sm">1</button>
          <button className="border px-3 py-1 rounded hover:bg-muted text-sm disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
