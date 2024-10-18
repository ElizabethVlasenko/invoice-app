import { createPayment, UpdateStatusAction } from "@/app/actions";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { Check, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

interface InvoicePageProps {
  params: { invoiceId: string };
  searchParams: {
    status: string;
    session_id: string;
  };
}

export default async function page({ params, searchParams }: InvoicePageProps) {
  const invoiceId = parseInt(params.invoiceId);

  const sessionId = (await searchParams).session_id;

  const isSuccess = !!sessionId && (await searchParams).status == "success";
  const isCanceled = (await searchParams).status == "canceled";
  let isError = isSuccess && !sessionId;

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(
      sessionId
    );

    if (payment_status !== "paid") {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");

      await UpdateStatusAction(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      value: Invoices.value,
      description: Invoices.description,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) notFound();

  const invoice = {
    ...result,
    customer: { name: result.name },
  };

  return (
    <main>
      <Container>
        {isError && (
          <p className="bg-red-100 text-sm text-red-800 text-center px-3 py-2 rounded-lg mb-6">
            Something went wrong, please try again
          </p>
        )}
        {isCanceled && (
          <p className="bg-yellow-100 text-sm text-yellow-800 text-center px-3 py-2 rounded-lg mb-6">
            Payment was cancelled, please try again
          </p>
        )}
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-3xl font-bold mb-6">
                Invoice #{invoice.id}
                <Badge
                  className={cn(
                    "rounded-full capitalize",
                    invoice.status === "open" &&
                      "bg-blue-500 hover:bg-blue-400",
                    invoice.status === "paid" &&
                      "bg-green-600 hover:bg-green-500",
                    invoice.status === "void" &&
                      "bg-zinc-700 hover:bg-zinc-600",
                    invoice.status === "uncollectible" &&
                      "bg-red-600 hover:bg-zinc-500"
                  )}
                >
                  <span className="font-semibold">{invoice.status}</span>
                </Badge>
              </h1>
            </div>
            <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
            <p className="text-lg mb-8">{invoice.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Manage invoice</h2>
            {invoice.status === "open" && (
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
                <Button className="flex gap-2 bg-green-700 hover:bg-green-600 font-bold">
                  <CreditCard className="w-5 h-auto" /> Pay invoice
                </Button>
              </form>
            )}
            {invoice.status === "paid" && (
              <p className="flex gap-2 align-center text-xl font-bold">
                <Check className="w-7 h-auto bg-green-500 rounded-full p-1 text-white" />
                Invoice Paid
              </p>
            )}{" "}
          </div>
        </div>
        <h2 className="font-bold text-lg mb-4">Billing details</h2>
        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
