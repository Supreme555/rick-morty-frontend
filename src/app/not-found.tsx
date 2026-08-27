import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return <EmptyState title="Страница не найдена" hint="Проверьте адрес или вернитесь к поиску." resetHref="/" />;
}
