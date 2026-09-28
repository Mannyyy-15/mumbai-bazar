import { redirect } from "react-router";
import type { Route } from "./+types/collections.$handle";

export async function loader({ params }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) return redirect("/collections", { status: 301 });

  const map: Record<string, string> = {
    wedding: "/wedding-sarees",
    festive: "/festive-edit",
    banarasi: "/shop?weave=banarasi",
    kanjivaram: "/shop?weave=kanjivaram",
    "pure-silk": "/silk-sarees",
    everyday: "/everyday-sarees",
    "new-arrivals": "/new-arrivals",
  };

  if (map[handle]) {
    return redirect(map[handle], { status: 301 });
  }

  return redirect(`/shop?q=${encodeURIComponent(handle)}`, { status: 301 });
}

export default function CollectionRoute() {
  return null;
}
