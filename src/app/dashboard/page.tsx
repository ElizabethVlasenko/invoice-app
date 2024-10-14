import { CirclePlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function Page() {
  const { userId } = auth();

  if (!userId) return <p>Unauthorized</p>;

  const results = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.userId, userId));

  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers,
    };
  });

  return (
    <main>
      <Container>
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">Invoices</h1>
          <p>
            <Button variant="ghost" className="inline-flex gap-2" asChild>
              <Link href="/invoices/new">
                <CirclePlus className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Date</TableHead>
              <TableHead className="p-4">Customer</TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="text-center p-4">Status</TableHead>
              <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="text-left p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    {new Date(result.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="font-semibold  p-4 block"
                  >
                    {result.customer.name}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link href={`/invoices/${result.id}`} className=" p-4 block">
                    {result.customer.email}
                  </Link>
                </TableCell>
                <TableCell className="text-center p-0">
                  <Link href={`/invoices/${result.id}`} className=" p-4 block">
                    <Badge
                      className={cn(
                        "rounded-full capitalize",
                        result.status === "open" &&
                          "bg-blue-500 hover:bg-blue-400",
                        result.status === "paid" &&
                          "bg-green-600 hover:bg-green-500",
                        result.status === "void" &&
                          "bg-zinc-700 hover:bg-zinc-600",
                        result.status === "uncollectible" &&
                          "bg-red-600 hover:bg-zinc-500"
                      )}
                    >
                      <span className="font-semibold">{result.status}</span>
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    ${(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
