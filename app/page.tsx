import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid place-items-center h-screen">
   <Button variant={"destructive"}>
    Click me
   </Button>
   </div>
  );
}
