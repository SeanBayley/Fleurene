# Project File Map - FJ Website

## 📁 Project Structure Overview

This document provides a complete map of all files and folders in the FJ project workspace. This will serve as a reference guide for code changes and navigation.

## 🗂️ Root Directory Files
```
├── .gitignore (313B, 27 lines)
├── components.json (443B, 21 lines)
├── next.config.mjs (228B, 15 lines)
├── package.json (2.2KB, 74 lines)
├── pnpm-lock.yaml (92B, 5 lines)
├── postcss.config.mjs (135B, 9 lines)
├── tailwind.config.ts (3.5KB, 121 lines)
└── tsconfig.json (595B, 28 lines)
```

## 📱 App Directory (`/app`)
**Main application files for Next.js app router**
```
app/
├── globals.css (2.2KB, 98 lines) - Global styles
├── layout.tsx (918B, 35 lines) - Root layout component
└── page.tsx (4.5KB, 110 lines) - Home page component
```

## 🧩 Components Directory (`/components`)
**React components organized by functionality**

### Main Components
```
components/
├── auth-context.tsx (4.7KB, 180 lines) - Authentication context provider
├── auth-modal.tsx (6.3KB, 188 lines) - Authentication modal
├── community-journal-section.tsx (16KB, 420 lines) - Community journal feature
├── connection-test.tsx (1.6KB, 64 lines) - Database connection testing
├── custom-cursor.tsx (1.2KB, 50 lines) - Custom cursor implementation
├── disclaimer-modal.tsx (13KB, 287 lines) - Legal disclaimer modal
├── discover-your-magic.tsx (101KB, 2367 lines) - Main magic discovery feature
├── featured-collections.tsx (4.1KB, 100 lines) - Product collections display
├── floating-elements.tsx (3.3KB, 115 lines) - Animated floating elements
├── flower-basket.tsx (14KB, 333 lines) - Flower basket component
├── flower-button.tsx (977B, 37 lines) - Interactive flower button
├── flower-explosion-context.tsx (2.9KB, 104 lines) - Flower animation context
├── flower-explosion.tsx (3.4KB, 131 lines) - Flower explosion animation
├── footer.tsx (1.8KB, 52 lines) - Site footer
├── gift-guide-modal.tsx (36KB, 820 lines) - Gift guide modal
├── gift-guide-trigger.tsx (4.6KB, 138 lines) - Gift guide trigger button
├── global-flower-explosion.tsx (2.6KB, 96 lines) - Global flower animations
├── hero-section.tsx (18KB, 474 lines) - Main hero section
├── journal-modal.tsx (52KB, 1144 lines) - Journaling modal interface
├── journal-section.tsx (16KB, 434 lines) - Journal section component
├── magic-quote.tsx (1.9KB, 49 lines) - Inspirational quotes display
├── mood-mirror-trigger.tsx (3.5KB, 114 lines) - Mood mirror trigger
├── mood-mirror.tsx (17KB, 387 lines) - Mood reflection feature
├── navigation.tsx (7.9KB, 194 lines) - Main navigation component
├── newsletter.tsx (4.7KB, 125 lines) - Newsletter signup
├── quiz-modal.tsx (11KB, 296 lines) - Quiz modal interface
├── quiz-results.tsx (8.4KB, 246 lines) - Quiz results display
├── quiz-section.tsx (5.4KB, 115 lines) - Quiz section component
├── simple-auth.tsx (1.2KB, 49 lines) - Simple authentication
├── story-modal.tsx (11KB, 253 lines) - Story viewing modal
├── story-section.tsx (17KB, 421 lines) - Story section component
├── terms-modal.tsx (11KB, 251 lines) - Terms and conditions modal
├── theme-provider.tsx (292B, 12 lines) - Theme context provider
├── user-profile-modal.tsx (2.8KB, 85 lines) - User profile modal
├── welcome-section.tsx (39KB, 903 lines) - Welcome section component
├── whisper-context.tsx (1.4KB, 52 lines) - Whisper context provider
├── whisper-icon.tsx (6.3KB, 218 lines) - Whisper icon component
└── whisper-message.tsx (2.9KB, 105 lines) - Whisper message component
```

### UI Components (`/components/ui`)
**Reusable UI components (shadcn/ui based)**
```
components/ui/
├── accordion.tsx (1.9KB, 59 lines)
├── alert-dialog.tsx (4.3KB, 142 lines)
├── alert.tsx (1.5KB, 60 lines)
├── aspect-ratio.tsx (154B, 8 lines)
├── avatar.tsx (1.4KB, 51 lines)
├── badge.tsx (1.1KB, 37 lines)
├── breadcrumb.tsx (2.6KB, 116 lines)
├── button.tsx (1.9KB, 57 lines)
├── calendar.tsx (2.5KB, 67 lines)
├── card.tsx (1.8KB, 80 lines)
├── carousel.tsx (6.1KB, 263 lines)
├── chart.tsx (10KB, 366 lines)
├── checkbox.tsx (1.0KB, 31 lines)
├── collapsible.tsx (329B, 12 lines)
├── command.tsx (4.8KB, 154 lines)
├── context-menu.tsx (7.1KB, 201 lines)
├── dialog.tsx (3.8KB, 123 lines)
├── drawer.tsx (3.0KB, 119 lines)
├── dropdown-menu.tsx (7.3KB, 201 lines)
├── form.tsx (4.0KB, 179 lines)
├── hover-card.tsx (1.2KB, 30 lines)
├── input-otp.tsx (2.1KB, 72 lines)
├── input.tsx (791B, 23 lines)
├── label.tsx (724B, 27 lines)
├── menubar.tsx (7.8KB, 237 lines)
├── navigation-menu.tsx (4.9KB, 129 lines)
├── pagination.tsx (2.7KB, 118 lines)
├── popover.tsx (1.2KB, 32 lines)
├── progress.tsx (791B, 29 lines)
├── radio-group.tsx (1.4KB, 45 lines)
├── resizable.tsx (1.7KB, 46 lines)
├── scroll-area.tsx (1.6KB, 49 lines)
├── select.tsx (5.5KB, 161 lines)
├── separator.tsx (770B, 32 lines)
├── sheet.tsx (4.2KB, 141 lines)
├── sidebar.tsx (23KB, 764 lines)
├── skeleton.tsx (261B, 16 lines)
├── slider.tsx (1.1KB, 29 lines)
├── sonner.tsx (894B, 32 lines)
├── switch.tsx (1.1KB, 30 lines)
├── table.tsx (2.7KB, 118 lines)
├── tabs.tsx (1.9KB, 56 lines)
├── textarea.tsx (689B, 23 lines)
├── toast.tsx (4.7KB, 130 lines)
├── toaster.tsx (786B, 36 lines)
├── toggle-group.tsx (1.7KB, 62 lines)
├── toggle.tsx (1.5KB, 46 lines)
├── tooltip.tsx (1.1KB, 31 lines)
├── use-mobile.tsx (565B, 20 lines)
└── use-toast.ts (3.9KB, 195 lines)
```

## 📚 Library Directory (`/lib`)
**Utility functions, data, and configuration**
```
lib/
├── local-storage.ts (619B, 17 lines) - Local storage utilities
├── mood-data.ts (7.4KB, 209 lines) - Mood tracking data
├── quiz-data.ts (55KB, 1895 lines) - Quiz questions and logic
├── quiz-utils.ts (12KB, 238 lines) - Quiz utility functions
├── supabase.ts (1.0KB, 39 lines) - Supabase client configuration
├── utils.ts (166B, 7 lines) - General utility functions
├── vercel-kv.ts (469B, 14 lines) - Vercel KV database utilities
└── whisper-quotes.ts (17KB, 243 lines) - Inspirational quotes data
```

## 🎣 Hooks Directory (`/hooks`)
**Custom React hooks**
```
hooks/
├── use-mobile.tsx (565B, 20 lines) - Mobile detection hook
└── use-toast.ts (3.9KB, 195 lines) - Toast notification hook
```

## 🎨 Styles Directory (`/styles`)
**CSS and styling files**
```
styles/
└── globals.css (2.4KB, 95 lines) - Additional global styles
```

## 🌐 Public Directory (`/public`)
**Static assets and images**
```
public/
├── placeholder-logo.png (568B, 4 lines)
├── placeholder-logo.svg (3.1KB, 1 lines)
├── placeholder-user.jpg (1.6KB, 10 lines)
├── placeholder.jpg (1.0KB, 8 lines)
├── placeholder.svg (3.2KB, 1 lines)
└── images/
    └── hero-flowers.jpg (1.5MB) - Main hero section background image
```

## 🗃️ Database Scripts (`/sql-commands`)
**SQL scripts for database setup and migrations**
```
sql-commands/
├── 001-create-user-tables-fixed.sql (1.4KB, 37 lines)
├── 001-create-user-tables.sql (2.6KB, 68 lines)
├── 001-setup-complete-database.sql (3.8KB, 112 lines)
├── 002-create-functions.sql (1.1KB, 37 lines)
├── 002-create-policies-fixed.sql (1.0KB, 27 lines)
└── 003-create-functions-fixed.sql (588B, 18 lines)
```

## ⚙️ Scripts Directory (`/scripts`)
**Database setup scripts**
```
scripts/
├── 01-create-user-profiles.sql (754B, 23 lines)
├── 02-create-quiz-results.sql (726B, 21 lines)
├── 03-create-user-preferences.sql (934B, 24 lines)
└── 04-create-functions.sql (701B, 25 lines)
```

## 🏗️ Project Type
This appears to be a **Next.js 14+ application** with:
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: shadcn/ui component library
- **Database**: Supabase (PostgreSQL)
- **Caching**: Vercel KV
- **Package Manager**: pnpm
- **Language**: TypeScript

## 📝 Key Features Based on Files
1. **User Authentication** - Multiple auth components and modals
2. **Journaling System** - Community and personal journaling features
3. **Mood Tracking** - Mood mirror and tracking functionality
4. **Quiz System** - Comprehensive quiz with results and data
5. **Gift Guide** - Product recommendation system
6. **Stories/Content** - Story viewing and management
7. **Interactive Elements** - Flower animations, custom cursor, floating elements
8. **Whisper System** - Quote/message system with context
9. **Newsletter** - Email subscription functionality
10. **User Profiles** - Profile management and preferences

---
*Generated on: $(date)*
*Total Files Cataloged: 100+ files across 8 main directories* 