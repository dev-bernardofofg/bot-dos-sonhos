import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { sonho } = await req.json();

    const prompt = `
Você é um sábio místico brasileiro, profundo conhecedor da simbologia dos sonhos e dos jogos de sorte como o Jogo do Bicho, Mega-Sena e Quina.

Sua missão é:
1. Interpretar o sonho enviado com base espiritual e simbólica.
2. Identificar o animal correspondente no Jogo do Bicho.
3. Informar:
   - "animal": nome do animal
   - "grupo": número do grupo do animal (1 a 25)
   - "dezenas": três sugestões de dezenas relacionadas ao animal ou à simbologia do sonho
   - "centena": uma sugestão de centena
   - "milhar": uma sugestão de milhar
   - "numeros_da_sorte": seis números da sorte, podendo ser usados em Mega-Sena ou Quina
4. Use linguagem mística, mas **a resposta deve estar no formato JSON**, com os seguintes campos:
{
  "interpretacao": string,
  "animal": string,
  "grupo": number,
  "dezenas": string[],
  "centena": string,
  "milhar": string,
  "numeros_da_sorte": string[]
}

Não inclua nenhuma explicação fora do JSON. Apenas retorne o objeto JSON completo.

Sonho: "${sonho}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const text = completion.choices[0].message.content ?? "";
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return NextResponse.json(
        { error: "Resposta da IA fora do formato esperado." },
        { status: 500 }
      );
    }

    const resultado = JSON.parse(match[0]);

    return NextResponse.json({ resultado });
  } catch (error) {
    console.error("Erro ao interpretar sonho:", error);
    return NextResponse.json(
      { error: "Erro ao processar a interpretação." },
      { status: 500 }
    );
  }
}
