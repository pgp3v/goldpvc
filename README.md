# Gold PVC - موقع شركة Gold PVC

## 📋 وصف المشروع | Description du Projet

موقع تعريفي لشركة Gold PVC لنجارة الألمنيوم و PVC مع لوحة تحكم للأدمن تتضمن آلة حاسبة للأسعار.

Site web de présentation pour Gold PVC, spécialisé en menuiserie aluminium et PVC, avec un panneau d'administration incluant un calculateur de prix.

---

## 🌐 الموقع الرئيسي | Site Principal

### الميزات | Fonctionnalités:
- ✅ تصميم عصري ومتجاوب | Design moderne et responsive
- ✅ دعم اللغتين: الفرنسية والعربية | Bilingue: Français et Arabe
- ✅ عرض المنتجات مع الصور | Catalogue des produits avec images
- ✅ قسم الخدمات | Section services
- ✅ معرض الصور | Galerie photos
- ✅ نموذج الاتصال | Formulaire de contact

---

## 🔐 لوحة تحكم الأدمن | Panneau Admin

### الوصول | Accès:
```
URL: /admin/index.html
المستخدم | Utilisateur: admin
كلمة المرور | Mot de passe: admin123
```

### الميزات | Fonctionnalités:

#### 1. آلة حاسبة الأسعار | Calculateur de Prix
- حساب تلقائي لـ 30+ منتج | Calcul automatique pour 30+ produits
- البروفيلات والإكسسوارات | Profils et accessoires
- تكلفة الزجاج | Coût du vitrage
- هامش الربح قابل للتعديل | Marge ajustable
- حساب السعر للمتر المربع | Prix au m²

#### 2. إدارة الأسعار | Gestion des Prix
- تعديل أسعار البروفيلات | Modifier les prix des profils
- تعديل أسعار الإكسسوارات | Modifier les prix des accessoires
- تعديل سعر الصرف | Taux de change EUR/MAD

#### 3. عروض الأسعار | Devis
- حفظ الحسابات | Sauvegarder les calculs
- طباعة / تصدير PDF | Imprimer / Exporter PDF
- أرشيف عروض الأسعار | Archive des devis

---

## 📁 هيكل الملفات | Structure des Fichiers

```
goldpvc/
├── index.html          # الصفحة الرئيسية
├── css/
│   └── style.css       # أنماط الموقع الرئيسي
├── js/
│   └── main.js         # جافاسكريبت الموقع الرئيسي
├── admin/
│   ├── index.html      # لوحة تحكم الأدمن
│   ├── admin-style.css # أنماط لوحة التحكم
│   ├── admin-main.js   # جافاسكريبت لوحة التحكم
│   └── admin-calculator.js # بيانات ومعادلات الحساب
└── images/             # الصور (يمكن إضافتها)
```

---

## 📊 المنتجات المدعومة | Produits Supportés

### الأبواب | Portes:
- باب فتحة واحدة | Porte 1 Battant
- باب فتحتين ماساي | Porte Double Battant MASSAI
- باب فتحتين كومفورت | Porte Double Battant COMFORT
- باب حمام | Porte Sanitaire
- باب مزخرف | Porte Décorative
- باب منزلق | Porte Coulissante
- باب NAFIDA QUARTZ

### النوافذ | Fenêtres:
- منزلقة إمرود | Coulissante EMREUD
- منزلقة كومفورت | Coulissante COMFORT
- منزلقة MAVAL SR95
- منزلقة STRUGAL SR90
- منزلقة ALPHA LUM SR70
- متأرجحة فتحة واحدة | Oscillo-Battant 1 Vantail
- متأرجحة فتحتين | Oscillo-Battant 2 Vantaux
- منفاخية | Soufflet
- إطار ثابت | Châssis Fixe
- نافذة فتحة واحدة كومفورت | Fenêtre 1 Battant COMFORT

### الستائر | Volets:
- ستارة معدنية ألمنيوم | Volet Roulant Aluminium
- ستارة PVC | Volet Roulant PVC
- ستارة مبثوقة | Rideau Extrudé

---

## 🚀 كيفية التشغيل | Comment Lancer

### الطريقة 1: فتح مباشرة
فقط افتح ملف `index.html` في المتصفح

### الطريقة 2: خادم محلي
```bash
# Python 3
cd goldpvc
python -m http.server 8000

# ثم افتح: http://localhost:8000
```

---

## 🔧 التخصيص | Personnalisation

### تغيير الأسعار:
1. افتح ملف `admin/admin-calculator.js`
2. عدّل القيم في `productData`
3. أسعار الزجاج في `glassPrices`

### إضافة منتج جديد:
أضف كائن جديد في `productData` بالتنسيق التالي:
```javascript
newProduct: {
    name_fr: "Nom en français",
    name_ar: "الاسم بالعربية",
    hasTraverse: false,
    profiles: [
        { description: "...", factor: "2*(W+H)", unit: "mt", price: 50 }
    ],
    accessories: [
        { description: "...", qty: 2, unit: "pcs", price: 10 }
    ]
}
```

---

## 📞 الدعم | Support

للمساعدة أو الاستفسارات، تواصل معنا.

---

© 2024 Gold PVC - جميع الحقوق محفوظة | Tous droits réservés
