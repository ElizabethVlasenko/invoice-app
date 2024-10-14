"use client";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";

import { deleteInvoiceAction, UpdateStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AVAILABLE_STATUSES } from "@/data/invoices";
import { ChevronDown, Ellipsis, Trash2 } from "lucide-react";
import { useOptimistic } from "react";

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect;
}

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
    }
  );

  async function handleOnUpdateStatus(formData: FormData) {
    const originalStatus = formData.get("status") as string;
    setCurrentStatus(formData.get("status") as string);
    try {
      await UpdateStatusAction(formData);
    } catch {
      setCurrentStatus(originalStatus);
    }
  }
  return (
    <main>
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center gap-4 text-3xl font-bold mb-6">
            Invoice #{invoice.id}
            <Badge
              className={cn(
                "rounded-full capitalize",
                currentStatus === "open" && "bg-blue-500 hover:bg-blue-400",
                currentStatus === "paid" && "bg-green-600 hover:bg-green-500",
                currentStatus === "void" && "bg-zinc-700 hover:bg-zinc-600",
                currentStatus === "uncollectible" &&
                  "bg-red-600 hover:bg-zinc-500"
              )}
            >
              <span className="font-semibold">{currentStatus}</span>
            </Badge>
          </h1>
          <div className="flex gap-4">
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2 items-center">
                    Change status
                    <ChevronDown className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {AVAILABLE_STATUSES.map((status) => (
                    <DropdownMenuItem key={status.id}>
                      <form action={handleOnUpdateStatus} className="w-full">
                        <input type="hidden" name="id" value={invoice.id} />
                        <input type="hidden" name="status" value={status.id} />
                        <button className="w-full text-left">
                          {status.label}
                        </button>
                      </form>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <span className="sr-only">More options</span>
                    <Ellipsis className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DialogTrigger asChild>
                      <button className="w-full text-left flex gap-2 items-center">
                        <Trash2 className="w-4 h-auto" />
                        Delete invoice
                      </button>
                    </DialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl">
                    Delete invoice?
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    This action cannot be undone. This will permanently delete
                    your invoice information and remove data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <form
                    action={deleteInvoiceAction}
                    className="w-full flex justify-center"
                  >
                    <input type="hidden" name="id" value={invoice.id} />
                    <Button
                      variant="destructive"
                      className="text-left flex gap-2 items-center"
                    >
                      <Trash2 className="w-4 h-auto" />
                      Delete invoice
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
        <p className="text-lg mb-8">{invoice.description}</p>
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
