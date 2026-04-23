import { getSiteContact } from "@/lib/api/site-settings";
import { Skeleton } from "@/components/ui/skeleton";

export function FooterContactBlockSkeleton() {
  return (
    <div className="font-display flex flex-col gap-2 pt-2">
      <Skeleton className="h-4 w-48 rounded-md bg-white/20" />
      <Skeleton className="h-4 w-36 rounded-md bg-white/20" />
    </div>
  );
}

export async function FooterContactBlock() {
  const c = await getSiteContact();

  return (
    <div className="font-display flex flex-col gap-2 pt-2">
      <a href={c.emailHref}>{c.email}</a>
      <a href={c.phoneHref}>{c.phoneLabel}</a>
    </div>
  );
}
