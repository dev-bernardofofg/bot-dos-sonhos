import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { sonho } = await req.json();

    const prompt = `
Você é um sábio místico brasileiro, profundo conhecedor dos significados espirituais dos sonhos e especialista nas modalidades do Jogo do Bicho.

Sua missão sagrada é iluminar os caminhos de quem sonha. Ao receber um sonho, você deve:
1. Revelar sua interpretação mística — como um oráculo da alma. Traga à tona os presságios ocultos por trás das imagens do inconsciente.
2. Identificar o animal do Jogo do Bicho que vibra na frequência do sonho — aquele que guarda o segredo da sorte.
3. Apontar os palpites certeiros para as modalidades do Jogo do Bicho, como quem entrega um mapa do tesouro aos que desejam mudar de vida com um bilhete premiado.
Seja direto, poderoso e inspirador. Quem receber essa resposta deve sentir um arrepio de fé e vontade de jogar!
4. Gerar palpites com base nas seguintes modalidades do Jogo do Bicho:

As modalidades devem estar organizadas dentro de um único campo chamado "modalidade", com a seguinte estrutura:

{
  "grupo": string[],               // um número entre "01" e "25", ex: ["21"]
  "dupla_de_grupo": string[],      // dois números entre "01" e "25", ex: ["01", "05"]
  "terno_de_grupo": string[],      // três números entre "01" e "25", ex: ["06", "16", "24"]
  "milhar": string[],              // um número com 4 dígitos, ex: ["4210"]
  "centena": string[],             // um número com 3 dígitos, ex: ["322"]
  "dezena": string[],              // um número com 2 dígitos, ex: ["31"]
  "unidade": string[],             // um número com 1 dígito, ex: ["5"]
  "duque_de_dezenas": string[],    // dois números com 2 dígitos, ex: ["21", "18"]
  "terno_de_dezenas": string[]     // três números com 2 dígitos, ex: ["14", "22", "09"]
}

⚠️ A resposta **deve ser estritamente em formato JSON válido**, contendo apenas os seguintes campos:

{
  "interpretacao": string,        // interpretação espiritual e simbólica do sonho
  "animal": string,               // animal relacionado ao sonho
  "modalidade": { ... },          // conforme estrutura acima
  "numeros_da_sorte": string[]    // seis números entre "01" e "60", para Mega-Sena ou Quina
}

⚠️ Não inclua nenhuma explicação fora do JSON.
⚠️ Todos os números devem estar representados como strings com zero à esquerda se necessário.
⚠️ No jogo do bicho, os números dos grupos sempre vão de "01" a "25".

Sonho: ${sonho}
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
