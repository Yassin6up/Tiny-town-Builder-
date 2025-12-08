# 🏠 كيفية إضافة واستبدال الموديلات والأنيميشنات

## 📂 هيكل المجلدات

```
attached_assets/
├── buildings/           ← ضع صور المباني هنا
│   ├── cottage.png
│   ├── bakery.png
│   ├── windmill.png
│   ├── lighthouse.png
│   └── ... (باقي المباني)
│
├── animations/          ← ضع ملفات الأنيميشن هنا
│   ├── coin-burst.json  (Lottie)
│   ├── smoke.json
│   └── sparkle.json
│
└── models/             ← موديلات 3D (اختياري)
    ├── house.glb
    └── tree.glb
```

---

## 🏠 استبدال صور المباني

### الخطوة 1: تحضير الصور

يجب أن تكون الصور بهذه المواصفات:
- **الصيغة**: PNG مع خلفية شفافة
- **الحجم**: 256x256 بكسل (أو أكبر)
- **النمط**: Isometric أو 3D render

### الخطوة 2: تسمية الملفات

استخدم نفس أسماء المباني في الكود:

| اسم المبنى في الكود | اسم الملف |
|---------------------|-----------|
| `cottage` | `cottage.png` |
| `bakery` | `bakery.png` |
| `windmill` | `windmill.png` |
| `lighthouse` | `lighthouse.png` |
| `market` | `market.png` |
| `workshop` | `workshop.png` |
| ... | ... |

### الخطوة 3: وضع الصور في المجلد

```powershell
# إنشاء المجلد
New-Item -ItemType Directory -Force -Path "attached_assets/buildings"

# نسخ الصور
Copy-Item "path/to/your/cottage.png" "attached_assets/buildings/"
```

### الخطوة 4: تحديث BuildingIcon Component

افتح: `client/components/BuildingIcon.tsx`

استبدل الصور:

```tsx
// قبل (رموز افتراضية)
case "cottage":
  return <Feather name="home" size={size} color="#8B4513" />;

// بعد (صورة حقيقية)
case "cottage":
  return (
    <Image
      source={require("../../attached_assets/buildings/cottage.png")}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
```

---

## ✨ إضافة أنيميشنات Lottie

### الخطوة 1: تحميل الأنيميشن

من LottieFiles.com:
1. ابحث عن "coin animation"
2. اضغط Download JSON
3. احفظه في `attached_assets/animations/`

### الخطوة 2: استخدام الأنيميشن

في `ParticleEffect.tsx`:

```tsx
import LottieView from 'lottie-react-native';

// استبدل هذا:
function CoinParticle() {
  return <View style={[styles.shape, styles.coin]} />;
}

// بهذا:
function CoinParticle() {
  return (
    <LottieView
      source={require('../../attached_assets/animations/coin-burst.json')}
      autoPlay
      loop
      style={{ width: 40, height: 40 }}
    />
  );
}
```

---

## 🎨 استبدال أيقونة الصندوق

### الخطوة 1: ضع الصورة الجديدة

```
attached_assets/
└── chest/
    └── treasure-chest.png  ← صورتك الجديدة
```

### الخطوة 2: تحديث TownScreen

في `client/screens/TownScreen.tsx`:

```tsx
// استبدل هذا:
<Image
  source={require("../../assets/images/icon.png")}
  style={styles.chestImage}
  resizeMode="contain"
/>

// بهذا:
<Image
  source={require("../../attached_assets/chest/treasure-chest.png")}
  style={styles.chestImage}
  resizeMode="contain"
/>
```

---

## 🏗️ إضافة موديلات 3D جديدة

### استخدام موديلات GLB/GLTF

إذا كان عندك موديل 3D (مثل house.glb):

#### الخيار 1: تحويله لصورة

استخدم Blender:
1. افتح الموديل في Blender
2. اضبط الكاميرا على زاوية Isometric (54.736°)
3. Render → PNG مع خلفية شفافة
4. استخدم الصورة كما في الخطوات السابقة

#### الخيار 2: استخدام Three.js (متقدم)

سنحتاج مكتبة إضافية:

```powershell
npm install @react-three/fiber @react-three/drei
```

---

## 📋 قائمة المباني للاستبدال

### Forest Valley (الغابة)
- [ ] `cottage.png` - كوخ خشبي
- [ ] `bakery.png` - مخبز
- [ ] `windmill.png` - طاحونة
- [ ] `apiary.png` - خلية نحل
- [ ] `treehouse.png` - بيت شجرة

### Coastal Harbor (الساحل)
- [ ] `lighthouse.png` - منارة
- [ ] `market.png` - سوق سمك
- [ ] `workshop.png` - ورشة قوارب
- [ ] `shipyard.png` - حوض بناء
- [ ] `marina.png` - مرسى

### Mountain Peak (الجبل)
- [ ] `tavern.png` - حانة
- [ ] `observatory.png` - مرصد
- [ ] `cafe.png` - مقهى
- [ ] `skiLodge.png` - نزل تزلج
- [ ] `icePalace.png` - قصر جليدي

### Desert Oasis (الصحراء)
- [ ] `pyramid.png` - هرم
- [ ] `oasis.png` - واحة
- [ ] `cactus.png` - مزرعة صبار
- [ ] `bazaar.png` - بازار
- [ ] `sultanPalace.png` - قصر السلطان

### Skyline City (المدينة)
- [ ] `skyscraper.png` - ناطحة سحاب
- [ ] `fountain.png` - نافورة
- [ ] `hotel.png` - فندق فاخر
- [ ] `rooftopGarden.png` - حديقة سطح
- [ ] `penthouse.png` - بنتهاوس

---

## 🎬 أنيميشنات موصى بها

### من LottieFiles.com

ابحث عن:
1. **"coin animation"** - للعملات
2. **"smoke effect"** - للدخان
3. **"sparkle"** - للتلميع
4. **"construction"** - لبناء المباني
5. **"celebration"** - للإنجازات

---

## 🔄 مثال كامل: استبدال مبنى Cottage

### 1. حمّل الصورة

من Kenney.nl:
- اذهب لـ: https://kenney.nl/assets/isometric-buildings
- ابحث عن "house" أو "cottage"
- حمّل الصورة

### 2. ضع الصورة

```
attached_assets/buildings/cottage.png
```

### 3. حدّث BuildingIcon.tsx

```tsx
export function BuildingIcon({ type, size = 48 }: BuildingIconProps) {
  const renderIcon = () => {
    switch (type) {
      case "cottage":
        return (
          <Image
            source={require("../../attached_assets/buildings/cottage.png")}
            style={{ width: size, height: size }}
            resizeMode="contain"
          />
        );
      
      // ... باقي الحالات
    }
  };

  return <View style={styles.container}>{renderIcon()}</View>;
}
```

### 4. اختبر اللعبة

```powershell
npm run expo:dev
```

---

## 🎨 نصائح للتصميم

### للمباني:
- استخدم نفس النمط الفني لكل المباني
- احتفظ بنسب متشابهة (256x256 أو 512x512)
- استخدم خلفية شفافة (PNG)
- أضف ظلال خفيفة في الصورة نفسها

### للأنيميشنات:
- استخدم ملفات Lottie (JSON) لأفضل أداء
- حافظ على حجم الملف صغير (< 50KB)
- اختبر على جهاز حقيقي لضمان الأداء

---

## ⚡ تحسين الأداء

### ضغط الصور

استخدم أداة مثل TinyPNG:

```bash
# أو استخدم PowerShell
# تثبيت ImageMagick أولاً
magick convert cottage.png -resize 256x256 -quality 85 cottage-optimized.png
```

### Lazy Loading

للموديلات الكبيرة، استخدم:

```tsx
const CottageImage = React.lazy(() => import('./CottageImage'));

<Suspense fallback={<ActivityIndicator />}>
  <CottageImage />
</Suspense>
```

---

## 🐛 حل المشاكل

### الصورة لا تظهر؟
✓ تأكد من المسار صحيح
✓ الملف موجود في المجلد
✓ الاسم بدون أخطاء إملائية
✓ استخدم `require()` وليس `import`

### الأنيميشن لا يعمل؟
✓ تأكد من تثبيت `lottie-react-native`
✓ الملف JSON صالح
✓ حجم الملف ليس كبيراً جداً

### الأداء بطيء؟
✓ قلل حجم الصور
✓ استخدم ضغط PNG
✓ قلل عدد الأنيميشنات المتزامنة

---

## 📞 هل تحتاج مساعدة؟

إذا واجهت مشكلة:
1. تأكد من المسارات صحيحة
2. راجع console log للأخطاء
3. جرب مع صورة واحدة أولاً

---

**بالتوفيق! 🎮✨**
