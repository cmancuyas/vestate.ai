// src/app/(auth)/dashboard/page.tsx
"use client";

export const dynamic = 'force-dynamic'


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

import PurchaseButton from "@/components/ui/PurchaseButton";
import LogoutButton from "@/components/ui/LogoutButton";
import { useAuth } from "@/context/AuthContext";

type ProfileStatus = {
  is_subscribed: boolean;
  is_premium: boolean;
  role?: string;
  region?: string;
  budget_min?: number;
  budget_max?: number;
};

export default function DashboardPage() {
  const session = useSession();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Profile fetch failed:", error.message);
      } else {
        setFullName(data.full_name || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [session, router]);

  if (loading) {
    return <div className="p-6">Loading your dashboard...</div>;
  }

  const { email } = useAuth();
  const [status, setStatus] = useState<ProfileStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!email) return;
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "is_subscribed, is_premium, role, region, budget_min, budget_max"
        )
        .eq("email", email)
        .single();
      if (data) setStatus(data);
    };
    fetchStatus();
  }, [email]);

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Welcome to your dashboard.
          </p>
          <a href="/profile" className="text-blue-600 hover:underline text-sm">
            Edit Profile
          </a>
        </div>
        <p className="text-gray-700">Welcome, {email}</p>
        <p className="text-sm text-green-600">
          Subscription Status:
          <br />
          Role: {status?.role ?? "Not set"}
          <br />
          Region: {status?.region ?? "Not set"}
          <br />
          Budget: {status?.budget_min ? `₱${status.budget_min}` : "N/A"} –{" "}
          {status?.budget_max ? `₱${status.budget_max}` : "N/A"}{" "}
          {status?.is_subscribed ? "Subscribed" : "Not Subscribed"}
          <br />
          Premium Status: {status?.is_premium ? "Premium" : "Standard"}
        </p>
        <LogoutButton />
      </div>
      <div className="my-6">
        <PurchaseButton
          productType="subscription"
          email="user@example.com"
          label="Subscribe as Agent"
        />
      </div>
      <main className="p-10">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {fullName || "User"} 👋
        </h1>
        <p>This is your Vestate.ai dashboard.</p>
      </main>
    </>
  );
}
