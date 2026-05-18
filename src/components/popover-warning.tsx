import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import type { Popover as PopoverPrimitive } from "radix-ui";

export default function PopoverWarning({
  children,
  action,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> & {
  children: React.ReactNode;
  action: () => void;
}) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-32">
        <Button variant="destructive" onClick={action} className="w-full">
          Are you sure?
        </Button>
      </PopoverContent>
    </Popover>
  );
}
