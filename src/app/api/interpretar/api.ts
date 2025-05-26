export async function interpretarSonho(sonho: string) {
  const res = await fetch("/api/interpretar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sonho }),
  });

  if (!res.ok) {
    throw new Error("Erro ao interpretar o sonho.");
  }

  const data = await res.json();
  return data.resultado;
}
