// src/app/(auth)/listings/deleted/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/toast-context"; // ✅ Correct path

export default function DeletedListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const { toast } = useToast(); // ✅ Use context-based toast

  const fetchDeleted = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", user.id)
      .eq("deleted", true);

    setListings(data || []);
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  const permanentlyDelete = async (id: string, photos: string[]) => {
    const fileKeys = photos
      .map((url) => url.split("/listing-photos/")[1])
      .filter(Boolean);

    const { error: storageError } = await supabase.storage
      .from("listing-photos")
      .remove(fileKeys);

    const { error: deleteError } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (storageError || deleteError) {
      toast({
        title: "Failed to permanently delete",
        description: "An error occurred while deleting the listing or media.",
        variant: "error",
      });
    } else {
      toast({
        title: "Listing deleted",
        description: "Listing and all media have been removed.",
        variant: "success",
      });
      fetchDeleted();
    }
  };

  const restoreListing = async (id: string) => {
    const { error } = await supabase
      .from("listings")
      .update({ deleted: false })
      .eq("id", id);

    if (error) {
      toast({
        title: "Failed to restore",
        description: "Could not restore the listing.",
        variant: "error",
      });
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc("increment_listing_count", { user_id: user.id });

      toast({
        title: "Listing restored",
        description: "Your listing is now active again.",
        variant: "success",
      });

      fetchDeleted();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deleted Listings</h1>
      <ul className="space-y-4">
        {listings.map((listing) => (
          <li
            key={listing.id}
            className="p-4 border rounded bg-red-50 dark:bg-red-900"
          >
            <h2 className="font-semibold text-red-700 dark:text-red-300">
              {listing.title}
            </h2>
            <p className="text-sm text-red-600 dark:text-red-200">
              ₱ {listing.price}
            </p>
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={() => restoreListing(listing.id)}
                className="text-green-600 hover:underline"
              >
                Restore
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Permanently delete this listing and remove all photos?"
                    )
                  ) {
                    permanentlyDelete(listing.id, listing.photos || []);
                  }
                }}
                className="text-red-600 hover:underline"
              >
                Permanently Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
