"use client";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

type Props = { text: string } & React.ComponentProps<typeof Button>;

export default function CopyButton({ text, ...props }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button size="icon" onClick={handleClick} {...props}>
      <Copy
        className={`absolute transition-all duration-300 ${
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      />
      <Check
        className={`absolute transition-all duration-300 ${
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </Button>
  );
}
