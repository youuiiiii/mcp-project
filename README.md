# SIGAP

SIGAP is a cross-platform Expo app for community incident reporting, disaster
monitoring, verification, moderation, and safety response workflows.

## Tech Stack

- Expo Router and React Native
- TypeScript with strict mode enabled
- Firebase Authentication and Firestore
- React Native Maps
- BMKG earthquake data integration

## Project Structure

```text
app/                 File-based routes and route guards
assets/              App icons, splash assets, and static media
scripts/             Project maintenance scripts
src/components/      Shared app components and UI primitives
src/constants/       Domain constants and app configuration values
src/contexts/        React context providers
src/features/        Feature-owned screens, hooks, components, and utilities
src/services/        External service clients and persistence logic
src/styles/          Shared StyleSheet modules
src/theme/           Design tokens for color, spacing, layout, and typography
src/types/           Shared TypeScript domain types
src/utils/           Shared pure utilities
```

## Available Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run typecheck
```

## Code Standards

- Keep route files in `app/` thin; put business logic in `src/features`.
- Keep feature-specific components, hooks, and utilities inside their feature
  folder.
- Put reusable UI primitives in `src/components/ui`.
- Use `@/` imports for app-level imports from `src`.
- Run `npm run lint` and `npm run typecheck` before handing off changes.
