import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Container from "@/components/Container";
import Link from "next/link";

export default function Header() {
  return (
    <header className="pt-8 mb-12">
      <Container className="flex justify-between items-center gap-4 ">
        <p className="font-bold mb-[7px]">
          <Link href="/dashboard">Invoicipedia</Link>
        </p>
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
