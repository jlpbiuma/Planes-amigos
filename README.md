# Planes Amigos v2 🛩️

A modern, mobile-first social hangout application built with Next.js, Supabase, and Tailwind CSS. Connect with friends and organize hangouts with ease!

## Features ✨

- **User Authentication**: Secure registration and login with encrypted passwords
- **Interactive Calendar**: Beautiful mobile-first calendar view with event indicators
- **Event Management**: Create and join events with just a title and date
- **Real-time Participant Tracking**: See who's joined each event with participant counts
- **Color-coded Events**: Automatic color assignment for easy visual distinction
- **Invitation System**: Share events via URL with auto-authentication flow
- **Responsive Design**: Optimized for mobile devices with clean, modern UI
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack 🛠️

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Row-level Security)
- **Authentication**: Custom implementation with bcrypt password hashing
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Setup Instructions 🚀

### Prerequisites

- Node.js 18.16.1 or higher
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd planes-amigos-v2
npm install
```

### 2. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is ready, go to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the SQL Editor
4. Run the SQL to create your database tables and policies

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Replace with your actual Supabase project details
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To find these values:
- Go to your Supabase project dashboard
- Navigate to Settings > API
- Copy the "Project URL" and "anon public" key

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage 📱

### Getting Started

1. **Register**: Create a new account with just a name and password
2. **Login**: Sign in to access your personalized calendar
3. **Create Events**: Click on any calendar date to create a new hangout
4. **Join Events**: Click on event indicators to see details and join
5. **Share**: Use the share button to send invitation links to friends
6. **Track**: Switch to "My Events" tab to see all events you've joined

### Event Colors

Events are automatically assigned colors from a predefined palette:
- Blue, Green, Purple, Orange, Pink, Cyan, Red, Yellow

### Invitation System

When you share an event:
- Users without accounts are prompted to sign up
- Logged-in users can join immediately
- Already-joined users are redirected to the main app
- Automatic redirection after successful joining

## Database Schema 📊

### Tables

1. **users**
   - `id` (UUID, Primary Key)
   - `name` (Text, Unique)
   - `password_hash` (Text)
   - `created_at` (Timestamp)

2. **events**
   - `id` (UUID, Primary Key)
   - `title` (Text)
   - `creator_id` (UUID, Foreign Key)
   - `date` (Date)
   - `color` (Text)
   - `created_at` (Timestamp)

3. **event_participants**
   - `id` (UUID, Primary Key)
   - `event_id` (UUID, Foreign Key)
   - `user_id` (UUID, Foreign Key)
   - `joined_at` (Timestamp)
   - Unique constraint on (event_id, user_id)

## Security Features 🔒

- **Password Encryption**: All passwords are hashed with bcrypt
- **Row-Level Security**: Supabase RLS policies protect data access
- **Input Validation**: Client and server-side validation
- **Secure Authentication**: JWT-based session management through localStorage

## Mobile-First Design 📱

The application is designed with mobile users in mind:
- Touch-friendly interface elements
- Responsive calendar grid
- Optimized for small screens
- Fast loading and smooth animations
- PWA-ready architecture

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Built with ❤️ for connecting friends and making hangouts happen!
