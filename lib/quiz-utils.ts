export interface ArchetypeResult {
  archetype: string
  count: number
  percentage: number
}

export interface ArchetypeDetails {
  emoji: string
  inAWord: string
  inAnOutfit: string
  colorMood: string
  tagline: string
  signatureQuote: string
  riskType: string
  bornWith: string[]
  signatureMood: string
  inTheWild: string
  vibe: string
}

export function calculateResults(answers: string[], totalQuestions: number): ArchetypeResult[] {
  const archetypeCounts: Record<string, number> = {}

  // Count each archetype
  answers.forEach((archetype) => {
    archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1
  })

  // Use totalQuestions for percentage calculation, not answers.length
  const results = Object.entries(archetypeCounts)
    .map(([archetype, count]) => ({
      archetype,
      count,
      percentage: Math.round((count / totalQuestions) * 100),
    }))
    .sort((a, b) => b.count - a.count)

  return results
}

export function getArchetypeDetails(archetypeName: string): ArchetypeDetails | null {
  const details: Record<string, ArchetypeDetails> = {
    "The Timeless Romantic": {
      emoji: "🪽",
      inAWord: "Devoted",
      inAnOutfit: "A satin dress, a locket, and eyes full of memory",
      colorMood: "Dusty blush, antique gold, faded lilac, moonlight",
      tagline: "Forever isn't long enough",
      signatureQuote: "She collects love letters and vintage dreams",
      riskType: "🕊 Ultra Low Risk – Cries to vintage love songs. Owns multiple lace items.",
      bornWith: [
        "The entire plot of a 2003 love movie inside your soul",
        "A vintage soul and 10 saved love poems",
        "The uncanny ability to remember every anniversary",
      ],
      signatureMood:
        "You hold onto movie stubs. You rewatch Pride & Prejudice like it's church. You whisper to jewelry before you wear it. Your heart is a Pinterest board full of handwritten vows and soft candlelight.",
      inTheWild:
        "You've gotten lost in old photo albums. You name your plants after literary characters. Your friends describe you as 'romantically time-traveling'.",
      vibe: "Victorian ghost with a Spotify Premium account",
    },
    "The Grounded Stylist": {
      emoji: "🪞",
      inAWord: "Balanced",
      inAnOutfit: "Soft trousers, intentional earrings, tote bag with a book inside",
      colorMood: "Oat milk, stone, sage green, café beige",
      tagline: "Tasteful chaos is still chaos",
      signatureQuote: "She makes mindful choices and curates calm",
      riskType: "🌿 Low Risk – Always calm, never boring. Organizes joy in color order.",
      bornWith: [
        "The gift of dressing well without trying",
        "The calm energy of a neutral-toned yoga mat",
        "More aesthetically pleasing notebooks than anyone needs",
      ],
      signatureMood:
        "You love routine, cozy silence, and well-designed mugs. You accessorize like it's a mindfulness exercise. You don't follow trends — you follow balance, and everyone else follows you.",
      inTheWild:
        "You've been mistaken for a gallery curator. Your coffee order is both simple and specific. Your friends ask you to organize their closets.",
      vibe: "Your favorite podcast got turned into a person",
    },
    "The Natural Creative": {
      emoji: "🌿",
      inAWord: "Soulful",
      inAnOutfit: "A flowy cardigan with ink stains and 3 mysterious rings",
      colorMood: "Terracotta, wildflower yellow, fern, bark brown",
      tagline: "Vulnerability is my aesthetic",
      signatureQuote: "She paints with her heart and wears her soul",
      riskType: "🌱 Low-Moderate Risk – 'Accidentally started a side business making ceramic mugs.'",
      bornWith: [
        "Paint-stained hands and moss under your nails",
        "Emotional support plants",
        "A playlist called 'gentle chaos'",
      ],
      signatureMood:
        "You are the human version of golden hour. You romanticize walking barefoot. You dress in layers of emotion and linen. Every item you own has a story. Probably involving a forest.",
      inTheWild:
        "You collect leaves that 'look like feelings.' Your art supplies have overtaken your dining table. Your friends call you for color therapy.",
      vibe: "Cottagecore x Studio Ghibli x your therapist's favorite scarf",
    },
    "The Intentional Dresser": {
      emoji: "📐",
      inAWord: "Curated",
      inAnOutfit: "Architecturally draped shirt, monochrome trousers, clean lines",
      colorMood: "Slate, camel, ivory, espresso",
      tagline: "Intentional isn't boring. It's brutal",
      signatureQuote: "She architects her aesthetic with precision and purpose",
      riskType: "🪙 Moderate Risk – 'Has a spreadsheet for earrings. And feelings.'",
      bornWith: [
        "A minimal wardrobe and maximal standards",
        "'It girl' intuition in a Google Doc",
        "Jewelry that could double as sculpture",
      ],
      signatureMood:
        "Your vibe is calm power. You do 'quiet luxury' but with actual personality. You know exactly which necklace balances that neckline — and which opinion to keep to yourself… until it matters.",
      inTheWild:
        "You've turned down compliments that weren't specific enough. Your closet is color-coded. Your friends think you're mysterious but you're just organized.",
      vibe: "Clean girl meets brutalist museum curator",
    },
    "The Sentimental Dreamer": {
      emoji: "🌙",
      inAWord: "Melancholic (in a poetic way)",
      inAnOutfit: "A velvet slip, layered necklaces, and eyes that say 'I've felt things'",
      colorMood: "Midnight blue, violet haze, candle gold, faded mauve",
      tagline: "Reality was never enough for me",
      signatureQuote: "She dreams in stardust and feels in poetry",
      riskType: "🌀 Moderate Risk – 'Probably crying over a moth and looks incredible doing it.'",
      bornWith: [
        "Moonlight in your bloodstream",
        "A playlist for every heartbreak (including ones that haven't happened)",
        "Rings you twirl while staring out the window",
      ],
      signatureMood:
        "You dream in soft-focus. You feel with your whole soul. You once bought a ring just because it 'felt like a memory.' Your phone background is probably a galaxy or a blurry flower.",
      inTheWild:
        "You've written poetry about your jewelry. Your camera roll is full of blurry lights. Your friends worry about you but in a romantic way.",
      vibe: "Lana Del Rey lyrics dressed in celestial dust",
    },
    "The Playful Explorer": {
      emoji: "🎨",
      inAWord: "Kaleidoscopic",
      inAnOutfit: "Mixed prints, oversized earrings, shoes that make you grin",
      colorMood: "Watermelon pink, seafoam green, highlighter yellow, tangerine",
      tagline: "Chaos, but curated",
      signatureQuote: "She collects joy and wears it like confetti",
      riskType:
        "✨ Moderate-High Risk – 'May cause spontaneous trends, accidental glitter storms, and unexplained joy.'",
      bornWith: [
        "Rainbow DNA",
        "A passport full of stickers and good decisions",
        "Three unfinished hobbies and five signature catchphrases",
      ],
      signatureMood:
        "Your brain moves faster than your outfit changes — and that's saying something. You layer necklaces like a dragon hoarding fun. You own sunglasses for moods, not sun. You say 'YOLO' unironically and with purpose.",
      inTheWild:
        "You've started a trend by accident. Your workspace looks like a mood board exploded. Your friends never know what version of you they're getting.",
      vibe: "Pinterest board meets glitter explosion meets emotional support confetti",
    },
    "The Confident Maximalist": {
      emoji: "💋",
      inAWord: "Dazzling",
      inAnOutfit: "The loudest gold chain + that lipstick shade that starts revolutions",
      colorMood: "Fuchsia flame, molten gold, black lacquer, disco silver",
      tagline: "I'm not being extra. I'm being accurate",
      signatureQuote: "She doesn't enter rooms, she makes entrances",
      riskType: "💎 High Risk – 'Glitter is your coping mechanism. And your strategy.'",
      bornWith: [
        "Main character syndrome (diagnosed with pride)",
        "A magnet for the spotlight",
        "Enough jewelry to blind a humble minimalist",
      ],
      signatureMood:
        "You open your closet and it says 'Let's give them a show.' You walk into a room and the air gets thick with admiration, envy, or curiosity — sometimes all three. You believe in overdressing for errands and emotionally bonding with your mirror. Your rings have names. Your perfume has a backstory.",
      inTheWild:
        "You've been asked to tone it down (you declined). Your jewelry box needs its own room. Your friends use you as their personal north star.",
      vibe: "Beyoncé's stylist + Rihanna's boldness + a magpie's treasure trove",
    },
    "The Free Spirit": {
      emoji: "🔥",
      inAWord: "Uncontainable",
      inAnOutfit: "Flowing maxi, barefoot, layered beads from five countries",
      colorMood: "Sunset orange, desert rose, seafoam, burnt amber",
      tagline: "If I can't dance in it, I don't want it",
      signatureQuote: "She follows the wind and wears her wanderlust",
      riskType: "🔥 High Risk – 'Lost in the wild. Found in five different people's camera rolls.'",
      bornWith: [
        "Wind in your lungs",
        "A heart that beats in wanderlust",
        "37 notebooks, 6 journals, and no return ticket",
      ],
      signatureMood:
        "Your soul is part sunbeam, part chaos. You treat routine like a polite suggestion. You once bought a necklace from a stranger on a beach and now it's your favorite. You believe the best kind of sparkle is the kind you find by accident.",
      inTheWild:
        "You've gotten lost (on purpose) in a foreign city. You wear mismatched earrings and call it artistic tension. Your friends describe you as 'untameable... in a good way.'",
      vibe: "Wanderlust meets wearable soul — barefoot but fabulous",
    },
    "The Magnetic Minimalist": {
      emoji: "🖤",
      inAWord: "Precision",
      inAnOutfit: "Tailored black coat, slicked bun, one ring that says everything",
      colorMood: "Matte black, ash grey, chrome, bone white",
      tagline: "I don't dress to impress. I dress to dominate — softly",
      signatureQuote: "She speaks in silence and commands with subtlety",
      riskType: "🧊 Ultra High Risk – 'Says one thing. Changes the room.'",
      bornWith: [
        "A steely stare and even steelier standards",
        "A wardrobe that only whispers but somehow screams",
        "Enough black clothing to host your own avant-garde cult",
      ],
      signatureMood:
        "You're the human equivalent of a perfectly structured sentence. People call you intimidating, but you're just focused. You edit. You curate. You wear simplicity like armor — and everyone notices.",
      inTheWild:
        "You've said 'I'm not really into jewelry' — while wearing the most expensive-looking chain in the room. You wear silence like a crown. You were once mistaken for a designer in a café. You didn't correct them.",
      vibe: "Scandinavian assassin in a Céline campaign",
    },
    "The Visionary Dresser": {
      emoji: "🧬",
      inAWord: "Transcendent",
      inAnOutfit: "A sculptural cape over a mesh turtleneck with LED cuffs",
      colorMood: "Holographic lilac, cyber lime, chrome melt, deep ink",
      tagline: "I don't fit the mold. I melt it",
      signatureQuote: "She designs tomorrow and wears the future",
      riskType: "🚀 Ultra High Risk – 'Not for mass consumption. Or mortal timelines.'",
      bornWith: [
        "Alien DNA",
        "A sixth sense for aesthetic revolutions",
        "An inner moodboard downloaded from the cosmos",
      ],
      signatureMood:
        "Your closet looks like a concept art folder. You don't just wear fashion — you perform it. You once described your earrings as 'post-modernism's rebuttal to tradition.' Your friends never ask, 'Why that outfit?' — they ask, 'What era are we in today?'",
      inTheWild:
        "You've been photographed by street style blogs who couldn't categorize you. Your outfits have their own Instagram archive. Your friends have stopped asking where you got things because they know it's either from the future or your dreams.",
      vibe: "A time-traveling fashion oracle with feelings",
    },
  }

  return details[archetypeName] || null
}
