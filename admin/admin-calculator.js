// ================================
// Gold PVC - Calculator Data from Excel
// ملف البيانات من ملف Excel
// آخر تحديث: 30/01/2026
// ================================

// ============ أنواع الزجاج (REMPLISSAGE) ============
const GLASS_TYPES = [
    { id: 'clair_4mm', name: 'CLAIR 4mm', nameAr: 'زجاج شفاف 4مم', thickness: '4 mm', price: 51 },
    { id: 'clair_6mm', name: 'CLAIR 6mm', nameAr: 'زجاج شفاف 6مم', thickness: '6 mm', price: 85 },
    { id: 'lexon', name: 'LEXON', nameAr: 'ليكسون', thickness: '6 mm', price: 61 },
    { id: 'moslin_clair', name: 'MOSLIN CLAIR', nameAr: 'موسلين شفاف', thickness: '5,5 mm', price: 95 },
    { id: 'moslin_bronze', name: 'MOSLIN BRONZE', nameAr: 'موسلين برونز', thickness: '5,5 mm', price: 100 },
    { id: 'miroir', name: 'MIROIR', nameAr: 'مرآة', thickness: '4 mm', price: 105 },
    { id: 'stopsol_clair', name: 'STOPSOL CLAIR', nameAr: 'ستوبسول شفاف', thickness: '6 mm', price: 110 },
    { id: 'stopsol_bronze', name: 'STOPSOL BRONZE', nameAr: 'ستوبسول برونز', thickness: '5,5 mm', price: 115 },
    { id: 'vitrage_double', name: 'Vitrage double', nameAr: 'زجاج مزدوج', thickness: '6 mm', price: 105 },
    { id: 'vitrage_starte', name: 'Vitrage starte décord', nameAr: 'زجاج ستارت ديكور', thickness: '6 mm', price: 71 },
    { id: 'lame_ridaux', name: 'LAME ridaux', nameAr: 'شرائح ستائر', thickness: '20 mm', price: 156 },
    { id: 'vitrage_lame', name: 'Vitrage lames ridaux', nameAr: 'زجاج شرائح ستائر', thickness: '4,5 mm', price: 156 },
    { id: 'vitrage_arme', name: 'Vitrage armé', nameAr: 'زجاج مقوى', thickness: '6 mm', price: 230 },
    { id: 'stadipe_3_3', name: 'Vitrage 3/3 stadépe', nameAr: 'زجاج ستاديب 3/3', thickness: '6 mm', price: 400 }
];

// ============ معلومات الشركة الافتراضية ============
const COMPANY_INFO_DEFAULTS = {
    name: 'GOLD PVC SARL',
    address: 'Casablanca, Maroc',
    phone: '+212 5XX-XXXXXX',
    email: 'contact@goldpvc.ma',
    ice: '00000000000000',
    rc: 'XXXXX',
    patente: 'XXXXXXXX',
    cnss: 'XXXXXXXX',
    tva: 20
};

// ============ المنتجات مرتبة حسب الفئة ============
const PRODUCTS = {
    
    // ========================================
    // النوافذ - Fenêtres / Windows
    // ========================================
    windows: {
        
        // --- النوافذ المنزلقة - Fenêtres Coulissantes ---
        'coulissante_2v': {
            name: 'Fenêtre coulissante 2 vanteaux',
            nameAr: 'نافذة منزلقة بضلفتين',
            series: [
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 850 },
                { id: 'comfor_ronfor', name: 'COMFOR avec ronfor', pricePerM2: 1100 },
                { id: 'comfor_sans', name: 'COMFOR sans ronfor', pricePerM2: 950 },
                { id: 'maval_sr95', name: 'MAVAL SR95', pricePerM2: 1200 },
                { id: 'strugal_sr90', name: 'STRUGAL SR90', pricePerM2: 1150 },
                { id: 'alpha_70d', name: 'ALPHA 70D', pricePerM2: 1300 }
            ]
        },
        
        'coulissante_cache': {
            name: 'Fenêtre coulissante avec cache ridoux',
            nameAr: 'نافذة منزلقة مع صندوق ستارة',
            series: [
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 1050 },
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 950 }
            ]
        },
        
        // --- النوافذ الفرنسية - Fenêtres à Battants ---
        'of_2battants': {
            name: 'Fenêtre OF 2 battants',
            nameAr: 'نافذة بضلفتين متحركتين',
            series: [
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 1000 },
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 1100 },
                { id: 'nafida', name: 'NAFIDA QWARTZ', pricePerM2: 950 }
            ]
        },
        
        'of_1battant': {
            name: 'Fenêtre OF 1 battant',
            nameAr: 'نافذة بضلفة واحدة متحركة',
            series: [
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 900 },
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 1000 },
                { id: 'nafida', name: 'NAFIDA QWARTZ', pricePerM2: 850 }
            ]
        },
        
        // --- النوافذ القلابة - Fenêtres Soufflet ---
        'souflet': {
            name: 'Fenêtre souflet',
            nameAr: 'نافذة قلابة',
            series: [
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 750 },
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 850 },
                { id: 'nafida', name: 'NAFIDA QWARTZ', pricePerM2: 700 }
            ]
        },
        
        // --- النوافذ الثابتة - Châssis Fixe ---
        'chassis_fixe': {
            name: 'Châssis fixe',
            nameAr: 'نافذة ثابتة',
            series: [
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 600 },
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 700 },
                { id: 'nafida', name: 'NAFIDA QWARTZ', pricePerM2: 550 }
            ]
        }
    },
    
    // ========================================
    // الأبواب - Portes / Doors
    // ========================================
    doors: {
        
        'porte_1battant': {
            name: 'Porte 1 battant',
            nameAr: 'باب بضلفة واحدة',
            series: [
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 1100 },
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 1200 },
                { id: 'nafida', name: 'NAFIDA QWARTZ', pricePerM2: 1000 }
            ]
        },
        
        'porte_2battants': {
            name: 'Porte 2 battants',
            nameAr: 'باب بضلفتين',
            series: [
                { id: 'massai', name: 'MASSAI', pricePerM2: 1500 },
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 1400 },
                { id: 'nafida', name: 'NAFIDA QWARTZ', pricePerM2: 1300 }
            ]
        },
        
        'porte_sanitaire': {
            name: 'Porte sanitaire',
            nameAr: 'باب حمام',
            series: [
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 800 }
            ]
        },
        
        'porte_decorative': {
            name: 'Porte décorative',
            nameAr: 'باب ديكوري',
            series: [
                { id: 'pvc', name: 'PVC', pricePerM2: 1600 }
            ]
        },
        
        'porte_coulissante': {
            name: 'Porte coulissante',
            nameAr: 'باب منزلق',
            series: [
                { id: 'pvc', name: 'PVC', pricePerM2: 1400 },
                { id: 'comfor', name: 'COMFOR QWARTZ', pricePerM2: 1500 },
                { id: 'emreud', name: 'EMREUD QWARTZ', pricePerM2: 1350 }
            ]
        }
    },
    
    // ========================================
    // الستائر الدوارة - Volets Roulants / Shutters
    // ========================================
    shutters: {
        
        'volet_alu_qwartz': {
            name: 'Volet roulant aluminium QWARTZ',
            nameAr: 'ستارة ألمنيوم كوارتز',
            series: [
                { id: 'standard', name: 'Standard', pricePerM2: 450 },
                { id: 'motorise', name: 'Motorisé', pricePerM2: 650 }
            ]
        },
        
        'volet_pvc': {
            name: 'Volet roulant PVC',
            nameAr: 'ستارة PVC',
            series: [
                { id: 'standard', name: 'Standard', pricePerM2: 380 },
                { id: 'motorise', name: 'Motorisé', pricePerM2: 580 }
            ]
        },
        
        'volet_alu_extrude': {
            name: 'Volet roulant aluminium extrudé',
            nameAr: 'ستارة ألمنيوم مبثوق',
            series: [
                { id: 'standard', name: 'Standard', pricePerM2: 550 },
                { id: 'motorise', name: 'Motorisé', pricePerM2: 750 }
            ]
        }
    }
};

// ============ بيانات البروفيلات التفصيلية من Excel ============
const PROFILE_DATA = {
    
    // --- نافذة منزلقة EMREUD ---
    'coulissante_emreud': {
        sheetName: 'coulissante EMREUD AR',
        profiles: [
            { name: 'Dormant coulisse', nameAr: 'إطار منزلق', pricePerMeter: 57, formula: 'perimeter' },
            { name: 'Montant latéral', nameAr: 'قائم جانبي', pricePerMeter: 33, formula: 'height' },
            { name: 'Montant central', nameAr: 'قائم وسطي', pricePerMeter: 33, formula: 'height' },
            { name: 'Traverse roulette', nameAr: 'عارضة دحرجة', pricePerMeter: 33, formula: 'width' },
            { name: 'Rai', nameAr: 'سكة', pricePerMeter: 6, formula: 'width' }
        ],
        accessories: [
            { name: 'Clame coulisse', nameAr: 'مشبك منزلق', quantity: 4, unit: 'pcs', price: 6 },
            { name: 'Roulette', nameAr: 'عجلة', quantity: 4, unit: 'pcs', price: 20 },
            { name: 'Verrou coulisse', nameAr: 'قفل منزلق', quantity: 2, unit: 'pcs', price: 35 },
            { name: 'Guide', nameAr: 'دليل', quantity: 1, unit: 'pcs', price: 20 },
            { name: 'Brosse', nameAr: 'فرشاة', quantity: 8, unit: 'm', price: 3 },
            { name: 'Joint vitrage', nameAr: 'جوان زجاج', perimeter: true, price: 5 }
        ]
    },
    
    // --- نافذة منزلقة COMFOR مع تقوية ---
    'coulissante_comfor_ronfor': {
        sheetName: 'COLISSE COMFOR avec ronfor',
        profiles: [
            { name: 'Dormant coulisse', nameAr: 'إطار منزلق', pricePerMeter: 82, formula: 'perimeter' },
            { name: 'Montant latéral', nameAr: 'قائم جانبي', pricePerMeter: 89, formula: 'height' },
            { name: 'Montant central', nameAr: 'قائم وسطي', pricePerMeter: 58, formula: 'height' },
            { name: 'Traverse roulette', nameAr: 'عارضة دحرجة', pricePerMeter: 47, formula: 'width' },
            { name: 'Rai', nameAr: 'سكة', pricePerMeter: 10, formula: 'width' }
        ],
        accessories: [
            { name: 'Clame coulisse', nameAr: 'مشبك منزلق', quantity: 4, unit: 'pcs', price: 8 },
            { name: 'Roulette REGLABLE', nameAr: 'عجلة قابلة للضبط', quantity: 4, unit: 'pcs', price: 38 },
            { name: 'Verrou coulisse', nameAr: 'قفل منزلق', quantity: 2, unit: 'pcs', price: 56 },
            { name: 'Guide', nameAr: 'دليل', quantity: 1, unit: 'pcs', price: 30 },
            { name: 'Brosse', nameAr: 'فرشاة', quantity: 10, unit: 'm', price: 3 },
            { name: 'Joint vitrage', nameAr: 'جوان زجاج', perimeter: true, price: 5 }
        ]
    },
    
    // --- نافذة منزلقة COMFOR بدون تقوية ---
    'coulissante_comfor_sans': {
        sheetName: 'coulisse COMFOR sans ronfor',
        profiles: [
            { name: 'Dormant coulisse', nameAr: 'إطار منزلق', pricePerMeter: 82, formula: 'perimeter' },
            { name: 'Montant latéral', nameAr: 'قائم جانبي', pricePerMeter: 47, formula: 'height' },
            { name: 'Montant central', nameAr: 'قائم وسطي', pricePerMeter: 58, formula: 'height' },
            { name: 'Traverse roulette', nameAr: 'عارضة دحرجة', pricePerMeter: 47, formula: 'width' },
            { name: 'Rai', nameAr: 'سكة', pricePerMeter: 10, formula: 'width' }
        ],
        accessories: [
            { name: 'Clame coulisse', nameAr: 'مشبك منزلق', quantity: 4, unit: 'pcs', price: 8 },
            { name: 'Roulette REGLABLE', nameAr: 'عجلة قابلة للضبط', quantity: 4, unit: 'pcs', price: 38 },
            { name: 'Verrou coulisse', nameAr: 'قفل منزلق', quantity: 2, unit: 'pcs', price: 56 },
            { name: 'Guide', nameAr: 'دليل', quantity: 1, unit: 'pcs', price: 30 },
            { name: 'Brosse', nameAr: 'فرشاة', quantity: 10, unit: 'm', price: 3 }
        ]
    },
    
    // --- نافذة منزلقة مع صندوق ستارة COMFOR ---
    'coulissante_cache_comfor': {
        sheetName: 'coul cache ridoux COMFOR',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 82, formula: 'perimeter' },
            { name: 'Coffre', nameAr: 'صندوق', pricePerMeter: 85, formula: 'width' },
            { name: 'Montant latéral', nameAr: 'قائم جانبي', pricePerMeter: 89, formula: 'height' },
            { name: 'Montant central', nameAr: 'قائم وسطي', pricePerMeter: 58, formula: 'height' },
            { name: 'Traverse roulette', nameAr: 'عارضة دحرجة', pricePerMeter: 47, formula: 'width' }
        ],
        accessories: [
            { name: 'Clame coulisse', nameAr: 'مشبك منزلق', quantity: 4, unit: 'pcs', price: 8 },
            { name: 'Roulette', nameAr: 'عجلة', quantity: 4, unit: 'pcs', price: 38 },
            { name: 'Verrou', nameAr: 'قفل', quantity: 2, unit: 'pcs', price: 56 }
        ]
    },
    
    // --- نافذة منزلقة مع صندوق ستارة EMREUD ---
    'coulissante_cache_emreud': {
        sheetName: 'coul cache ridoux EMREUDE',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 57, formula: 'perimeter' },
            { name: 'Coffre', nameAr: 'صندوق', pricePerMeter: 65, formula: 'width' },
            { name: 'Montant latéral', nameAr: 'قائم جانبي', pricePerMeter: 33, formula: 'height' },
            { name: 'Montant central', nameAr: 'قائم وسطي', pricePerMeter: 33, formula: 'height' },
            { name: 'Traverse roulette', nameAr: 'عارضة دحرجة', pricePerMeter: 33, formula: 'width' }
        ],
        accessories: [
            { name: 'Clame coulisse', nameAr: 'مشبك منزلق', quantity: 4, unit: 'pcs', price: 6 },
            { name: 'Roulette', nameAr: 'عجلة', quantity: 4, unit: 'pcs', price: 20 },
            { name: 'Verrou', nameAr: 'قفل', quantity: 2, unit: 'pcs', price: 35 }
        ]
    },
    
    // --- نافذة OF بضلفتين EMREUD ---
    'of_2battants_emreud': {
        sheetName: 'OF 2 battants EMREUD',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 57, formula: 'perimeter' },
            { name: 'Ouvrant', nameAr: 'ضلفة', pricePerMeter: 39, formula: 'perimeter_double' },
            { name: 'Parclose', nameAr: 'حشوة', pricePerMeter: 10, formula: 'perimeter_double' }
        ],
        accessories: [
            { name: 'Paumelle', nameAr: 'مفصل', quantity: 4, unit: 'pcs', price: 30 },
            { name: 'Crémone', nameAr: 'كريمون', quantity: 2, unit: 'pcs', price: 85 },
            { name: 'Poignée', nameAr: 'مقبض', quantity: 2, unit: 'pcs', price: 45 },
            { name: 'Joint', nameAr: 'جوان', perimeter: true, price: 8 }
        ]
    },
    
    // --- نافذة OF بضلفتين COMFOR ---
    'of_2battants_comfor': {
        sheetName: 'OF 2 battants COMFOR',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 82, formula: 'perimeter' },
            { name: 'Ouvrant', nameAr: 'ضلفة', pricePerMeter: 89, formula: 'perimeter_double' },
            { name: 'Parclose', nameAr: 'حشوة', pricePerMeter: 15, formula: 'perimeter_double' }
        ],
        accessories: [
            { name: 'Paumelle', nameAr: 'مفصل', quantity: 4, unit: 'pcs', price: 45 },
            { name: 'Crémone', nameAr: 'كريمون', quantity: 2, unit: 'pcs', price: 120 },
            { name: 'Poignée', nameAr: 'مقبض', quantity: 2, unit: 'pcs', price: 65 },
            { name: 'Joint', nameAr: 'جوان', perimeter: true, price: 10 }
        ]
    },
    
    // --- نافذة OF بضلفة واحدة ---
    'of_1battant': {
        sheetName: 'OF 1 battant',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 57, formula: 'perimeter' },
            { name: 'Ouvrant', nameAr: 'ضلفة', pricePerMeter: 39, formula: 'perimeter' },
            { name: 'Parclose', nameAr: 'حشوة', pricePerMeter: 10, formula: 'perimeter' }
        ],
        accessories: [
            { name: 'Paumelle', nameAr: 'مفصل', quantity: 2, unit: 'pcs', price: 30 },
            { name: 'Crémone', nameAr: 'كريمون', quantity: 1, unit: 'pcs', price: 85 },
            { name: 'Poignée', nameAr: 'مقبض', quantity: 1, unit: 'pcs', price: 45 }
        ]
    },
    
    // --- نافذة قلابة Souflet ---
    'souflet': {
        sheetName: 'souflet',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 57, formula: 'perimeter' },
            { name: 'Ouvrant', nameAr: 'ضلفة', pricePerMeter: 39, formula: 'perimeter' }
        ],
        accessories: [
            { name: 'Compas', nameAr: 'بوصلة', quantity: 2, unit: 'pcs', price: 55 },
            { name: 'Limiteur', nameAr: 'محدد', quantity: 1, unit: 'pcs', price: 35 },
            { name: 'Poignée', nameAr: 'مقبض', quantity: 1, unit: 'pcs', price: 45 }
        ]
    },
    
    // --- نافذة ثابتة ---
    'chassis_fixe': {
        sheetName: 'chassis fixe',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 57, formula: 'perimeter' },
            { name: 'Parclose', nameAr: 'حشوة', pricePerMeter: 10, formula: 'perimeter' }
        ],
        accessories: [
            { name: 'Joint', nameAr: 'جوان', perimeter: true, price: 5 }
        ]
    },
    
    // --- باب بضلفة واحدة ---
    'porte_1battant': {
        sheetName: 'porte 1 battant',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 82, formula: 'perimeter' },
            { name: 'Ouvrant', nameAr: 'ضلفة', pricePerMeter: 89, formula: 'perimeter' },
            { name: 'Parclose', nameAr: 'حشوة', pricePerMeter: 15, formula: 'perimeter' }
        ],
        accessories: [
            { name: 'Paumelle lourde', nameAr: 'مفصل ثقيل', quantity: 3, unit: 'pcs', price: 65 },
            { name: 'Serrure', nameAr: 'قفل', quantity: 1, unit: 'pcs', price: 180 },
            { name: 'Poignée', nameAr: 'مقبض', quantity: 1, unit: 'pcs', price: 120 },
            { name: 'Seuil', nameAr: 'عتبة', width: true, price: 85 }
        ]
    },
    
    // --- باب بضلفتين ---
    'porte_2battants': {
        sheetName: 'porte 2 battants',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 95, formula: 'perimeter' },
            { name: 'Ouvrant', nameAr: 'ضلفة', pricePerMeter: 105, formula: 'perimeter_double' },
            { name: 'Parclose', nameAr: 'حشوة', pricePerMeter: 18, formula: 'perimeter_double' }
        ],
        accessories: [
            { name: 'Paumelle lourde', nameAr: 'مفصل ثقيل', quantity: 6, unit: 'pcs', price: 65 },
            { name: 'Serrure', nameAr: 'قفل', quantity: 1, unit: 'pcs', price: 250 },
            { name: 'Verrou haut/bas', nameAr: 'قفل علوي/سفلي', quantity: 2, unit: 'pcs', price: 85 },
            { name: 'Seuil', nameAr: 'عتبة', width: true, price: 120 }
        ]
    },
    
    // --- باب حمام ---
    'porte_sanitaire': {
        sheetName: 'porte sanitaire',
        profiles: [
            { name: 'Dormant', nameAr: 'إطار', pricePerMeter: 57, formula: 'perimeter' },
            { name: 'Ouvrant', nameAr: 'ضلفة', pricePerMeter: 39, formula: 'perimeter' }
        ],
        accessories: [
            { name: 'Paumelle', nameAr: 'مفصل', quantity: 2, unit: 'pcs', price: 30 },
            { name: 'Serrure WC', nameAr: 'قفل حمام', quantity: 1, unit: 'pcs', price: 65 },
            { name: 'Poignée', nameAr: 'مقبض', quantity: 1, unit: 'pcs', price: 45 }
        ]
    },
    
    // --- ستارة ألمنيوم ---
    'volet_alu': {
        sheetName: 'volet qwartz',
        profiles: [
            { name: 'Coulisse', nameAr: 'سكة', pricePerMeter: 35, formula: 'height_double' },
            { name: 'Tablier', nameAr: 'ستارة', pricePerMeter: 85, formula: 'area' },
            { name: 'Lame finale', nameAr: 'شريحة نهائية', pricePerMeter: 25, formula: 'width' }
        ],
        accessories: [
            { name: 'Axe', nameAr: 'محور', quantity: 1, unit: 'pcs', price: 120 },
            { name: 'Manivelle', nameAr: 'يد تدوير', quantity: 1, unit: 'pcs', price: 85 },
            { name: 'Attache', nameAr: 'رابط', quantity: 2, unit: 'pcs', price: 15 }
        ]
    },
    
    // --- ستارة PVC ---
    'volet_pvc': {
        sheetName: 'volet pvc',
        profiles: [
            { name: 'Coulisse', nameAr: 'سكة', pricePerMeter: 28, formula: 'height_double' },
            { name: 'Tablier PVC', nameAr: 'ستارة PVC', pricePerMeter: 65, formula: 'area' },
            { name: 'Lame finale', nameAr: 'شريحة نهائية', pricePerMeter: 18, formula: 'width' }
        ],
        accessories: [
            { name: 'Axe', nameAr: 'محور', quantity: 1, unit: 'pcs', price: 95 },
            { name: 'Sangle', nameAr: 'حزام', quantity: 1, unit: 'pcs', price: 45 },
            { name: 'Enrouleur', nameAr: 'ملف', quantity: 1, unit: 'pcs', price: 35 }
        ]
    },
    
    // --- ستارة ألمنيوم مبثوق ---
    'volet_extrude': {
        sheetName: 'volet extrude',
        profiles: [
            { name: 'Coulisse renforcée', nameAr: 'سكة مقواة', pricePerMeter: 45, formula: 'height_double' },
            { name: 'Tablier extrudé', nameAr: 'ستارة مبثوقة', pricePerMeter: 110, formula: 'area' },
            { name: 'Lame finale', nameAr: 'شريحة نهائية', pricePerMeter: 30, formula: 'width' }
        ],
        accessories: [
            { name: 'Axe renforcé', nameAr: 'محور مقوى', quantity: 1, unit: 'pcs', price: 180 },
            { name: 'Manivelle', nameAr: 'يد تدوير', quantity: 1, unit: 'pcs', price: 95 },
            { name: 'Attache', nameAr: 'رابط', quantity: 2, unit: 'pcs', price: 20 }
        ]
    }
};

// ============ دالة حساب السعر ============
function calculateProductPrice(productKey, seriesId, width, height, glassType) {
    const widthM = width / 100;
    const heightM = height / 100;
    const area = widthM * heightM;
    const perimeter = 2 * (widthM + heightM);
    
    let totalPrice = 0;
    
    // Get profile data if available
    const profile = PROFILE_DATA[productKey];
    if (profile) {
        // Calculate profiles cost
        profile.profiles.forEach(p => {
            let length = 0;
            switch(p.formula) {
                case 'perimeter': length = perimeter; break;
                case 'perimeter_double': length = perimeter * 2; break;
                case 'height': length = heightM; break;
                case 'height_double': length = heightM * 2; break;
                case 'width': length = widthM; break;
                case 'area': length = area; break;
            }
            totalPrice += p.pricePerMeter * length;
        });
        
        // Calculate accessories cost
        profile.accessories.forEach(a => {
            if (a.perimeter) {
                totalPrice += a.price * perimeter;
            } else if (a.width) {
                totalPrice += a.price * widthM;
            } else {
                totalPrice += a.price * a.quantity;
            }
        });
    } else {
        // Use base price per m² from PRODUCTS
        totalPrice = area * 800; // Default
    }
    
    // Add glass cost
    if (glassType && GLASS_TYPES[glassType]) {
        totalPrice += GLASS_TYPES[glassType].price * area;
    }
    
    return Math.round(totalPrice);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GLASS_TYPES, PRODUCTS, PROFILE_DATA, COMPANY_INFO_DEFAULTS, calculateProductPrice };
}
