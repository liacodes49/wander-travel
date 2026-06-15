import { NextResponse } from 'next/server';
import flightsData from '@/data/flights.json';

// Helper to filter mock flights matching the planned destination
function getMatchingFlights(destinationName: string) {
  if (!destinationName) return [];
  
  // Clean destination, e.g. "Goa (Demo Mode)" -> "goa"
  const normalizedDest = destinationName
    .toLowerCase()
    .replace(/\s*\(demo mode\)\s*/i, '')
    .split('&')[0]
    .split('and')[0]
    .trim();

  // Filter flights matching the destination string
  const matched = flightsData.filter((flight) => {
    const flightDest = flight.destination.toLowerCase();
    // Match if destination name is contained in the flight destination, or vice versa
    return (
      flightDest.includes(normalizedDest) || 
      normalizedDest.includes(flightDest.split(' ')[0])
    );
  });

  return matched.slice(0, 3); // Return up to 3 flight options
}

const MOCK_TRIP = {
  destination: "Goa (Demo Mode)",
  country: "India",
  tagline: "Sun, sand, and spices on the shores of the Arabian Sea",
  weather: "Warm & humid (28°C - 32°C)",
  best_season: "November to February",
  currency: "Indian Rupee (INR)",
  language: "Konkani & English",
  fun_fact: "Goa has over 7000 bars, and is home to Asia's only floating casinos!",
  total_budget: "₹35,000",
  budget: {
    flights: "₹8,000",
    hotels: "₹12,000",
    food: "₹6,000",
    transport: "₹3,000",
    activities: "₹4,000",
    shopping: "₹2,000"
  },
  itinerary: [
    {
      day: 1,
      title: "North Goa Beaches & Sunset",
      morning: "Arrive in Goa, check in to your cozy beach resort near Anjuna.",
      afternoon: "Relish a traditional Goan fish thali at a local beach shack and relax on the sand.",
      evening: "Walk around the rocky cliffs of Vagator beach and watch the sunset from Chapora Fort."
    },
    {
      day: 2,
      title: "Culture, Spice & Old Goa",
      morning: "Visit a lush spice plantation in Ponda, enjoying a guided tour and herbal tea.",
      afternoon: "Explore the UNESCO-listed Basilicas of Old Goa, admiring the colonial architecture.",
      evening: "Head to Fontainhas, the Latin Quarter of Panaji, for colorful houses and bakery treats."
    },
    {
      day: 3,
      title: "Hidden Waterfalls & South Goa",
      morning: "Early drive to the majestic Dudhsagar Waterfalls for a refreshing dip.",
      afternoon: "Relax at the tranquil Palolem beach, famous for its crescent bay and clean waters.",
      evening: "Enjoy a candlelit seafood dinner by the ocean with live acoustic music."
    }
  ],
  food: [
    { name: "Goan Fish Curry thali", icon: "Utensils", description: "Fresh catch cooked in rich coconut gravy with local spices, served with red rice." },
    { name: "Bebinca", icon: "GlassWater", description: "A multi-layered traditional Goan dessert made of coconut milk, ghee, and egg yolk." },
    { name: "Pork Vindaloo", icon: "Utensils", description: "A spicy, tangy dish slow-cooked with vinegar, garlic, and hot red chilies." },
    { name: "Feni cocktail", icon: "GlassWater", description: "Local liquor distilled from cashew apple or coconut, mixed with lime and soda." }
  ],
  hidden_gems: [
    { name: "Cola Beach Lagoon", icon: "Palmtree", description: "A secluded beach where a sweet-water lagoon meets the sea, perfect for quiet kayaking." },
    { name: "Devil's Canyon", icon: "Trees", description: "A beautiful, eerie river gorge carved in rock, located inside the Bhagwan Mahavir Sanctuary." },
    { name: "Chorla Ghat", icon: "Mountain", description: "A misty mountain pass bordering Goa and Karnataka with stunning valley views." }
  ],
  packing: [
    "Light cotton clothes",
    "Sunscreen & sunglasses",
    "Flip-flops & walking shoes",
    "Swimwear & quick-dry towel",
    "Dry bag for electronics",
    "Mosquito repellent"
  ],
  tips: [
    "Rent a scooter to explore Goan streets like a local (usually ₹400/day).",
    "Carry cash, as shacks in South Goa might have poor network connectivity.",
    "Respect local custom: change out of swimwear before entering residential areas.",
    "Bargain politely at flea markets in Anjuna and Calangute."
  ]
};

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const ollamaModel = process.env.OLLAMA_MODEL;
    const ollamaBase = process.env.OLLAMA_API_BASE || 'http://127.0.0.1:11434';
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let travelPlan: any = null;

    // 1. Local Ollama Model (Highest Priority for testing if model is set in env)
    if (ollamaModel) {
      try {
        const ollamaPrompt = `You are an expert travel planner. Plan a detailed, highly curated trip based on the user's request: "${prompt}".
Provide concrete local choices and tips. Return 3-5 itinerary days, 4 food options, 3 hidden gems, 6-8 packing items, and 4 tips.
Return Lucide React icon names like "Utensils", "GlassWater", "Palmtree", "Mountain", "Gem", "Hotel" in the "icon" fields, NOT emojis.

Respond ONLY with valid JSON. Do not include markdown backticks or explanation outside the JSON.
Schema:
{
  "destination": "string",
  "country": "string",
  "tagline": "string",
  "weather": "string",
  "best_season": "string",
  "currency": "string",
  "language": "string",
  "fun_fact": "string",
  "total_budget": "string",
  "budget": {
    "flights": "string",
    "hotels": "string",
    "food": "string",
    "transport": "string",
    "activities": "string",
    "shopping": "string"
  },
  "itinerary": [
    {
      "day": 1,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string"
    }
  ],
  "food": [
    {
      "name": "string",
      "icon": "string",
      "description": "string"
    }
  ],
  "hidden_gems": [
    {
      "name": "string",
      "icon": "string",
      "tip": "string"
    }
  ],
  "packing": ["string"],
  "tips": ["string"]
}`;

        const response = await fetch(`${ollamaBase}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            prompt: ollamaPrompt,
            format: 'json',
            stream: false
          })
        });

        if (!response.ok) {
          throw new Error(`Ollama failed with status ${response.status}`);
        }

        const resData = await response.json();
        const contentText = resData.response;
        if (!contentText) {
          throw new Error('Ollama returned an empty response');
        }

        travelPlan = JSON.parse(contentText.trim());
      } catch (e) {
        console.error('Ollama planning failed, trying other APIs...', e);
      }
    }

    // 2. Google Gemini API (Recommended cloud model)
    if (!travelPlan && geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
        
        const schema = {
          type: "OBJECT",
          properties: {
            destination: { type: "STRING" },
            country: { type: "STRING" },
            tagline: { type: "STRING" },
            weather: { type: "STRING" },
            best_season: { type: "STRING" },
            currency: { type: "STRING" },
            language: { type: "STRING" },
            fun_fact: { type: "STRING" },
            total_budget: { type: "STRING" },
            budget: {
              type: "OBJECT",
              properties: {
                flights: { type: "STRING" },
                hotels: { type: "STRING" },
                food: { type: "STRING" },
                transport: { type: "STRING" },
                activities: { type: "STRING" },
                shopping: { type: "STRING" }
              },
              required: ["flights", "hotels", "food", "transport", "activities", "shopping"]
            },
            itinerary: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  day: { type: "INTEGER" },
                  title: { type: "STRING" },
                  morning: { type: "STRING" },
                  afternoon: { type: "STRING" },
                  evening: { type: "STRING" }
                },
                required: ["day", "title", "morning", "afternoon", "evening"]
              }
            },
            food: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  icon: { type: "STRING" },
                  description: { type: "STRING" }
                },
                required: ["name", "icon", "description"]
              }
            },
            hidden_gems: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  icon: { type: "STRING" },
                  tip: { type: "STRING" }
                },
                required: ["name", "icon", "tip"]
              }
            },
            packing: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            tips: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: [
            "destination", "country", "tagline", "weather", "best_season",
            "currency", "language", "fun_fact", "total_budget", "budget",
            "itinerary", "food", "hidden_gems", "packing", "tips"
          ]
        };

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert travel planner. Plan a detailed, highly curated trip based on the user's request: "${prompt}". Provide concrete local choices and tips. Return 3-5 itinerary days, 4 food options, 3 hidden gems, 6-8 packing items, and 4 tips. Return Lucide React icon names like "Utensils", "GlassWater", "Palmtree", "Mountain", "Gem", "Hotel" in the "icon" fields, NOT emojis.`
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: schema
            }
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const contentText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (contentText) {
            travelPlan = JSON.parse(contentText);
          }
        }
      } catch (e) {
        console.error('Gemini planning failed, trying other APIs...', e);
      }
    }

    // 3. Anthropic Claude API (Fallback cloud model)
    if (!travelPlan && anthropicKey) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2500,
            system: `You are an expert travel planner. Respond ONLY with valid JSON — no markdown, no backticks, no explanation. Schema:
{"destination":"string","country":"string","tagline":"string","weather":"string","best_season":"string","currency":"string","language":"string","fun_fact":"string","total_budget":"string","budget":{"flights":"string","hotels":"string","food":"string","transport":"string","activities":"string","shopping":"string"},"itinerary":[{"day":1,"title":"string","morning":"string","afternoon":"string","evening":"string"}],"food":[{"name":"string","icon":"string","description":"string"}],"hidden_gems":[{"name":"string","icon":"string","tip":"string"}],"packing":["item1","item2"],"tips":["tip1","tip2"]}
Return 3-5 itinerary days, 4 foods, 3 hidden gems, 6-8 packing items, 4 tips. Keep all strings concise. Return Lucide icon names like "Utensils", "GlassWater", "Palmtree", "Mountain", "Gem", "Hotel" in the "icon" fields, NOT emojis.`,
            messages: [{ role: 'user', content: `Plan a detailed trip based on: ${prompt}` }]
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const rawText = resData.content?.[0]?.text || '';
          const cleanJson = rawText.replace(/```json|```/g, '').trim();
          travelPlan = JSON.parse(cleanJson);
        }
      } catch (e) {
        console.error('Anthropic planning failed...', e);
      }
    }

    // 4. Mock Fallback (Demo Mode if no APIs succeed or exist)
    if (!travelPlan) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const mockData = { ...MOCK_TRIP };
      if (prompt.toLowerCase().includes('mountain') || prompt.toLowerCase().includes('trek')) {
        mockData.destination = "Manali & Solang Valley (Demo Mode)";
        mockData.tagline = "Snow-capped peaks, pine forests, and thrills in the Himalayas";
        mockData.weather = "Cool & crisp (12°C - 20°C)";
        mockData.best_season = "October to June";
        mockData.currency = "Indian Rupee (INR)";
        mockData.language = "Hindi & Pahari";
        mockData.fun_fact = "Manali is named after the Sanatan Hindu lawgiver Manu; its name literally means 'the abode of Manu'.";
        mockData.total_budget = "₹25,000";
        mockData.budget = {
          flights: "₹6,000",
          hotels: "₹8,000",
          food: "₹5,000",
          transport: "₹3,000",
          activities: "₹2,000",
          shopping: "₹1,000"
        };
        mockData.itinerary = [
          {
            day: 1,
            title: "Arrive in Old Manali",
            morning: "Check in to a riverside cafe-cottage in Old Manali.",
            afternoon: "Walk along the Beas river and eat hot woodfired pizza at local cafes.",
            evening: "Explore the ancient wooden Hadimba Temple nestled in Dhungri forest."
          },
          {
            day: 2,
            title: "Solang Valley Adventure",
            morning: "Drive to Solang Valley for paragliding or zorbing.",
            afternoon: "Hike up to the scenic Jogini Waterfalls near Vashisht village.",
            evening: "Dip in the hot sulfur springs of Vashisht to soothe your muscles."
          },
          {
            day: 3,
            title: "Rohtang Pass & Snow Line",
            morning: "Early start to Rohtang Pass (3978m) for breath-taking snow views.",
            afternoon: "Have hot Maggi noodles by the roadside tea stalls in the mountains.",
            evening: "Shop for yak-wool shawls and wooden handicrafts on Mall Road."
          }
        ];
        mockData.food = [
          { name: "Siddu", icon: "Utensils", description: "Local wheat flour bread stuffed with poppy seeds and walnuts, served with ghee." },
          { name: "Trout Fish", icon: "Fish", description: "Fresh wood-fried mountain trout cooked with local aromatic herbs." },
          { name: "Dham", icon: "Utensils", description: "Traditional festive meal consisting of rice, pulses, and curds, cooked in copper pots." },
          { name: "Himachali Honey Tea", icon: "Coffee", description: "Hot herbal tea brewed with wild ginger and pure forest honey." }
        ];
        mockData.hidden_gems = [
          { name: "Sajla Waterfall", icon: "Droplets", description: "A peaceful waterfall hidden in cedar forest, featuring a natural stone pool." },
          { name: "Soyal Village", icon: "Home", description: "A tiny wooden village surrounded by apple orchards, untouched by commercial tourism." },
          { name: "Gauri Shankar Temple", icon: "Building", description: "A 12th-century stone temple in Dashal with intricate carvings, completely tourist-free." }
        ];
        mockData.packing = [
          "Warm jacket & fleece layer",
          "Thermal innerwear",
          "Trekking shoes",
          "Waterproof backpack",
          "Cold cream & lip balm",
          "Reusable water bottle"
        ];
      } else if (prompt.toLowerCase().includes('honeymoon') || prompt.toLowerCase().includes('luxury') || prompt.toLowerCase().includes('beach')) {
        mockData.destination = "Kerala Backwaters & Beaches (Demo Mode)";
        mockData.tagline = "Serene palms, luxury houseboats, and sweet spices in God's Own Country";
        mockData.weather = "Warm & breezy (25°C - 30°C)";
        mockData.best_season = "September to March";
        mockData.currency = "Indian Rupee (INR)";
        mockData.language = "Malayalam & English";
        mockData.fun_fact = "Kerala is home to the world's oldest teak plantation and is India's most literate state.";
        mockData.total_budget = "₹85,000";
        mockData.budget = {
          flights: "₹15,000",
          hotels: "₹35,000",
          food: "₹12,000",
          transport: "₹10,000",
          activities: "₹8,000",
          shopping: "₹5,000"
        };
        mockData.itinerary = [
          {
            day: 1,
            title: "Houseboat cruise in Alleppey",
            morning: "Board a luxury wooden houseboat in Alleppey.",
            afternoon: "Glide past palm-fringed canals, enjoying a fresh pearl spot fish lunch on board.",
            evening: "Watch the sunset from the deck, sipping local toddy as the boat anchors."
          },
          {
            day: 2,
            title: "Cliffs of Varkala",
            morning: "Drive down to Varkala and check in to a boutique resort overlooking the cliffs.",
            afternoon: "Indulge in a relaxing 90-minute Ayurvedic full-body oil massage.",
            evening: "Enjoy fresh grilled tiger prawns at cliff-top cafes overlooking the beach."
          },
          {
            day: 3,
            title: "Jungle Safari & Spices",
            morning: "Take a bamboo rafting tour inside Periyar Tiger Reserve in Thekkady.",
            afternoon: "Walk through an organic spice plantation learning about cardamom and pepper.",
            evening: "Watch an authentic Kathakali dance performance at the local theater."
          }
        ];
        mockData.food = [
          { name: "Karimeen Pollichathu", icon: "Fish", description: "Pearl spot fish marinated in spicy paste, wrapped in banana leaf and grilled." },
          { name: "Appam with Stew", icon: "Utensils", description: "Lacy fermented rice pancakes with a rich coconut milk vegetable/meat stew." },
          { name: "Puttu and Kadala", icon: "Utensils", description: "Steamed cylinders of ground rice and coconut served with black chickpea curry." },
          { name: "Payasam", icon: "Coffee", description: "A sweet pudding made of milk, vermicelli or rice, sugar/jaggery, flavored with cardamom." }
        ];
        mockData.hidden_gems = [
          { name: "Kavvayi Island", icon: "Palmtree", description: "An untouched group of islands in North Kerala with massive calm backwater lagoons." },
          { name: "Marari Secret Beach", icon: "Waves", description: "A pristine, quiet white-sand beach far away from commercial tourist crowds." },
          { name: "Athirappilly Falls", icon: "Droplets", description: "India's own Niagara Falls, a massive cascading waterfall in a deep green forest." }
        ];
        mockData.packing = [
          "Light linens & cottons",
          "Sun protection spray",
          "Mosquito patches",
          "Swimwear & flip flops",
          "Binoculars for safari",
          "Elegant dinner outfit"
        ];
      }
      travelPlan = mockData;
    }

    // Attach mock flights matching the destination name
    travelPlan.flights = getMatchingFlights(travelPlan.destination);

    return NextResponse.json(travelPlan);
  } catch (error) {
    console.error('Plan API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
