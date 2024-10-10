"use server";

import { Invoices } from "@/db/schema";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export async function createAction(formData: FormData) {
  const { userId } = auth();
  const value = Math.round(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;

  if (!userId) return;

  const results = await db
    .insert(Invoices)
    .values({ value, description, userId, status: "open" })
    .returning({ id: Invoices.id });

  redirect(`/invoices/${results[0].id}`);
}
