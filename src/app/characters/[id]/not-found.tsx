import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="Такого персонажа нет"
      hint="Возможно, он существует в другом измерении. Проверьте номер записи."
      resetHref="/characters"
    />
  );
}
