# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Architecture Overview

This is a Next.js 15 recipe application using TypeScript, React 19, and Tailwind CSS v4. The app displays a collection of cooking recipes with ingredient scaling functionality.

### Core Structure

- **App Router**: Uses Next.js 13+ app directory structure
- **Data Layer**: Centralized recipe data in `src/data/recipes.ts` with TypeScript interfaces
- **Components**: Shared `RecipePage` component handles all recipe display logic
- **Routing**: Dynamic routes at `/recipes/[recipe-name]` map to recipe keys in the data file

### Key Files

- `src/data/recipes.ts`: Contains all recipe data with `Ingredient` and `RecipeData` interfaces
- `src/components/RecipePage.tsx`: Reusable recipe display component with scaling logic
- `src/app/page.tsx`: Home page with recipe navigation links
- `src/app/recipes/[recipe]/page.tsx`: Individual recipe pages that import RecipePage component

### Recipe Scaling System

The app includes sophisticated ingredient scaling with:
- Unit conversion (g→kg, ml→l when scaled amounts ≥1000)
- Proper formatting with thin non-breaking spaces between numbers and units
- Smart number detection that preserves time-related measurements
- Scale buttons for ½x, 1x, 2x, 3x portions

### Styling

- Uses Tailwind CSS v4 with a serif font family
- Minimalist design with centered layouts
- Responsive breakpoints for mobile/desktop

### Adding New Recipes

1. Add recipe data to the `recipes` object in `src/data/recipes.ts`
2. Create a new page file at `src/app/recipes/[recipe-name]/page.tsx`
3. Import and use the RecipePage component
4. Update the recipes array in `src/app/page.tsx` for navigation