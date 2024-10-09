"use client";

import { createAction } from "@/app/actions";
import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Form from "next/form";
import { SyntheticEvent, useState } from "react";

export default function Page() {
  const [state, setState] = useState("ready");

  async function handleOnSubmit(event: SyntheticEvent) {
    if (state === "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  }

  return (
    <main>
      <Container>
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
        </div>
        {/*could use shadcn form*/}
        <Form
          action={createAction}
          onSubmit={handleOnSubmit}
          className="grid gap-4 max-w-xs"
        >
          <div>
            <Label htmlFor="name" className="block mb-2 font-semibold text-sm">
              Billing Name
            </Label>
            <Input id="name" name="name" type="text" />
          </div>
          <div>
            <Label htmlFor="email" className="block mb-2 font-semibold text-sm">
              Billing Email
            </Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div>
            <Label htmlFor="value" className="block mb-2 font-semibold text-sm">
              Value
            </Label>
            <Input id="value" name="value" type="text" />
          </div>
          <div>
            <Label
              htmlFor="description"
              className="block mb-2 font-semibold text-sm"
            >
              Description
            </Label>
            <Textarea id="description" name="description" />
          </div>

          <SubmitButton />
        </Form>
      </Container>
    </main>
  );
}
