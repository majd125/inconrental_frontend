import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// URL of your Laravel backend - using 127.0.0.1 is more stable for Node.js
const BACKEND_URL = 'http://127.0.0.1:8000/api';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Fetch Real-time Data from Laravel
    let availableCars = "Could not load current fleet.";
    let availableExcursions = "Could not load excursions.";

    try {
      console.log('--- STARTING DB FETCH ---');
      const [carsRes, excursionsRes] = await Promise.allSettled([
        fetch(`${BACKEND_URL}/vehicules/disponibles`).then(res => res.json()),
        fetch(`${BACKEND_URL}/excursions`).then(res => res.json())
      ]);

      if (carsRes.status === 'fulfilled') {
        const val = carsRes.value;
        if (val.success) {
          const cars = val.data;
          availableCars = Array.isArray(cars) && cars.length > 0 
            ? cars.map((c: any) => `- ${c.marque} ${c.modele} (${c.transmission}): ${Math.round(c.prix_final || c.prix_base)} TND`).join('\n')
            : "No cars are currently available for rent.";
        } else {
          console.error('Cars fetch success: false', val.message);
        }
      } else {
        console.error('Cars fetch REJECTED:', carsRes.reason);
      }

      if (excursionsRes.status === 'fulfilled') {
        const val = excursionsRes.value;
        if (val.success) {
          const excursions = Array.isArray(val.data) ? val.data.filter((e: any) => e.actif) : [];
          availableExcursions = excursions.length > 0
            ? excursions.map((e: any) => `- ${e.nom}: ${Math.round(e.prix_par_personne)} TND`).join('\n')
            : "No excursions are currently active.";
        }
      }
      console.log('--- DB FETCH COMPLETE ---');
    } catch (fetchError) {
      console.error('CRITICAL FETCH ERROR:', fetchError);
    }

    // 2. Call Groq with the Dynamic Context
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `IDENTITY: You are the IconRental Information Assistant. You only provide information found on our website and database.

REAL-TIME CATALOG DATA (AS OF ${new Date().toLocaleString()}):
AVAILABLE CARS:
${availableCars}

ACTIVE EXCURSIONS:
${availableExcursions}

STRICT RULES:
- ONLY answer questions about IconRental.
- NEVER invent cars, excursions, or prices not listed above.
- If a car is not in the list above, it is NOT available.
- You CANNOT book, modify, or confirm reservations. Always say: "Please use the booking forms on our website to finalize your reservation."
- For information NOT listed above, say: "Please contact us directly for more specific details."
- Keep answers short, friendly, and professional.`,
        },
        ...messages,
      ],
    });

    return Response.json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}