import { redirect } from "react-router";

export async function loader() {
  return redirect("/shop", { status: 301 });
}

export default function CollectionsAll() {
  return null;
}
