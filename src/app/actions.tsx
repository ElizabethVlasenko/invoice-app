"use server";

import { Customers, Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAction(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const value = Math.round(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const [customer] = await db
    .insert(Customers)
    .values({ name, email, userId, organizationId: orgId || null })
    .returning({ id: Customers.id });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      organizationId: orgId || null,
      customerId: customer.id,
      status: "open",
    })
    .returning({ id: Invoices.id });

  redirect(`/invoices/${results[0].id}`);
}

export async function UpdateStatusAction(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      );
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  revalidatePath(`/invoices/${id}`, "page");
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const id = formData.get("id") as string;

  if (orgId) {
    await db
      .delete(Invoices)
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organizationId, orgId))
      );
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  redirect("/dashboard");
}
