import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export interface LocationFilterValues {
  name: string;
  type: string;
  dimension: string;
}

export function LocationFilters({ values }: { values: LocationFilterValues }) {
  const active = Object.values(values).some(Boolean);
  return (
    <form
      key={JSON.stringify(values)}
      action="/locations"
      method="get"
      className="mb-6 grid gap-3 rounded-card border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end"
    >
      <Field label="Название" htmlFor="f-name">
        <Input id="f-name" name="name" defaultValue={values.name} maxLength={100} placeholder="Earth, Citadel…" />
      </Field>
      <Field label="Тип" htmlFor="f-type">
        <Input id="f-type" name="type" defaultValue={values.type} maxLength={100} placeholder="Planet, Space station…" />
      </Field>
      <Field label="Измерение" htmlFor="f-dimension">
        <Input id="f-dimension" name="dimension" defaultValue={values.dimension} maxLength={100} placeholder="C-137" />
      </Field>
      <div className="flex items-center gap-2">
        <Button type="submit">Применить</Button>
        {active && (
          <Link href="/locations" className="text-sm text-muted underline underline-offset-4 hover:text-fg">
            Сбросить
          </Link>
        )}
      </div>
    </form>
  );
}
