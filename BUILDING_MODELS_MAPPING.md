# 🏙️ Building Models Mapping Guide

## ✅ Current Implementation

The 3D building models from `assets/model/city map/` are now integrated into the Skyline City district buildings!

### 📍 Model to Building Mapping

| Building Name | Icon Type | 3D Model Used | File Path |
|--------------|-----------|---------------|-----------|
| **Glass Tower** | `skyscraper` | Bar.png | `assets/model/city map/Bar/Bar.png` |
| **Grand Fountain** | `fountain` | CandyShop.png | `assets/model/city map/CandyShop/CandyShop.png` |
| **Luxury Hotel** | `hotel` | Casino.png | `assets/model/city map/Casino/Casino.png` |
| **Sky Garden** | `rooftopGarden` | PizzaPlace.png | `assets/model/city map/PizzaPlace/PizzaPlace.png` |
| **Diamond Penthouse** | `penthouse` | Market.png | `assets/model/city map/Supermarket/Market.png` |

---

## 🎮 How It Works

### Code Implementation in `BuildingIcon.tsx`

```typescript
const BUILDING_IMAGES: Partial<Record<BuildingIconType, any>> = {
  skyscraper: require("@/assets/model/city map/Bar/Bar.png"),
  fountain: require("@/assets/model/city map/CandyShop/CandyShop.png"),
  hotel: require("@/assets/model/city map/Casino/Casino.png"),
  rooftopGarden: require("@/assets/model/city map/PizzaPlace/PizzaPlace.png"),
  penthouse: require("@/assets/model/city map/Supermarket/Market.png"),
};
```

The component checks if a building has a 3D model:
- ✅ **If model exists**: Shows the PNG image (90% of icon size)
- ❌ **If no model**: Falls back to Feather icon

---

## 🌳 Adding Models for Other Districts

### Forest District Buildings
Create folder: `assets/model/forest map/` and add:
- `cottage` → Cottage.png
- `bakery` → Bakery.png
- `windmill` → Windmill.png
- `apiary` → Apiary.png
- `treehouse` → Treehouse.png

### Coastal District Buildings
- `lighthouse` → Lighthouse.png
- `market` → FishMarket.png
- `workshop` → Workshop.png
- `shipyard` → Shipyard.png
- `marina` → Marina.png

### Mountain District Buildings
- `tavern` → Tavern.png
- `observatory` → Observatory.png
- `cafe` → Cafe.png
- `skiLodge` → SkiLodge.png
- `icePalace` → IcePalace.png

### Desert District Buildings
- `pyramid` → Pyramid.png
- `oasis` → Oasis.png
- `cactus` → Cactus.png
- `bazaar` → Bazaar.png
- `sultanPalace` → Palace.png

---

## 🔧 How to Add More Models

### Step 1: Add the PNG file to assets folder
```
assets/model/forest map/Cottage/Cottage.png
```

### Step 2: Update BUILDING_IMAGES in BuildingIcon.tsx
```typescript
const BUILDING_IMAGES: Partial<Record<BuildingIconType, any>> = {
  // Skyline buildings (already done)
  skyscraper: require("@/assets/model/city map/Bar/Bar.png"),
  // ... other skyline buildings
  
  // Forest buildings (add these)
  cottage: require("@/assets/model/forest map/Cottage/Cottage.png"),
  bakery: require("@/assets/model/forest map/Bakery/Bakery.png"),
  // ... etc
};
```

### Step 3: The component automatically uses the image!
No need to change anything else - the BuildingIcon component will automatically detect and display the 3D model.

---

## 🎨 Model Requirements

- **Format**: PNG with transparent background
- **Size**: Recommended 512x512 or 1024x1024
- **Style**: Isometric view (30-45 degree angle)
- **Colors**: Bright and vibrant for kids

---

## 📦 Available File Formats

Each building folder contains multiple formats:
- `.png` - Used in React Native ✅
- `.obj` - 3D object file (not used in React Native)
- `.mtl` - Material file (not used in React Native)
- `.vox` - Voxel file (not used in React Native)

**Note**: React Native only supports PNG/JPG images. The OBJ/MTL files cannot be rendered directly.

---

## 🚀 Test Your Models

1. Run the app: `npm run expo:dev`
2. Navigate to the Shop screen
3. Scroll to Skyline City buildings
4. You should see 3D models instead of icons! 🎉

---

## 🎯 Where Models Appear

The 3D models will show in:
- ✅ **Shop Screen** - Building cards
- ✅ **Town Screen** - Community chest area
- ✅ **Building Detail Modal** - Large icon view
- ✅ **Isometric Grid** - 3D building placement

---

## 🌟 Future Enhancements

Consider adding:
- Animated GIF/Lottie versions for production animations
- Different building states (idle, active, upgraded)
- Seasonal decorations (snow, flowers, lights)
- Weather effects (rain, sun, clouds)

---

## 📝 Notes

- The empty `forest map` folder is ready for your forest building models
- All skyline models are working and integrated ✅
- Models scale automatically based on icon size
- Tier badges (rare/legendary) still appear on top of models

Happy building! 🏗️✨
