import { cn } from "@/lib/utils";

interface MonogramProps {
  size?: number;
  /** Fundo claro (para a barra escura) ou escuro (para superfícies claras). */
  tone?: "light" | "dark";
  className?: string;
}

/** Monograma "BA": quadrado sólido com as iniciais, sem gradiente. */
export function Monogram({ size = 28, tone = "dark", className }: MonogramProps) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 select-none place-items-center rounded font-semibold leading-none tracking-tight",
        tone === "light" ? "bg-surface text-navy" : "bg-navy text-white",
        className
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      aria-hidden="true"
    >
      BA
    </span>
  );
}

interface WordmarkProps {
  tone?: "light" | "dark";
  className?: string;
}

export function Wordmark({ tone = "light", className }: WordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Monogram size={28} tone={tone} />
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          tone === "light" ? "text-white" : "text-navy"
        )}
      >
        Banco Ágil
      </span>
    </span>
  );
}
