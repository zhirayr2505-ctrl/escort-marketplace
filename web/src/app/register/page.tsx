export default function RegisterPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const hasCode = Boolean(searchParams.code);

  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold">Регистрация модели</h1>
      {!hasCode ? (
        <p className="mt-4 text-red-600">Нужна действующая инвайт-ссылка с параметром code.</p>
      ) : (
        <p className="mt-4 text-neutral-600">Форма регистрации — в разработке (code принят).</p>
      )}
    </main>
  );
}
