# Tiny Town Builder

## Overview

Tiny Town Builder is a single-player idle/incremental mobile game built with React Native and Expo. Players build and upgrade buildings across different districts to generate passive income. The game features a cozy aesthetic with district-based progression, offline earnings, and ad-based boost mechanics. The application uses a local-first architecture with no backend authentication, storing all game state locally on the device.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation with bottom tab navigation (3 tabs: Town, Shop, Stats) and modal stack for overlays
- **State Management**: React Context API (`GameContext`) for global game state management
- **Data Fetching**: TanStack Query (React Query) configured but minimal server interaction
- **UI Components**: Custom themed components with light/dark mode support
- **Animations**: React Native Reanimated for smooth animations and gestures
- **Styling**: StyleSheet API with centralized theme constants (colors, spacing, typography)

**Key Design Decisions**:
- **Local-first architecture**: All game state stored in AsyncStorage, no authentication required
- **Context-based state**: Single `GameContext` manages entire game state including coins, buildings, districts, and boosts
- **Component composition**: Reusable components (ThemedText, ThemedView, Card, Button) with theme-aware styling
- **Platform-specific handling**: Conditional rendering for iOS/Android/Web (keyboard handling, blur effects)

### Data Storage

**Primary Storage**: AsyncStorage (React Native)
- **Key**: `tiny_town_game_state`
- **Format**: JSON serialization of `GameState` object
- **Schema**: Includes coins, buildings array, districts array, boost states, and timestamps

**Game State Structure**:
```typescript
{
  coins: number,
  totalEarned: number,
  incomePerSecond: number,
  currentDistrict: DistrictId,
  districts: District[],
  buildings: Building[],
  lastPlayed: number,
  adBoostActive: boolean,
  adBoostEndTime: number,
  tapCount: number
}
```

**Offline Earnings**: Calculates passive income based on `lastPlayed` timestamp (capped at 24 hours)

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- **Purpose**: Minimal backend scaffolding for potential future features
- **Current State**: Template-only with no active game logic routes
- **Proxy Setup**: HTTP proxy middleware for Replit deployment

**Storage Interface**: `IStorage` abstraction with in-memory implementation (`MemStorage`)
- **Design Pattern**: Repository pattern for potential database migration
- **Current Implementation**: Map-based user storage (unused in current game flow)

**Database Schema** (Drizzle ORM - configured but not actively used):
- **Dialect**: PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Tables**: `users` table with id, username, password fields
- **Note**: Database setup exists but game uses client-side storage only

### Architectural Patterns

**Module Resolution**: Babel module resolver with path aliases
- `@/*` → `./client/*`
- `@shared/*` → `./shared/*`

**Type Safety**: Shared TypeScript types between client and server via `shared/` directory

**Theme System**:
- Centralized color/spacing/typography constants in `client/constants/theme.ts`
- Hook-based theme access (`useTheme`, `useColorScheme`)
- Automatic light/dark mode support via system preferences

**Navigation Structure**:
- Root stack contains main tab navigator
- Modal presentation for district selection and building details
- Bottom tabs: Town (gameplay), Shop (purchases), Stats (progress/boosts)

**Game Loop**:
- Passive income calculated via `setInterval` (every second)
- Auto-save triggered 500ms after state changes via `useRef` timeout
- Offline earnings calculated on app launch based on delta between `lastPlayed` and current time

## External Dependencies

### Mobile Framework
- **Expo SDK 54**: Core platform with managed workflow
- **React Native 0.81.5**: Mobile runtime
- **React Navigation 7**: Tab and stack navigation with native animations

### UI & Animations
- **React Native Reanimated 4**: Performant animations via worklets
- **React Native Gesture Handler**: Touch gesture recognition
- **Expo Blur**: Native blur effects for iOS
- **Expo Haptics**: Tactile feedback on interactions
- **Expo Vector Icons**: Feather icon set for UI elements

### State & Data
- **TanStack Query 5**: Async state management (configured for future API calls)
- **AsyncStorage**: Client-side persistence layer
- **Drizzle ORM**: SQL query builder (configured for PostgreSQL but unused)
- **Zod**: Runtime schema validation

### Fonts
- **FredokaOne**: Display font for titles
- **Nunito**: Body text font (Regular, Bold, SemiBold weights)

### Development Tools
- **TypeScript**: Type safety across client/server
- **ESLint**: Code linting with Expo configuration
- **Prettier**: Code formatting
- **tsx**: TypeScript execution for server

### Server Runtime
- **Express 4**: HTTP server framework
- **PostgreSQL (pg)**: Database driver (configured but not connected)
- **WebSocket (ws)**: Real-time communication support (configured but unused)

### Build & Deployment
- **Replit Environment**: Uses `REPLIT_DEV_DOMAIN` and `REPLIT_INTERNAL_APP_DOMAIN` for deployment URLs
- **Custom Build Scripts**: Static export generation for production deployment
- **ESBuild**: Server bundling for production