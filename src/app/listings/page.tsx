"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/components/listings/FavoriteButton";

import PurchaseButton from "@/components/ui/PurchaseButton";

export default function PublicListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const router = useRouter();

  const fetchListings = async () => {
    let query = supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("title", `%${search}%`);
    if (minPrice) query = query.gte("price", parseFloat(minPrice));
    if (maxPrice) query = query.lte("price", parseFloat(maxPrice));
    if (category) query = query.eq("category", category);

    const { data } = await query;
    setListings(data || []);

    // Example usage of PurchaseButton
    // Replace 'user@example.com' with actual user email
    console.log("Render PurchaseButton here for each listing if needed");
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <div className="my-6">
        <PurchaseButton
          productType="boost"
          email="user@example.com"
          label="Boost Your Listing"
        />
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Available Properties</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title"
            className="col-span-1 sm:col-span-2 p-2 border rounded"
          />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min price"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price"
            className="p-2 border rounded"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="foreclosed">Foreclosed</option>
            <option value="under_construction">Under Construction</option>
          </select>

          <button
            onClick={fetchListings}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-1"
          >
            Filter
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border rounded shadow p-4"
            >
              {listing.photos?.[0] && (
                <img
                  src={listing.photos[0]}
                  alt="Photo"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-600 truncate">
                {listing.description}
              </p>
              <p className="text-sm mt-1 font-medium">₱{listing.price}</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All Categories</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="foreclosed">Foreclosed</option>
                <option value="under_construction">Under Construction</option>
              </select>

              <button
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="text-blue-600 text-sm mt-2 hover:underline"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
