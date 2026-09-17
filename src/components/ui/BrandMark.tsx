import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  className?: string;
}

/** Símbolo do Banco Ágil: quadrado arredondado em gradiente com o ícone de banco. */
export function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-strong text-white shadow-bubble",
        className
      )}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.32) }}
      aria-hidden="true"
    >
      <Landmark size={Math.round(size * 0.5)} strokeWidth={2.2} />
    </div>
  );
}
