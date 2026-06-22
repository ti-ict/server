import { cn } from "@/lib/utils";
import {
  HTMLAttributes,
  BlockquoteHTMLAttributes,
  TableHTMLAttributes
} from "react";

export function H1({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  );
}

export function H2({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  );
}

export function H3({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function H4({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function P({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("leading-7 not-first:mt-6", className)} {...props} />;
}

export function Blockquote({
  className,
  ...props
}: BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  );
}

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  );
}

export function Ul({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  );
}

export function InlineCode({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    />
  );
}

export function Lead({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xl text-muted-foreground", className)} {...props} />
  );
}

export function Large({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
}

export function Small({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <small
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  );
}

export function Muted({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}
