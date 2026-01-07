# OTB Feed 2

A modern web application for tracking chess tournament performances and rating changes using the US Chess Ratings API.

## Features

- **Player Management**: Add and remove chess players by their US Chess ID
- **Tournament Tracking**: View recent tournament performances with detailed results
- **Rating Changes**: See rating gains/losses with visual indicators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Development Mode**: Use local JSON data for offline development and testing
- **Error Handling**: User-friendly error messages for invalid player IDs or API failures

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 + DaisyUI components
- **API**: Axios for HTTP requests to US Chess API
- **State Management**: React useReducer for complex state
- **Data Persistence**: Browser localStorage for player lists

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/danbockapps/otb-feed2.git
cd otb-feed2
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Mode

To use local JSON data instead of the live API (useful for development):

1. Create a `.env.local` file in the root directory
2. Add: `USE_DEV_DATA=true`

This will load sample data from `app/lib/sampleData/` instead of making API calls.

## Project Structure

```
app/
├── components/           # React components
│   ├── AddPlayerDialog.tsx
│   ├── EventDisplay.tsx
│   ├── PlayerList.tsx
│   └── Toast.tsx
├── lib/
│   ├── getPlayer.ts      # Server action for data fetching
│   ├── manageLocalStorage.ts
│   └── sampleData/       # Local JSON data for dev mode
├── types/                # TypeScript type definitions
└── page.tsx              # Main application page
```

## API Usage

The app fetches data from the US Chess Ratings API using Next.js server actions:

- Player information: `https://ratings-api.uschess.org/api/v1/members/{id}`
- Tournament sections: `https://ratings-api.uschess.org/api/v1/members/{id}/sections`

Server actions run on the server-side, avoiding CORS issues.

## Building for Production

```bash
yarn build
yarn start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `yarn lint`
5. Submit a pull request

## License

This project is private and proprietary.
