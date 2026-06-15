import { NextResponse } from 'next/server';

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
    { name: "Goan Fish Curry thali", emoji: "🍛", description: "Fresh catch cooked in rich coconut gravy with local spices, served with red rice." },
    { name: "Bebinca", emoji: "🍰", description: "A multi-layered traditional Goan dessert made of coconut milk, ghee, and egg yolk." },
    { name: "Pork Vindaloo", emoji: "🍲", description: "A spicy, tangy dish slow-cooked with vinegar, garlic, and hot red chilies." },
    { name: "Feni cocktail", emoji: "🍹", description: "Local liquor distilled from cashew apple or coconut, mixed with lime and soda." }
  ],
  hidden_gems: [
    { name: "Cola Beach Lagoon", emoji: "🌴", description: "A secluded beach where a sweet-water lagoon meets the sea, perfect for quiet kayaking." },
    { name: "Devil's Canyon", emoji: "峡", description: "A beautiful, eerie river gorge carved in rock, located inside the Bhagwan Mahavir Sanctuary." },
    { name: "Chorla Ghat", emoji: "⛰️", description: "A misty mountain pass bordering Goa and Karnataka with stunning valley views." }
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

    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    // 1. Google Gemini API (Recommended)
    if (geminiKey) {
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
                emoji: { type: "STRING" },
                description: { type: "STRING" }
              },
              required: ["name", "emoji", "description"]
            }
          },
          hidden_gems: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                emoji: { type: "STRING" },
                tip: { type: "STRING" }
              },
              required: ["name", "emoji", "tip"]
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

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are an expert travel planner. Plan a detailed, highly curated trip based on the user's request: "${prompt}". Provide concrete local choices and tips. Return 3-5 itinerary days, 4 food options, 3 hidden gems, 6-8 packing items, and 4 tips.`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      };

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        throw new Error(`Gemini API failed with status ${response.status}`);
      }

      const resData = await response.json();
      const contentText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!contentText) {
        throw new Error('Gemini API returned an empty response');
      }

      const travelPlan = JSON.parse(contentText);
      return NextResponse.json(travelPlan);
    }

    // 2. Anthropic Claude API (Fallback)
    if (anthropicKey) {
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
{"destination":"string","country":"string","tagline":"string","weather":"string","best_season":"string","currency":"string","language":"string","fun_fact":"string","total_budget":"string","budget":{"flights":"string","hotels":"string","food":"string","transport":"string","activities":"string","shopping":"string"},"itinerary":[{"day":1,"title":"string","morning":"string","afternoon":"string","evening":"string"}],"food":[{"name":"string","emoji":"string","description":"string"}],"hidden_gems":[{"name":"string","emoji":"string","tip":"string"}],"packing":["item1","item2"],"tips":["tip1","tip2"]}
Return 3-5 itinerary days, 4 foods, 3 hidden gems, 6-8 packing items, 4 tips. Keep all strings concise.`,
          messages: [{ role: 'user', content: `Plan a detailed trip based on: ${prompt}` }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Anthropic API Error:', errorText);
        throw new Error(`Anthropic API failed with status ${response.status}`);
      }

      const resData = await response.json();
      const rawText = resData.content?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json|```/g, '').trim();
      const travelPlan = JSON.parse(cleanJson);
      return NextResponse.json(travelPlan);
    }

    // 3. Mock Fallback (Demo Mode if keys are not set)
    // We add a tiny delay to simulate network latency and show loading bar
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Customize destination name based on user prompt for a cooler demo experience
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
        { name: "Siddu", emoji: "🥟", description: "Local wheat flour bread stuffed with poppy seeds and walnuts, served with ghee." },
        { name: "Trout Fish", emoji: "🐟", description: "Fresh wood-fried mountain trout cooked with local aromatic herbs." },
        { name: "Dham", emoji: "🍲", description: "Traditional festive meal consisting of rice, pulses, and curds, cooked in copper pots." },
        { name: "Himachali Honey Tea", emoji: "🍵", description: "Hot herbal tea brewed with wild ginger and pure forest honey." }
      ];
      mockData.hidden_gems = [
        { name: "Sajla Waterfall", emoji: "💧", description: "A peaceful waterfall hidden in a cedar forest, featuring a natural stone pool." },
        { name: "Soyal Village", emoji: "🏡", description: "A tiny wooden village surrounded by apple orchards, untouched by commercial tourism." },
        { name: "Gauri Shankar Temple", emoji: "🛕", description: "A 12th-century stone temple in Dashal with intricate carvings, completely tourist-free." }
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
      // Keep Goa or adapt slightly
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
          morning: "Board a luxury wooden Kettuvallam (houseboat) in Alleppey.",
          afternoon: "Glide past palm-fringed canals, enjoying a fresh pearl spot fish lunch on board.",
          evening: "Watch the sunset from the deck, sipping local toddy as the boat anchors."
        },
        {
          day: 2,
          title: "Cliffs of Varkala",
          morning: "Drive down to Varkala and check in to a boutique resort overlooking the cliffs.",
          afternoon: "Indulge in a relaxing 90-minute Ayurvedic full-body oil massage (Abhyanga).",
          evening: "Enjoy fresh grilled tiger prawns at cliff-top cafes overlooking the beach."
        },
        {
          day: 3,
          title: "Jungle Safari & Spices",
          morning: "Take a bamboo rafting tour inside Periyar Tiger Reserve in Thekkady.",
          afternoon: "Walk through a organic spice plantation learning about cardamom and pepper.",
          evening: "Watch an authentic Kathakali dance performance at the local theater."
        }
      ];
      mockData.food = [
        { name: "Karimeen Pollichathu", emoji: "🐟", description: "Pearl spot fish marinated in spicy paste, wrapped in banana leaf and grilled." },
        { name: "Appam with Stew", emoji: "🥞", description: "Lacy fermented rice pancakes with a rich coconut milk vegetable/meat stew." },
        { name: "Puttu and Kadala", emoji: "🍛", description: "Steamed cylinders of ground rice and coconut served with spicy black chickpea curry." },
        { name: "Payasam", emoji: "🥣", description: "A sweet pudding made of milk, vermicelli or rice, sugar/jaggery, flavored with cardamom." }
      ];
      mockData.hidden_gems = [
        { name: "Kavvayi Island", emoji: "🏝️", description: "An untouched group of islands in North Kerala with massive calm backwater lagoons." },
        { name: "Marari Secret Beach", emoji: "🌊", description: "A pristine, quiet white-sand beach far away from commercial tourist crowds." },
        { name: "Athirappilly Falls", emoji: "🌊", description: "India's own Niagara Falls, a massive cascading waterfall in a deep green forest." }
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

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Plan API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
