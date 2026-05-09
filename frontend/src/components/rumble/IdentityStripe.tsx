import { CSSProperties } from "react";
export function IdentityStripe({ colors, className="" }: { colors: [string,string,string]; className?: string }) {
  const style = { ["--c1" as any]: colors[0], ["--c2" as any]: colors[1], ["--c3" as any]: colors[2] } as CSSProperties;
  return <div className={`stripe-tricolor w-full ${className}`} style={style} />;
}
