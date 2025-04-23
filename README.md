# TrailQuest - Adventure Tracking Application

## Development Setup

### Backend (Flask)

1. Install Docker and Docker Compose
2. Navigate to project root
3. Run: `docker-compose up -d`
4. The Flask API will be available at `http://localhost:5000`

### Frontend (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Environment Variables

Add these to your `.env.local`:
```
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5000
```

TrailQuest is a gamified adventure tracking application built with Next.js that helps outdoor enthusiasts log and share their hiking, climbing, kayaking, and other outdoor adventures while earning achievements and rewards.

## Features

- **Adventure Logging**: Track and log various outdoor activities
- **Achievements System**: Earn badges and rewards for completing challenges
- **Recommendation Engine**: Get personalized adventure recommendations
- **Leaderboard**: Compete with friends on adventure stats
- **Side Quests**: Special challenges for activities like rock climbing, kayaking, etc.
- **Profile Tracking**: View your adventure history and stats
- **Premium Features**: Additional perks for premium members

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trailquest.git
cd trailquest
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

## Configuration

Required environment variables (in `.env`):
```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
OPENAI_API_KEY=your_openai_key (for recommendations)
```

## API Endpoints

### Adventure Posts
- `POST /api/adventure-posts` - Create new adventure post
- `GET /api/adventure-posts` - Get adventure posts

### Recommendations
- `GET /api/recommendations` - Get adventure recommendations
- `POST /api/recommendations/interact` - Log recommendation interactions

### Upload
- `POST /api/upload` - Upload media files

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js
- **Storage**: AWS S3
- **AI**: OpenAI (for recommendations)
- **UI Components**: Shadcn/ui

## Project Structure

```
trailquest/
├── app/                  # Next.js app router pages
├── backend/              # Backend services and controllers
├── components/           # React components
├── lib/                  # Shared utilities and services
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── styles/               # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
