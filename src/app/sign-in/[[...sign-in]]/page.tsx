// src/app/sign-in/[[...sign-in]]/page.tsx
import Container from "@/components/Container";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Container className="flex justify-center">
      <SignIn path="/sign-in" />
    </Container>
  );
}
