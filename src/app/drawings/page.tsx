import { getAllDrawings } from "@/lib/drawings";
import DrawingsClient from "./DrawingsClient";

export default async function DrawingsPage() {
  const drawings = await getAllDrawings();
  return <DrawingsClient drawings={drawings} />;
}