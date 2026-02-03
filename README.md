# ClickUp Task Analytics Dashboard

A modern, minimal React + TypeScript + Vite application for analyzing ClickUp tasks with beautiful charts and metrics.

## Features

- 🔍 **Task Search**: Enter any ClickUp task ID to fetch and analyze task data
- 📊 **Visual Analytics**: 
  - Pie chart for task status distribution
  - Bar chart for priority levels
  - Bar chart for assignee workload
- 📈 **Key Metrics**: View time estimates, time spent, assignees, and more
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- ⚡ **Fast**: Powered by Vite for instant dev server and optimized builds
- 🎯 **TypeScript**: Full type safety for API responses and components

## Prerequisites

- Node.js 16+ 
- npm or yarn
- ClickUp API key ([Get one here](https://app.clickup.com/settings/apps))

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## Usage

1. **Get Your ClickUp API Key**:
   - Go to ClickUp Settings → Apps
   - Generate a new API token
   - Copy the token (starts with `pk_`)

2. **Find a Task ID**:
   - Open any task in ClickUp
   - The task ID is in the URL (e.g., `86a304h8q`)

3. **Analyze Your Task**:
   - Enter your API key
   - Enter the task ID
   - Click "Analyze Task"
   - View comprehensive analytics and charts

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Dashboard.tsx   # Main dashboard with charts
│   ├── TaskInputScreen.tsx
│   └── StatCard.tsx    # Reusable stat card component
├── services/           # API services
│   └── clickup.service.ts
├── types/              # TypeScript interfaces
│   └── clickup.ts
├── lib/                # Utility functions
│   └── utils.ts
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Technologies Used

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: High-quality React components
- **Recharts**: Charting library
- **Axios**: HTTP client
- **Lucide React**: Icon library

## API Integration

The app uses the ClickUp API v2. Key endpoints:

- `GET /api/v2/task/{task_id}`: Fetch task details

All API calls are handled in `src/services/clickup.service.ts` with proper error handling and data transformation.

## Future Enhancements

- Support for multiple task analysis
- Team-level analytics
- Time tracking visualizations
- Export reports to PDF/CSV
- Dark mode toggle
- Task filtering and search
- Historical data comparison

## License

MIT

## Author

Built with ❤️ by a senior frontend engineer

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
