import { OpenAI } from "openai";

const systemPrompt = `You are an expert tailwind developer. A user will provide you with a
 low-fidelity wireframe of an application and you will return 
 a single html file that uses tailwind to create the website. Use creative license to make the application more fleshed out.
if you need to insert an image, use placehold.co to create a placeholder image. Respond only with the html file.`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o";
  const max_tokens = process.env.OPENAI_MAX_TOKENS
    ? parseInt(process.env.OPENAI_MAX_TOKENS, 10)
    : 4096;

  const openai = new OpenAI({ baseURL, apiKey });

  const { image } = await request.json();

  const resp = await openai.chat.completions.create({
    model,
    max_tokens,
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: image, detail: "high" },
          },
          {
            type: "text",
            text: "Turn this into a single html file using tailwind.",
          },
        ],
      },
    ],
  });

  return new Response(JSON.stringify(resp), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}
