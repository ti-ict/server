import { Cloud } from "lucide-react";

export function Logo() {
  return (
    <div className="flex justify-center gap-2 md:justify-start">
      <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Cloud className="size-4" />
      </div>
      TI-ICT VMs
    </div>
  );
}
