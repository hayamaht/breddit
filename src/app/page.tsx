import { ModeToggle } from "@/components/layouts/mode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      Home
      <div>
        <Button>Click</Button>
      </div>
      <div>
        <ModeToggle />
      </div>
    </main>
  );
}
