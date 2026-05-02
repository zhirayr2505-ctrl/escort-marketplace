type Props = { params: { id: string } };

export default function ModelPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Модель #{params.id}</h1>
      <p className="mt-2 text-neutral-600">Карусель, цены, контакты — в разработке.</p>
    </main>
  );
}
