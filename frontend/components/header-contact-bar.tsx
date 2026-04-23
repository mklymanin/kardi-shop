import { getSiteContact } from "@/lib/api/site-settings";
import { Skeleton } from "@/components/ui/skeleton";

export function HeaderContactBarSkeleton() {
  return (
    <div className="font-display flex flex-col gap-2 text-sm text-white/90 md:flex-row md:items-center md:justify-start md:gap-10">
      <Skeleton className="h-4 w-36 rounded-md bg-white/20" />
      <Skeleton className="h-4 w-40 rounded-md bg-white/20" />
      <Skeleton className="h-4 w-48 rounded-md bg-white/20" />
    </div>
  );
}

export async function HeaderContactBar() {
  const c = await getSiteContact();

  return (
    <div className="font-display flex flex-col gap-2 text-sm text-white/90 md:flex-row md:items-center md:justify-start md:gap-10">
      <a href={c.phoneHref}>{c.phoneLabel}</a>
      <a href={c.emailHref}>{c.email}</a>
      <span>{c.workSchedule}</span>
    </div>
  );
}
