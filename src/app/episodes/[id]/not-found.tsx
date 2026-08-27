import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return <EmptyState title="Такого эпизода нет" hint="Всего в базе 51 эпизод." resetHref="/episodes" />;
}
