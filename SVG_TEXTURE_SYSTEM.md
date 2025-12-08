# 🎨 SVG Texture System Documentation

## Overview

The game now uses **SVG textures** instead of gradient backgrounds for all UI elements (buttons, modals, cards, panels). This creates a professional, Clash-of-Clans style wood/stone texture aesthetic.

---

## 🪵 Available Texture Components

### 1. WoodTextureSvg
**Location**: `client/components/textures/WoodTextureSvg.tsx`

**Variants**:
- `light` - Light brown wood (default, main buttons)
- `dark` - Dark brown wood (secondary elements)
- `weathered` - Aged, worn wood
- `rich` - Rich golden wood (premium elements)

**Usage**:
```tsx
import { WoodTextureSvg } from '@/components/textures';

<WoodTextureSvg 
  width={300} 
  height={200} 
  variant="light" 
  borderRadius={25} 
/>
```

---

### 2. StoneTextureSvg
**Location**: `client/components/textures/StoneTextureSvg.tsx`

**Variants**:
- `gray` - Gray stone (default, neutral elements)
- `blue` - Blue-gray stone (settings, info)
- `dark` - Dark charcoal stone (strong elements)

**Usage**:
```tsx
import { StoneTextureSvg } from '@/components/textures';

<StoneTextureSvg 
  width={300} 
  height={200} 
  variant="gray" 
  borderRadius={25} 
/>
```

---

### 3. GoldTextureSvg
**Location**: `client/components/textures/GoldTextureSvg.tsx`

**Variants**:
- `bright` - Bright gold (premium, rewards)
- `matte` - Matte gold (expensive items)
- `bronze` - Bronze/copper (achievements)

**Usage**:
```tsx
import { GoldTextureSvg } from '@/components/textures';

<GoldTextureSvg 
  width={300} 
  height={200} 
  variant="bright" 
  borderRadius={25} 
/>
```

---

### 4. MetalTextureSvg
**Location**: `client/components/textures/MetalTextureSvg.tsx`

**Variants**:
- `silver` - Silver metal (special items)
- `steel` - Steel gray (industrial)
- `iron` - Dark iron (heavy elements)

**Usage**:
```tsx
import { MetalTextureSvg } from '@/components/textures';

<MetalTextureSvg 
  width={300} 
  height={200} 
  variant="silver" 
  borderRadius={25} 
/>
```

---

## 🎮 Updated Components

### CartoonButton
**Now uses SVG textures** instead of LinearGradient.

**New Variants**:
- `wood` (default) - Light wood
- `wood-dark` - Dark wood
- `wood-rich` - Rich golden wood
- `stone` - Gray stone
- `stone-dark` - Dark stone
- `gold` - Bright gold
- `gold-bronze` - Bronze/copper
- `metal` - Silver metal
- `metal-steel` - Steel gray

**Example**:
```tsx
<CartoonButton 
  title="Upgrade" 
  onPress={handleUpgrade}
  variant="wood-rich"
  size="large"
/>
```

---

### CartoonPanel
**Now uses SVG textures** for backgrounds.

**New Variants**:
- `wood` (default) - Light wood
- `wood-dark` - Dark wood
- `wood-rich` - Rich wood
- `stone` - Gray stone
- `stone-dark` - Dark stone
- `gold` - Bright gold
- `gold-bronze` - Bronze

**Example**:
```tsx
<CartoonPanel variant="wood-rich" width={350} height={400}>
  <Text>Panel Content</Text>
</CartoonPanel>
```

---

### CartoonHeader
**Currency displays and buttons now use SVG textures**.

**Features**:
- District button: Gold texture background
- Coins display: Light wood texture
- Diamonds display: Rich wood texture
- Settings button: Stone texture

---

### Button (Legacy Wrapper)
Now wraps `CartoonButton` with SVG textures.

**Example**:
```tsx
<Button variant="wood" onPress={handlePress}>
  Click Me
</Button>
```

---

### Card (Legacy Wrapper)
Now wraps `CartoonPanel` with SVG textures.

**Example**:
```tsx
<Card variant="wood" title="Building Info">
  <Text>Card Content</Text>
</Card>
```

---

## 🏗️ Creating Custom SVG Texture Backgrounds

### Pattern: Two-Rect System

All SVG textures use this pattern:
1. **Outer Rect**: Dark border with stroke (3D shadow effect)
2. **Inner Rect**: Lighter surface with gradient (main texture)

**Example Template**:
```tsx
<Svg width={width} height={height}>
  {/* Outer rect - dark border */}
  <Rect
    x="0"
    y="0"
    width={width}
    height={height}
    rx={borderRadius}
    fill="#8B4513"           // Outer dark color
    stroke="#3D1F0A"         // Border color
    strokeWidth={10}
  />
  
  {/* Inner rect - light surface */}
  <Rect
    x="10"
    y="10"
    width={width - 20}
    height={height - 20}
    rx={borderRadius - 10}
    fill="url(#gradient)"    // Gradient or pattern
  />
</Svg>
```

---

## 🎯 Integration Guidelines

### For New Components

1. **Import texture component**:
```tsx
import { WoodTextureSvg } from '@/components/textures';
```

2. **Create wrapper with absolute positioning**:
```tsx
<View style={styles.container}>
  <View style={styles.textureBackground}>
    <WoodTextureSvg width={300} height={200} variant="light" />
  </View>
  <View style={styles.content}>
    {/* Your content here */}
  </View>
</View>
```

3. **Style the layers**:
```tsx
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 300,
    height: 200,
  },
  textureBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    padding: 16,
  },
});
```

---

## 🖼️ Visual Design Principles

### Depth & 3D Effect
- **Border width**: 10px creates shadow depth
- **Highlight overlay**: `rgba(255, 255, 255, 0.3)` at top 30-40%
- **Text shadow**: Always add for readability

### Color Harmony
- **Wood**: Browns (#B06B34, #D48A4C)
- **Stone**: Grays (#6B7280, #9CA3AF)
- **Gold**: Yellow-orange (#D4AF37, #FFD700)
- **Metal**: Blue-gray (#8C92AC, #C0C0C0)

### Border Colors
- **Wood**: `#5C330F` (dark brown)
- **Stone**: `#1F2937` (charcoal)
- **Gold**: `#8B6914` (dark gold)
- **Metal**: `#2C3E50` (dark blue-gray)

---

## 📱 Usage Recommendations

### Button Variants by Context
- **Primary actions**: `wood` or `wood-rich`
- **Upgrade/Buy**: `gold` or `gold-bronze`
- **Cancel/Close**: `stone` or `stone-dark`
- **Rare items**: `metal` or `metal-steel`

### Panel Variants by Context
- **Main panels**: `wood`
- **Premium content**: `wood-rich` or `gold`
- **Info panels**: `stone`
- **Achievement panels**: `gold-bronze`

---

## 🔧 Maintenance

### Adding New Texture Variant

1. Edit the appropriate texture component (e.g., `WoodTextureSvg.tsx`)
2. Add new color set to the `colors` object
3. Export the new variant type in `textures/index.ts`
4. Update `CartoonButton` and `CartoonPanel` to support new variant

**Example**:
```tsx
// In WoodTextureSvg.tsx
const woodColors = {
  light: { outer: '#B06B34', border: '#5C330F', inner: '#D48A4C' },
  dark: { outer: '#8B4513', border: '#3D1F0A', inner: '#A0522D' },
  // Add new variant:
  charred: { outer: '#4A2511', border: '#1A0F08', inner: '#6B3410' },
};
```

---

## ✅ Completed Updates

- ✅ Created 4 SVG texture components (Wood, Stone, Gold, Metal)
- ✅ Updated CartoonButton with SVG backgrounds
- ✅ Updated CartoonPanel with SVG backgrounds
- ✅ Updated CartoonHeader with SVG textures
- ✅ Updated CartoonModal (uses CartoonPanel)
- ✅ Updated Button (wraps CartoonButton)
- ✅ Updated Card (wraps CartoonPanel)
- ✅ Updated DiamondShopModal with SVG textures

---

## 🚀 Next Steps

1. Update remaining modals:
   - OfflineEarningsModal
   - BuildingDetailModal
   - DistrictSelectorModal

2. Update shop/stat components:
   - ShopCard
   - StatCard
   - BoostCard

3. Update screens:
   - ShopScreen
   - StatsScreen
   - SettingsScreen

4. Update building display cards in IsometricBuildingGrid

---

## 🎨 Design Philosophy

The SVG texture system follows these principles:

1. **Authenticity**: Real wood/stone textures, not flat colors
2. **Depth**: 3D border effect with outer/inner rects
3. **Consistency**: Same pattern across all UI elements
4. **Flexibility**: Multiple variants per material
5. **Performance**: Efficient SVG rendering

---

## 📚 Resources

- SVG Patterns: https://www.w3.org/TR/SVG2/pservers.html
- React Native SVG: https://github.com/software-mansion/react-native-svg
- Clash of Clans UI Reference: [User-provided design guidelines]

---

**Last Updated**: December 2024
**Version**: 1.0.0
