"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

type Interpretacao = {
  interpretacao: string;
  animal: string;
  grupo: number;
  dezenas: string[];
  centena: string;
  milhar: string;
  numeros_da_sorte: string[];
};

export default function Home() {
  const [sonho, setSonho] = useState("");
  const [resposta, setResposta] = useState<Interpretacao | null>(null);
  const [historico, setHistorico] = useState<Interpretacao[]>([]);

  // Carrega histórico do localStorage ao iniciar
  useEffect(() => {
    const local = localStorage.getItem("historico-sonhos");
    if (local) setHistorico(JSON.parse(local));
  }, []);

  // Salva histórico quando uma nova resposta é recebida
  const salvarHistorico = (nova: Interpretacao) => {
    const novoHistorico = [nova, ...historico].slice(0, 5); // Máximo 5
    setHistorico(novoHistorico);
    localStorage.setItem("historico-sonhos", JSON.stringify(novoHistorico));
  };

  const interpretar = async () => {
    const res = await fetch("/api/interpretar", {
      method: "POST",
      body: JSON.stringify({ sonho }),
    });
    const data = await res.json();
    setResposta(data.resultado);
    salvarHistorico(data.resultado);
  };

  return (
    <main className="max-w-xl mx-auto mt-20 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        🌙 Bot dos Sonhos & Bicho
      </h1>

      <Textarea
        value={sonho}
        onChange={(e) => setSonho(e.target.value)}
        placeholder="Conte seu sonho aqui..."
      />
      <Button onClick={interpretar} disabled={!sonho}>
        Interpretar
      </Button>

      {resposta && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p>
              💤 <strong>Interpretação:</strong> {resposta.interpretacao}
            </p>
            <p>
              🎰 <strong>Bicho:</strong> {resposta.animal} (Grupo{" "}
              {resposta.grupo})
            </p>
            <p>
              {/* 🔢 <strong>Dezenas:</strong> {resposta.dezenas.join(", ")} */}
            </p>
            <p>
              💯 <strong>Centena:</strong> {resposta.centena} |{" "}
              <strong>Milhar:</strong> {resposta.milhar}
            </p>
            <p>
              ✨ <strong>Números da sorte:</strong>{" "}
              {/* {resposta.numeros_da_sorte.join(" - ")} */}
            </p>
          </CardContent>
        </Card>
      )}

      {historico.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-bold mt-8">🕰️ Últimos Palpites</h2>
          {historico.map((item, idx) => (
            <Card key={idx}>
              <CardContent className="p-3 text-sm space-y-1">
                <p>
                  <strong>Interpretação:</strong> {item.interpretacao}
                </p>
                <p>
                  <strong>Bicho:</strong> {item.animal} (Grupo {item.grupo})
                </p>
                <p>
                  <strong>Dezenas:</strong> {item.dezenas}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
