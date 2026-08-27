export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Данные —{" "}
          <a
            href="https://rickandmortyapi.com"
            className="underline decoration-line underline-offset-4 hover:text-fg"
            target="_blank"
            rel="noreferrer"
          >
            The Rick and Morty API
          </a>
          , запрашиваются через собственный сервер приложения.
        </p>
        <p className="font-mono">826 персонажей · 51 эпизод · 126 локаций</p>
      </div>
    </footer>
  );
}
