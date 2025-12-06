# Tiny Town Builder - Design Guidelines

## Architecture Decisions

### Authentication
**No authentication required** - This is a single-player idle game with local-only data storage. However, include a minimal **Settings screen** accessible from the main interface with:
- Player avatar selection (generate 3-4 cozy illustrated avatars: friendly mayor character variations)
- Player town name (editable text field)
- Sound/music toggles
- Notification preferences
- Credits/about section

### Navigation
**Tab Navigation** with 3 primary tabs positioned at bottom:
1. **Town** (Home/Build) - Main gameplay screen with district view
2. **Shop** (Center tab, emphasized) - Building purchase/upgrade interface
3. **Stats** - Progress tracking, achievements, and settings

Modal overlays for:
- District unlock confirmation
- Ad reward dialogs
- In-app purchase flows
- Building detail/upgrade screens

### Screen Specifications

#### 1. Town Screen (Main Gameplay)
- **Purpose**: Primary interaction - tap Community Chest, view buildings, monitor passive income
- **Header**: 
  - Transparent gradient overlay (cornsilk to transparent)
  - Left: Current district name with small chevron (tap to open district selector)
  - Right: Settings icon
  - Center: Coins display (large, animated counter with coin icon)
- **Layout**:
  - Scrollable vertical view (pan/zoom for large towns optional)
  - District background illustration (parallax effect on scroll)
  - Buildings positioned in isometric grid pattern
  - Floating Community Chest (bottom-center, above tab bar)
  - Income-per-second indicator (floating top-right corner)
  - Active boost timer banner (when 2x ad boost active)
- **Safe Area**: 
  - Top: `headerHeight + Spacing.xl` 
  - Bottom: `tabBarHeight + Spacing.xxl` (extra space for floating chest)
- **Interactions**:
  - Tap Community Chest → Coin burst animation, haptic feedback, +1 gold
  - Tap building → Show income stats + upgrade button
  - Long-press building → Quick upgrade (if affordable)

#### 2. Shop Screen
- **Purpose**: Browse and purchase buildings, view upgrade paths
- **Header**:
  - Default navigation header (opaque)
  - Title: "Building Shop"
  - Right: Filter icon (filter by district/type)
- **Layout**:
  - Scrollable list of rounded cards
  - Each card shows:
    - Building illustration (left, 80x80pt minimum)
    - Name and tier (Fredoka One)
    - Cost in coins (with coin icon)
    - Income per second ("+X coins/sec")
    - Purchase/Upgrade button (right)
    - Lock icon if district-gated
  - Section headers for building categories
- **Safe Area**: Top: `Spacing.xl`, Bottom: `tabBarHeight + Spacing.xl`

#### 3. Stats Screen
- **Purpose**: View progress, achievements, access settings
- **Header**: Default navigation, title "Village Stats"
- **Layout**:
  - Scrollable form-like layout with card sections:
    - Total coins earned (lifetime)
    - Buildings owned count
    - Income per second (large display)
    - Districts unlocked (5 illustrated badges)
    - Achievements list
    - Settings button (bottom)
- **Safe Area**: Top: `Spacing.xl`, Bottom: `tabBarHeight + Spacing.xl`

#### 4. District Selector (Modal)
- **Purpose**: Switch between unlocked districts, view unlock requirements
- **Layout**:
  - Bottom sheet modal (70% screen height)
  - Horizontal scrollable district cards
  - Each card: Background preview, name, unlock status
  - Selected district has glow/border effect
  - Locked districts show requirements + "Watch Ad to Unlock" or "Purchase" button

#### 5. Building Detail Modal
- **Purpose**: View building stats, upgrade, or sell
- **Layout**:
  - Center modal (rounded corners, drop shadow)
  - Large building illustration at top
  - Current level indicator (stars or tier badge)
  - Stats table (owned, income, total earned)
  - Upgrade button (primary, bottom)
  - Sell button (secondary, text-only)

## Design System

### Color Palette
**Primary Colors**:
- Sage Green: `#8FBC8F` (buttons, accents, success states)
- Sandy Brown: `#F4A460` (Community Chest, coin elements, warm highlights)
- Sky Blue: `#87CEEB` (water elements, district backgrounds, info states)
- Cornsilk: `#FFF8DC` (backgrounds, cards, text on dark)

**Supporting Colors**:
- Dark Wood: `#5C4033` (text, borders, UI framing)
- Warm White: `#FFFAF0` (main background)
- Gold: `#FFD700` (coin color, premium elements)
- Muted Red: `#CD5C5C` (sell/cancel actions)
- Lock Gray: `#A9A9A9` (disabled/locked states)

**Gradients**:
- Header overlay: `cornsilk (100%) → transparent`
- Button shine: `white (10% opacity) at top → transparent`
- District backgrounds: Subtle radial gradients matching district theme

### Typography
**Fonts** (loaded via expo-font):
- **Fredoka One**: Headings, building names, coin counters (playful, rounded)
- **Nunito**: Body text, descriptions, stats (friendly, readable)

**Text Styles**:
- Hero (Coin counter): Fredoka One, 48pt, Gold color, text shadow
- H1 (District names): Fredoka One, 32pt, Dark Wood
- H2 (Building names): Fredoka One, 20pt, Dark Wood
- H3 (Section headers): Fredoka One, 16pt, Sage Green
- Body: Nunito, 16pt, Dark Wood, line-height 24pt
- Caption: Nunito, 14pt, #6B5D53 (60% opacity Dark Wood)
- Button Text: Nunito Bold, 16pt, White or Dark Wood

### Component Specifications

**Buttons**:
- Minimum touch target: 44x44pt
- Border radius: 12pt (rounded)
- Primary button:
  - Background: Sage Green
  - Pressed state: Darken by 15%, scale 0.96
  - Shadow: width 0, height 2, opacity 0.10, radius 2
- Secondary button:
  - Outline only, 2pt Sage Green border
  - Pressed: Fill with Sage Green (10% opacity)
- Floating Action Button (Community Chest):
  - Size: 88x88pt
  - Background: Sandy Brown with gradient shine
  - Drop shadow: width 0, height 4, opacity 0.20, radius 8
  - Pressed: Scale 0.92, haptic feedback

**Cards**:
- Background: Warm White
- Border radius: 16pt
- Border: 1pt, #E8DCC8 (10% Dark Wood)
- Padding: 16pt
- Shadow (elevated cards): width 0, height 1, opacity 0.08, radius 4

**Income Display**:
- Floating pill at top-right
- Background: Sage Green (90% opacity)
- Blur backdrop effect (if supported)
- Text: White, Nunito Bold
- Icon: Coin icon + "/sec"

**Boost Timer Banner**:
- Full-width, below header
- Background: Gold gradient
- Height: 40pt
- Text: "2x Income Active • 47:32 remaining"
- Animated sparkle particles

### Visual Design

**No emojis** - Use Feather icons from @expo/vector-icons for:
- Coins: Custom SVG gold coin with shine
- Settings: "settings" icon
- Stats: "bar-chart-2"
- Shop: "shopping-bag"
- Lock: "lock"
- Chevrons: "chevron-down", "chevron-right"

**Building Illustrations**:
- Style: Isometric 2.5D, low-poly inspired with soft shading
- Aesthetic: Animal Crossing meets toy diorama
- Details: Visible depth, rounded edges, warm shadows
- Size variations: 80x80pt (shop), 120x120pt (detail), scalable on town view
- Animation layers: Separate SVG/PNG layers for animated elements (smoke, lights, rotation)

**District Backgrounds**:
- Full-screen illustrated backdrops with parallax layers
- Forest Valley: Green hills, pine trees, meadow
- Coastal Harbor: Beach, lighthouse, sailboats
- Mountain Peak: Snow-capped peaks, alpine village
- Desert Oasis: Palm trees, sand dunes, bazaar
- Skyline City: Modern buildings, park, skyscrapers

**Particle Effects**:
- Coin tap: 3-5 small gold coins burst upward (fade out)
- Building placed: Sparkle ring expands
- Level up: Confetti burst from building

### Critical Assets List
1. **Community Chest**: Animated treasure chest (idle breathing, tap burst)
2. **15+ Buildings** (3 per district): Cottage, Bakery, Lighthouse, Windmill, Market, Workshop, Tavern, Observatory, Pyramid, Oasis Well, Cactus Farm, Skyscraper, Park Fountain, Cafe, Hotel
3. **5 District Backgrounds**: Illustrated parallax layers
4. **Lottie Animations**:
   - Chimney smoke loop (5sec)
   - Windmill rotation (8sec)
   - Lighthouse beam sweep (4sec)
   - Sparkle/twinkle lights (3sec loop)
5. **Player Avatars**: 4 cozy illustrated mayor characters (variations: young/old, different outfits)
6. **UI Icons**: Gold coin, district badges (5), achievement medals

### Interaction Patterns
- All touchables: Scale 0.96 on press, 150ms spring animation
- Haptic feedback: Light impact on tap, medium on purchase/upgrade
- Number counters: Animated count-up using react-native-reanimated
- Modals: Slide up from bottom (300ms ease-out)
- Screen transitions: Horizontal slide for tabs (native)
- Loading states: Subtle pulse animation on locked buildings

### Accessibility
- Text contrast ratio: Minimum 4.5:1 (WCAG AA)
- Touch targets: 44pt minimum
- Alternative text for all icons and illustrations
- Reduce motion: Disable parallax and particle effects if enabled
- Sound: All audio must have toggle in settings