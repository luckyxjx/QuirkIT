# Quirkit

> _"Dumb on the Outside, Useful on the Inside"_ - That's what she said... about this app.

Welcome to Quirkit - the web app equivalent of that drawer filled with random gadgets you never use but somehow can't live without. Built with the finest ingredients: Next.js, TypeScript, and a questionable sense of humor.

**Warning**: This app may cause uncontrollable productivity, spontaneous laughter, and an inexplicable urge to share dad jokes with your coworkers.

## What Does This Thing Actually Do?

### Phase 1: The "I Can't Believe This Works" Edition

- **Excuse Generator** - Because "my dog ate my homework" is so 2005
- **Joke Viewer** - Dad jokes so bad they're good (with emoji reactions for maximum cringe)
- **Quote of the Day** - Daily wisdom that ranges from profound to "did I really just read that?"

### Phase 2: The "Wait, There's More?" Expansion

- **Shower Thoughts** - Those 3 AM revelations, but at reasonable hours
- **Holiday Finder** - Discover it's National Bubble Wrap Appreciation Day (yes, that's real)
- **Drink Recipes** - Because sometimes you need a mocktail to cope with your code

### Phase 3: The "We've Gone Too Far" Advanced Features

- **Productivity Timer** - Pomodoro technique with suggestions like "stare at the ceiling for 5 minutes"
- **Decision Spinner** - For when you can't decide between pizza or... pizza
- **Compliment Machine** - Anonymous nice things because the internet needs more positivity

## Tech Stack (The Serious Stuff)

Built with technologies that are definitely overkill for generating excuses, but hey, we're professionals here:

- **Frontend**: Next.js 15+ (because we like living on the edge)
- **Language**: TypeScript (for when JavaScript just isn't complicated enough)
- **Styling**: Tailwind CSS + shadcn/ui (making things pretty since 2023)
- **Backend**: Next.js API Routes (serverless functions that scale to infinity and beyond)
- **Database**: Vercel KV (Redis, but fancier)
- **Deployment**: Vercel (one-click deploy because we're lazy... efficient)
- **External APIs**: Various APIs that somehow trust us with their data

## Getting Started (The "How Do I Make This Work?" Guide)

### Prerequisites (The Boring But Necessary Stuff)

- Node.js (because we're not animals)
- npm or yarn (pick your poison)
- A sense of humor (mandatory)
- Coffee (optional but recommended)
- A working brain (optional)
- 2–3 brain cells minimum, but not required

### Installation (Copy-Paste Your Way to Success)

1. **Clone this masterpiece:**

```bash
git clone <repository-url>
```

2. **Install the magic dependencies:**

```bash
npm install
# Go grab a coffee, this might take a minute
```

3. **Set up your secret environment variables:**

```bash
touch .env.local
# Copy the structure below into your .env.local file
# Then edit .env.local with your actual API keys
```

4. **Configure your `.env.local` file:**

```env
# Vercel KV Database (for caching jokes because priorities)
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here

# External API Keys (optional, we have fallbacks)
COCKTAIL_API_KEY=your_cocktail_api_key_here
JOKE_API_KEY=your_joke_api_key_here
QUOTE_API_KEY=your_quote_api_key_here
HOLIDAY_API_KEY=your_holiday_api_key_here
```


5. **Fire up the development server:**

```bash
npm run dev
# Watch the magic happen
```

6. **Open your browser and navigate to [http://localhost:3000](http://localhost:3000)**

   _Congratulations! You're now the proud operator of a this thing._

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── excuse/
│   │   ├── joke/
│   │   ├── quote/
│   │   └── ...
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── features/         # Feature-specific components
│   └── common/           # Shared components
├── data/                 # Static fallback data
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Development (For the Brave Souls Who Want to Contribute)

### Adding New Features (The "I Have an Idea" Process)

1. Create an API route in `src/app/api/[feature]/route.ts` (where the magic happens)
2. Build a component in `src/components/features/` (make it pretty)
3. Update types in `src/types/index.ts` (TypeScript demands sacrifice)
4. Add fallback data in `src/data/` (for when the internet fails us)
5. Update constants in `src/utils/constants.ts` (because organization matters)

### Testing (Yes, We Actually Test Things)

```bash
# Run the test suite
npm test

# Watch tests like a hawk
npm run test:watch

# See how much code we're actually testing
npm run test:coverage
```

### Building (Making It Production-Ready)

```bash
# Build for the real world
npm run build

# Pretend you're in production
npm start
```

## Deployment

The application is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Architecture

- **Serverless Functions**: Each API endpoint runs as a Vercel serverless function
- **Caching Strategy**: Redis caching for external API responses with fallback data
- **Error Handling**: Quirky error messages with graceful degradation
- **Mobile-First**: Responsive design with touch-friendly interactions
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

## Contributing

1. Fork the repo
2. Break something
3. Pretend you fixed it
4. Open a PR anyway
