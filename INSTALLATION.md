# 🚀 Installation Guide - دليل التثبيت السريع

## ⚠️ مهم: مشكلة التوافق مع React 19

هذا المشروع يستخدم React 19.1.0، ولكن بعض المكتبات تحتاج React 18.
**لا تقلق!** الحل بسيط:

---

## ✅ طريقة التثبيت الصحيحة

### استخدم هذا الأمر:

```powershell
npm install --legacy-peer-deps
```

**أو:**

```powershell
npm install --force
```

### ⚡ لماذا نستخدم `--legacy-peer-deps`?

- يتجاوز تحذيرات التوافق بين المكتبات
- React 19 جديد وبعض المكتبات لسه ما دعمته رسمياً
- المكتبات تشتغل تمام رغم التحذير

---

## 📦 المكتبات المضافة

تم إضافة هذه المكتبات الجديدة:

```json
{
  "@shopify/react-native-skia": "^1.5.3",
  "expo-linear-gradient": "~14.0.1",
  "lottie-react-native": "^7.2.0",
  "react-native-svg": "^15.9.0"
}
```

---

## 🔧 خطوات التثبيت الكاملة

### الخطوة 1: حذف node_modules (اختياري - إذا كان عندك مشاكل)

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### الخطوة 2: تثبيت المكتبات

```powershell
npm install --legacy-peer-deps
```

### الخطوة 3: التحقق من التثبيت

```powershell
npm list @shopify/react-native-skia
npm list lottie-react-native
npm list expo-linear-gradient
npm list react-native-svg
```

---

## 🎮 تشغيل المشروع

بعد التثبيت، شغّل المشروع:

### على Expo (Development):

```powershell
npm run expo:dev
```

### تشغيل Server + Expo معاً:

```powershell
npm run all:dev
```

---

## 🐛 حل المشاكل

### مشكلة: `npm error ERESOLVE unable to resolve dependency tree`

**الحل:**
```powershell
npm install --legacy-peer-deps
```

### مشكلة: `Module not found: @shopify/react-native-skia`

**الحل:**
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

### مشكلة: `Metro bundler error`

**الحل:**
```powershell
npx expo start --clear
```

---

## 📱 التشغيل على الهاتف

### Android:
1. ثبّت تطبيق "Expo Go" من Google Play
2. امسح QR code من Terminal
3. اللعبة راح تفتح

### iOS:
1. ثبّت تطبيق "Expo Go" من App Store
2. امسح QR code من Terminal
3. اللعبة راح تفتح

---

## ⚙️ Build للإنتاج

### Build Static:

```powershell
npm run expo:static:build
```

### Build Server:

```powershell
npm run server:build
```

---

## 🎯 ملخص الأوامر المهمة

| الأمر | الوصف |
|-------|-------|
| `npm install --legacy-peer-deps` | تثبيت المكتبات |
| `npm run expo:dev` | تشغيل Expo في وضع التطوير |
| `npm run all:dev` | تشغيل كل شيء (Server + Expo) |
| `npm run lint` | فحص الأخطاء |
| `npm run format` | تنسيق الكود |
| `npx expo start --clear` | إعادة تشغيل مع مسح الـ cache |

---

## 📁 التحقق من التثبيت الصحيح

شغّل هذا الأمر للتأكد:

```powershell
npm list --depth=0
```

يجب أن ترى:
```
├── @shopify/react-native-skia@1.5.3
├── expo-linear-gradient@14.0.1
├── lottie-react-native@7.2.0
├── react-native-svg@15.9.0
```

---

## ✅ علامات التثبيت الناجح

✓ لا توجد أخطاء حمراء في Terminal
✓ `node_modules` folder موجود
✓ المكتبات الأربعة الجديدة مثبتة
✓ المشروع يشتغل بدون crash

---

## 🔄 إذا لازالت المشاكل موجودة

### حل شامل:

```powershell
# 1. حذف كل شيء
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. مسح الـ cache
npm cache clean --force

# 3. إعادة التثبيت
npm install --legacy-peer-deps

# 4. إعادة تشغيل Metro
npx expo start --clear
```

---

## 💡 نصائح

1. **استخدم دائماً `--legacy-peer-deps`** مع هذا المشروع
2. **لا تحذف** `node_modules` إلا إذا كان فيه مشاكل
3. **استخدم `--clear`** إذا واجهت مشاكل في Metro bundler
4. **تأكد من اتصال الإنترنت** عند التثبيت

---

## 📞 الدعم

إذا واجهت أي مشكلة بعد كل هذا:

1. تأكد إن Node.js مثبت (v18 أو أحدث)
2. تأكد إن npm محدث: `npm install -g npm@latest`
3. جرب حذف `.expo` folder: `Remove-Item -Recurse -Force .expo`

---

**بالتوفيق! 🚀**
