const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const FIXED_CATEGORIES = ['Food', 'Clothing', 'Essentials', 'Additional Services', 'Tuitions'];

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no content');
  return JSON.parse(text);
}

// Ranks approved sellers against a natural-language need
async function searchSellers(queryText, sellers) {
  const compact = sellers.map((s) => ({ id: s.id, category: s.category, title: s.title, description: s.description }));
  const prompt = `You are matching a resident's request to a list of approved sellers in their housing society.
Request: "${queryText}"
Sellers (JSON): ${JSON.stringify(compact)}

Return ONLY a JSON object: {"matchedIds": [<seller id numbers ranked most relevant first, only real matches, empty array if none>]}`;

  const result = await callGemini(prompt);
  return Array.isArray(result.matchedIds) ? result.matchedIds : [];
}

// Classifies a free-text seller description into one of the 5 fixed categories
async function suggestCategory(description) {
  const prompt = `Classify this seller's offering into exactly one of these categories: ${FIXED_CATEGORIES.join(', ')}.
Offering: "${description}"

Return ONLY a JSON object: {"category": "<one of the exact category names above>"}`;

  const result = await callGemini(prompt);
  return FIXED_CATEGORIES.includes(result.category) ? result.category : FIXED_CATEGORIES[0];
}

// Expands a rough seller description into a polished listing
async function generateListing(roughText) {
  const prompt = `A resident wants to sell something in their housing society marketplace. Turn their rough description into a polished listing.
Rough description: "${roughText}"

Return ONLY a JSON object: {"title": "<short catchy title, max 60 chars>", "description": "<1-2 polished sentences>", "price_range": "<short price range string, e.g. '₹200-300' or 'Contact for pricing'>"}`;

  return callGemini(prompt);
}

module.exports = { searchSellers, suggestCategory, generateListing, FIXED_CATEGORIES };
