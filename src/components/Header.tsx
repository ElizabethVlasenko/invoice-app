import React from "react";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Container from "@/components/Container";
import Link from "next/link";

export default function Header() {
  return (
    <header className="pt-8 mb-12">
      <Container className="flex justify-between items-center gap-4 ">
        <div className="flex items-center gap-4  mb-[7px]">
          <p className="font-bold">
            <Link href="/dashboard">Invoicipedia</Link>
          </p>
          <span className="text-slate-300">/</span>
          <SignedIn>
            <span className="-ml-2">
              <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
            </span>
          </SignedIn>
        </div>
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Container>
    </header>
  );
}
