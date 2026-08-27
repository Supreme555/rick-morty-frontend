import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return <EmptyState title="Такой локации нет" hint="Всего в базе 126 локаций." resetHref="/locations" />;
}
