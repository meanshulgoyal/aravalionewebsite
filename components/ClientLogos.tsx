type Client = {
  name: string;
};

export function ClientLogos({ clients }: { clients: Client[] }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {clients.map((client) => (
        <div
          className="grid min-h-[76px] place-items-center rounded-lg border border-white/14 bg-white px-4 py-3 text-center shadow-sm"
          key={client.name}
          title={client.name}
        >
          <span className="text-sm font-black text-ink">{client.name}</span>
        </div>
      ))}
    </div>
  );
}
