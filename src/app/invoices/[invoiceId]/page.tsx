import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { Invoices } from "@/db/schema";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";

export default async function page({
  params,
}: {
  params: { invoiceId: string };
}) {
  const invoiceId = parseInt(params.invoiceId);
  const { userId } = auth();

  if (!userId) return <p>Unauthorized</p>;

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) notFound();

  return (
    <main>
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center gap-4 text-3xl font-bold mb-6">
            Invoice #{invoiceId}
            <Badge
              className={cn(
                "rounded-full capitalize",
                result.status === "open" && "bg-blue-500 hover:bg-blue-400",
                result.status === "paid" && "bg-green-600 hover:bg-green-500",
                result.status === "void" && "bg-zinc-700 hover:bg-zinc-600",
                result.status === "uncollectible" &&
                  "bg-red-600 hover:bg-zinc-500"
              )}
            >
              <span className="font-semibold">{result.status}</span>
            </Badge>
          </h1>
          <p></p>
        </div>
        <p className="text-3xl mb-3">${(result.value / 100).toFixed(2)}</p>
        <p className="text-lg mb-8">{result.description}</p>
        <h2 className="font-bold text-lg mb-4">Billing details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoiceId}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(result.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span></span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span></span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
