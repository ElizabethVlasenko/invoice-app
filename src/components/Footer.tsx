import React from "react";
import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="mt-12 mb-8">
      <Container className="flex justify-between items-center gap-4 ">
        <p className="text-sm text-gray-500">
          Invoicipedia &copy; {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
}
