import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  return (
    <main className=" text-center">
      <Container className="flex flex-col justify-center gap-6 h-full ">
        <h1 className="text-5xl font-bold">Invoicipedia</h1>
        <p>
          <Button asChild>
            <Link href="/dashboard">Sign in</Link>
          </Button>
        </p>
      </Container>
    </main>
  );
}
