// ================================
// Gold PVC - Multi-Store Admin System V7
// ================================

// ============ USER MANAGEMENT ============
const DEFAULT_USERS = {
    admin: {
        password: 'admin123',
        role: 'admin',
        name: 'Directeur Général',
        storeId: null
    },
    store1: {
        password: 'store123',
        role: 'store',
        name: 'مسؤول المحل 1',
        storeId: 'store1'
    },
    store2: {
        password: 'store123',
        role: 'store',
        name: 'مسؤول المحل 2',
        storeId: 'store2'
    },
    store3: {
        password: 'store123',
        role: 'store',
        name: 'مسؤول المحل 3',
        storeId: 'store3'
    }
};

const DEFAULT_STORES = {
    store1: { name: 'محل 1', city: 'الدار البيضاء' },
    store2: { name: 'محل 2', city: 'الرباط' },
    store3: { name: 'محل 3', city: 'مراكش' }
};

const DEFAULT_COMPANY = {
    name: 'GOLD PVC SARL',
    address: 'Zone Industrielle, Casablanca, Maroc',
    phone: '05XX-XXXXXX',
    email: 'contact@goldpvc.ma',
    ice: '000000000000000',
    logo: null
};

// ============ STATE MANAGEMENT ============
let currentUser = null;
let users = {};
let stores = {};
let companySettings = {};
let clients = [];
let quotes = [];
let activityLog = [];
let currentQuoteItems = [];
let lastCalculation = null;
let editingQuoteId = null;
let currentViewingQuote = null;

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    initializeEventListeners();
    initializeGlassTypes();
    updateDate();
    
    const savedUser = sessionStorage.getItem('goldpvc_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
});

function loadAllData() {
    const savedUsers = localStorage.getItem('goldpvc_users');
    users = savedUsers ? JSON.parse(savedUsers) : { ...DEFAULT_USERS };
    
    const savedStores = localStorage.getItem('goldpvc_stores');
    stores = savedStores ? JSON.parse(savedStores) : { ...DEFAULT_STORES };
    
    const savedCompany = localStorage.getItem('goldpvc_company');
    companySettings = savedCompany ? JSON.parse(savedCompany) : { ...DEFAULT_COMPANY };
    
    const savedClients = localStorage.getItem('goldpvc_clients');
    clients = savedClients ? JSON.parse(savedClients) : [];
    
    const savedQuotes = localStorage.getItem('goldpvc_quotes');
    quotes = savedQuotes ? JSON.parse(savedQuotes) : [];
    
    const savedActivity = localStorage.getItem('goldpvc_activity');
    activityLog = savedActivity ? JSON.parse(savedActivity) : [];
}

function saveAllData() {
    localStorage.setItem('goldpvc_users', JSON.stringify(users));
    localStorage.setItem('goldpvc_stores', JSON.stringify(stores));
    localStorage.setItem('goldpvc_company', JSON.stringify(companySettings));
    localStorage.setItem('goldpvc_clients', JSON.stringify(clients));
    localStorage.setItem('goldpvc_quotes', JSON.stringify(quotes));
    localStorage.setItem('goldpvc_activity', JSON.stringify(activityLog));
}

// ============ EVENT LISTENERS ============
function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            if (section) {
                showSection(section);
            }
        });
    });
    
    // Logo upload area
    const logoUploadArea = document.getElementById('logoUploadArea');
    if (logoUploadArea) {
        logoUploadArea.addEventListener('click', () => document.getElementById('logoInput').click());
        logoUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            logoUploadArea.classList.add('dragover');
        });
        logoUploadArea.addEventListener('dragleave', () => {
            logoUploadArea.classList.remove('dragover');
        });
        logoUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            logoUploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleLogoFile(e.dataTransfer.files[0]);
            }
        });
    }
}

function addEvent(id, event, handler) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, handler);
    }
}

// ============ AUTHENTICATION ============
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');
    
    if (!users[username]) {
        errorEl.textContent = 'Utilisateur non trouvé / المستخدم غير موجود';
        return;
    }
    
    if (users[username].password !== password) {
        errorEl.textContent = 'Mot de passe incorrect / كلمة المرور غير صحيحة';
        return;
    }
    
    currentUser = {
        username,
        ...users[username]
    };
    
    sessionStorage.setItem('goldpvc_current_user', JSON.stringify(currentUser));
    
    logActivity('login', `Connexion: ${currentUser.name}`, currentUser.storeId || 'admin');
    
    showDashboard();
}

function logout() {
    if (currentUser) {
        logActivity('login', `Déconnexion: ${currentUser.name}`, currentUser.storeId || 'admin');
    }
    
    currentUser = null;
    sessionStorage.removeItem('goldpvc_current_user');
    
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.body.classList.remove('is-admin');
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
}

function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Update UI with user info
    document.getElementById('currentUserName').textContent = currentUser.name;
    document.getElementById('welcomeUserName').textContent = currentUser.name;
    document.getElementById('currentUserRole').textContent = currentUser.role === 'admin' ? 'Administrateur' : 'Responsable Magasin';
    
    const storeName = currentUser.storeId ? stores[currentUser.storeId]?.name : 'Administration';
    document.getElementById('currentStoreName').textContent = storeName;
    
    // Admin specific UI
    if (currentUser.role === 'admin') {
        document.body.classList.add('is-admin');
    } else {
        document.body.classList.remove('is-admin');
    }
    
    // Load initial data
    showSection('dashboard');
    loadSettings();
}

// ============ NAVIGATION ============
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update title
    const titles = {
        dashboard: 'Tableau de Bord / لوحة التحكم',
        calculator: 'Calculateur / حاسبة الأسعار',
        clients: 'Clients / العملاء',
        quotes: 'Devis & Factures / الفواتير',
        installations: 'Installations / التركيبات',
        activity: 'Journal d\'Activité / سجل النشاط',
        settings: 'Paramètres / الإعدادات'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || sectionName;
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'clients':
            renderClientsTable();
            break;
        case 'quotes':
            renderQuotesGrid();
            break;
        case 'installations':
            renderInstallationsList();
            break;
        case 'activity':
            renderActivityTimeline();
            break;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    sidebar.classList.toggle('collapsed');
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('fr-FR', options);
}

// ============ DASHBOARD STATISTICS ============
function updateDashboardStats() {
    const filteredQuotes = getFilteredQuotes();
    const filteredClients = getFilteredClients();
    
    // Basic stats
    document.getElementById('totalInvoices').textContent = filteredQuotes.length;
    document.getElementById('totalClients').textContent = filteredClients.length;
    
    // Revenue calculations
    const totalRevenue = filteredQuotes.reduce((sum, q) => sum + (q.total || 0), 0);
    const totalPaid = filteredQuotes.reduce((sum, q) => sum + (q.paid || 0), 0);
    const pending = totalRevenue - totalPaid;
    
    document.getElementById('totalRevenue').textContent = formatNumber(totalRevenue);
    document.getElementById('pendingPayments').textContent = formatNumber(pending);
    
    // Installation stats
    const installed = filteredQuotes.filter(q => q.installStatus === 'installed').length;
    const pendingInstall = filteredQuotes.filter(q => q.installStatus === 'pending' || !q.installStatus).length;
    const totalQuotes = filteredQuotes.length || 1;
    
    document.getElementById('totalInstalled').textContent = installed;
    document.getElementById('totalPendingInstall').textContent = pendingInstall;
    
    const installedPercent = Math.round((installed / totalQuotes) * 100);
    const pendingPercent = Math.round((pendingInstall / totalQuotes) * 100);
    
    document.getElementById('installedProgress').style.width = installedPercent + '%';
    document.getElementById('installedPercent').textContent = installedPercent + '%';
    document.getElementById('pendingInstallProgress').style.width = pendingPercent + '%';
    document.getElementById('pendingInstallPercent').textContent = pendingPercent + '%';
    
    // Payment status donut chart
    updatePaymentDonut(filteredQuotes);
    
    // Installation chart
    updateInstallationChart(filteredQuotes);
    
    // Top products
    updateTopProducts(filteredQuotes);
    
    // Store performance (admin only)
    if (currentUser.role === 'admin') {
        updateStoresPerformance();
    }
    
    // Recent items
    updateRecentInvoices(filteredQuotes);
    updateRecentClients(filteredClients);
}

function updatePaymentDonut(quotes) {
    const paid = quotes.filter(q => q.status === 'paid').length;
    const partial = quotes.filter(q => q.status === 'partial').length;
    const unpaid = quotes.filter(q => q.status === 'unpaid').length;
    const total = quotes.length || 1;
    
    document.getElementById('donutTotal').textContent = total;
    document.getElementById('paidCount').textContent = paid;
    document.getElementById('partialCount').textContent = partial;
    document.getElementById('unpaidCount').textContent = unpaid;
    
    const circumference = 2 * Math.PI * 40; // 251.2
    
    const paidPercent = paid / total;
    const partialPercent = partial / total;
    const unpaidPercent = unpaid / total;
    
    const paidSegment = document.getElementById('paidSegment');
    const partialSegment = document.getElementById('partialSegment');
    const unpaidSegment = document.getElementById('unpaidSegment');
    
    if (paidSegment) {
        paidSegment.style.strokeDasharray = `${paidPercent * circumference} ${circumference}`;
        paidSegment.style.strokeDashoffset = '0';
    }
    
    if (partialSegment) {
        partialSegment.style.strokeDasharray = `${partialPercent * circumference} ${circumference}`;
        partialSegment.style.strokeDashoffset = `-${paidPercent * circumference}`;
    }
    
    if (unpaidSegment) {
        unpaidSegment.style.strokeDasharray = `${unpaidPercent * circumference} ${circumference}`;
        unpaidSegment.style.strokeDashoffset = `-${(paidPercent + partialPercent) * circumference}`;
    }
}

function updateInstallationChart(quotes) {
    const installed = quotes.filter(q => q.installStatus === 'installed').length;
    const pending = quotes.filter(q => q.installStatus === 'pending' || !q.installStatus).length;
    const cancelled = quotes.filter(q => q.installStatus === 'cancelled').length;
    const total = quotes.length || 1;
    
    const installedPercent = (installed / total) * 100;
    const pendingPercent = (pending / total) * 100;
    const cancelledPercent = (cancelled / total) * 100;
    
    document.getElementById('installCompleteCount').textContent = installed;
    document.getElementById('installPendingCount').textContent = pending;
    document.getElementById('installCancelledCount').textContent = cancelled;
    
    document.getElementById('installCompletePercent').textContent = Math.round(installedPercent) + '%';
    document.getElementById('installPendingPercent').textContent = Math.round(pendingPercent) + '%';
    document.getElementById('installCancelledPercent').textContent = Math.round(cancelledPercent) + '%';
    
    document.getElementById('progressInstalled').style.width = installedPercent + '%';
    document.getElementById('progressPending').style.width = pendingPercent + '%';
    document.getElementById('progressCancelled').style.width = cancelledPercent + '%';
}

function updateTopProducts(quotes) {
    const productCounts = {};
    
    quotes.forEach(quote => {
        if (quote.items) {
            quote.items.forEach(item => {
                const name = item.type || item.name || 'Produit';
                productCounts[name] = (productCounts[name] || 0) + (item.quantity || 1);
            });
        }
    });
    
    const sorted = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const maxCount = sorted[0]?.[1] || 1;
    const container = document.getElementById('topProductsList');
    
    if (sorted.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Aucun produit vendu / لا توجد منتجات</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sorted.map(([name, count], index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const percentage = (count / maxCount) * 100;
        
        return `
            <div class="product-item">
                <div class="product-rank ${rankClass}">${index + 1}</div>
                <div class="product-info">
                    <span class="product-name">${name}</span>
                    <div class="product-bar">
                        <div class="product-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <span class="product-count">${count}</span>
            </div>
        `;
    }).join('');
}

function updateStoresPerformance() {
    const container = document.getElementById('storesPerformance');
    if (!container) return;
    
    const storeStats = {};
    
    ['store1', 'store2', 'store3'].forEach(storeId => {
        const storeQuotes = quotes.filter(q => q.storeId === storeId);
        const storeClients = clients.filter(c => c.storeId === storeId);
        
        storeStats[storeId] = {
            invoices: storeQuotes.length,
            clients: storeClients.length,
            revenue: storeQuotes.reduce((sum, q) => sum + (q.total || 0), 0),
            installed: storeQuotes.filter(q => q.installStatus === 'installed').length
        };
    });
    
    container.innerHTML = Object.entries(storeStats).map(([storeId, stats]) => {
        const storeName = stores[storeId]?.name || storeId;
        const storeCity = stores[storeId]?.city || '';
        
        return `
            <div class="store-card">
                <div class="store-card-header">
                    <div class="store-card-icon">
                        <i class="fas fa-store"></i>
                    </div>
                    <div class="store-card-info">
                        <h4>${storeName}</h4>
                        <span>${storeCity}</span>
                    </div>
                </div>
                <div class="store-stats">
                    <div class="store-stat">
                        <div class="store-stat-value">${stats.invoices}</div>
                        <div class="store-stat-label">Factures / فواتير</div>
                    </div>
                    <div class="store-stat">
                        <div class="store-stat-value">${stats.clients}</div>
                        <div class="store-stat-label">Clients / عملاء</div>
                    </div>
                    <div class="store-stat">
                        <div class="store-stat-value">${formatNumber(stats.revenue)}</div>
                        <div class="store-stat-label">Revenus (MAD)</div>
                    </div>
                    <div class="store-stat">
                        <div class="store-stat-value">${stats.installed}</div>
                        <div class="store-stat-label">Installés / مركب</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateRecentInvoices(quotes) {
    const container = document.getElementById('recentInvoicesList');
    const recent = [...quotes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Aucune facture / لا توجد فواتير</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recent.map(quote => {
        const client = clients.find(c => c.id === quote.clientId);
        const statusClass = quote.status || 'unpaid';
        const statusText = {
            paid: 'Payé / مدفوع',
            partial: 'Partiel / جزئي',
            unpaid: 'Impayé / غير مدفوع'
        }[statusClass];
        
        return `
            <div class="recent-item" onclick="viewQuote('${quote.id}')">
                <div class="recent-item-icon invoice">
                    <i class="fas fa-file-invoice"></i>
                </div>
                <div class="recent-item-info">
                    <div class="recent-item-title">${client?.name || 'Client inconnu'}</div>
                    <div class="recent-item-subtitle">${formatNumber(quote.total)} MAD - ${formatDate(quote.date)}</div>
                </div>
                <span class="recent-item-badge ${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
}

function updateRecentClients(clientsList) {
    const container = document.getElementById('recentClientsList');
    const recent = [...clientsList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>Aucun client / لا يوجد عملاء</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recent.map(client => `
        <div class="recent-item">
            <div class="recent-item-icon client">
                <i class="fas fa-user"></i>
            </div>
            <div class="recent-item-info">
                <div class="recent-item-title">${client.name}</div>
                <div class="recent-item-subtitle">${client.phone} - ${client.city || 'N/A'}</div>
            </div>
        </div>
    `).join('');
}

// ============ DATA FILTERING ============
function getFilteredQuotes() {
    if (currentUser.role === 'admin') {
        return quotes;
    }
    return quotes.filter(q => q.storeId === currentUser.storeId);
}

function getFilteredClients() {
    if (currentUser.role === 'admin') {
        return clients;
    }
    return clients.filter(c => c.storeId === currentUser.storeId);
}

// ============ CLIENTS MANAGEMENT ============
function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    const filteredClients = getFilteredClients();
    const searchTerm = document.getElementById('clientSearch')?.value?.toLowerCase() || '';
    const storeFilter = document.getElementById('clientStoreFilter')?.value || 'all';
    
    let displayClients = filteredClients;
    
    if (searchTerm) {
        displayClients = displayClients.filter(c => 
            c.name?.toLowerCase().includes(searchTerm) ||
            c.phone?.includes(searchTerm) ||
            c.city?.toLowerCase().includes(searchTerm)
        );
    }
    
    if (storeFilter !== 'all' && currentUser.role === 'admin') {
        displayClients = displayClients.filter(c => c.storeId === storeFilter);
    }
    
    if (displayClients.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    <div class="empty-message">
                        <i class="fas fa-users"></i>
                        <p>Aucun client trouvé / لم يتم العثور على عملاء</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = displayClients.map(client => {
        const clientQuotes = quotes.filter(q => q.clientId === client.id);
        const totalPurchases = clientQuotes.reduce((sum, q) => sum + (q.total || 0), 0);
        const totalPaid = clientQuotes.reduce((sum, q) => sum + (q.paid || 0), 0);
        const balance = totalPurchases - totalPaid;
        const storeName = stores[client.storeId]?.name || client.storeId;
        
        const isAdmin = currentUser && currentUser.role === 'admin';
        const deleteBtn = isAdmin ? `
            <button class="btn btn-sm btn-danger" onclick="deleteClient('${client.id}')" title="Supprimer">
                <i class="fas fa-trash"></i>
            </button>
        ` : '';
        
        return `
            <tr>
                <td><strong>${client.name}</strong></td>
                <td>${client.phone}</td>
                <td>${client.city || '-'}</td>
                <td>${formatNumber(totalPurchases)} MAD</td>
                <td class="${balance > 0 ? 'text-danger' : 'text-success'}">
                    ${formatNumber(balance)} MAD
                </td>
                <td class="admin-only">${storeName}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editClient('${client.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${deleteBtn}
                </td>
            </tr>
        `;
    }).join('');
}

function filterClients() {
    renderClientsTable();
}

function showAddClientModal() {
    document.getElementById('clientModalTitle').textContent = 'Nouveau Client / عميل جديد';
    document.getElementById('clientForm').reset();
    document.getElementById('editClientId').value = '';
    openModal('clientModal');
}

function editClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    document.getElementById('clientModalTitle').textContent = 'Modifier Client / تعديل العميل';
    document.getElementById('editClientId').value = clientId;
    document.getElementById('clientName').value = client.name || '';
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientEmail').value = client.email || '';
    document.getElementById('clientCity').value = client.city || '';
    document.getElementById('clientAddress').value = client.address || '';
    
    openModal('clientModal');
}

function saveClient() {
    const id = document.getElementById('editClientId').value;
    const clientData = {
        name: document.getElementById('clientName').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        email: document.getElementById('clientEmail').value.trim(),
        city: document.getElementById('clientCity').value.trim(),
        address: document.getElementById('clientAddress').value.trim(),
        storeId: currentUser.storeId || 'store1'
    };
    
    if (!clientData.name || !clientData.phone) {
        showToast('Veuillez remplir les champs obligatoires / يرجى ملء الحقول المطلوبة', 'error');
        return;
    }
    
    if (id) {
        // Update existing client
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...clientData };
            logActivity('client', `Client modifié: ${clientData.name}`, currentUser.storeId || 'admin');
        }
    } else {
        // Create new client
        const newClient = {
            id: generateId(),
            ...clientData,
            createdAt: new Date().toISOString()
        };
        clients.push(newClient);
        logActivity('client', `Nouveau client: ${clientData.name}`, currentUser.storeId || 'admin');
    }
    
    saveAllData();
    closeModal('clientModal');
    renderClientsTable();
    updateDashboardStats();
    showToast('Client enregistré / تم حفظ العميل', 'success');
}

function deleteClient(clientId) {
    // Only admin can delete
    if (!currentUser || currentUser.role !== 'admin') {
        showToast('⛔ Seul l\'admin peut supprimer / فقط المدير يمكنه الحذف', 'error');
        return;
    }
    
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    if (!confirm(`Supprimer le client "${client.name}"? / حذف العميل "${client.name}"؟`)) return;
    
    clients = clients.filter(c => c.id !== clientId);
    logActivity('client', `Client supprimé: ${client.name}`, 'admin');
    
    saveAllData();
    renderClientsTable();
    updateDashboardStats();
    showToast('Client supprimé / تم حذف العميل', 'success');
}

// ============ CALCULATOR ============
function initializeGlassTypes() {
    const glassSelect = document.getElementById('glassSelect');
    if (!glassSelect || typeof GLASS_TYPES === 'undefined') return;
    
    glassSelect.innerHTML = '<option value="">-- Sélectionner / اختر --</option>';
    
    GLASS_TYPES.forEach((glass, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${glass.name} (${glass.thickness}) - ${glass.price} MAD/m²`;
        glassSelect.appendChild(option);
    });
}

function updateTypes() {
    const category = document.getElementById('categorySelect').value;
    const typeSelect = document.getElementById('typeSelect');
    
    typeSelect.innerHTML = '<option value="">-- Sélectionner / اختر --</option>';
    document.getElementById('seriesSelect').innerHTML = '<option value="">-- Sélectionner / اختر --</option>';
    
    if (!category || typeof PRODUCTS === 'undefined') return;
    
    const categoryProducts = PRODUCTS[category];
    if (!categoryProducts) return;
    
    Object.entries(categoryProducts).forEach(([key, product]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${product.name} - ${product.nameAr}`;
        typeSelect.appendChild(option);
    });
}

function updateSeries() {
    const category = document.getElementById('categorySelect').value;
    const type = document.getElementById('typeSelect').value;
    const seriesSelect = document.getElementById('seriesSelect');
    
    seriesSelect.innerHTML = '<option value="">-- Sélectionner / اختر --</option>';
    
    if (!category || !type || typeof PRODUCTS === 'undefined') return;
    
    const typeData = PRODUCTS[category]?.[type];
    if (!typeData || !typeData.series) return;
    
    typeData.series.forEach(series => {
        const option = document.createElement('option');
        option.value = series.id;
        option.textContent = `${series.name} - ${series.pricePerM2} MAD/m²`;
        option.dataset.price = series.pricePerM2;
        seriesSelect.appendChild(option);
    });
}

function calculatePrice() {
    const category = document.getElementById('categorySelect').value;
    const type = document.getElementById('typeSelect').value;
    const seriesId = document.getElementById('seriesSelect').value;
    const glassIndex = document.getElementById('glassSelect').value;
    const width = parseFloat(document.getElementById('widthInput').value) || 0;
    const height = parseFloat(document.getElementById('heightInput').value) || 0;
    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    
    const resultBox = document.getElementById('calcResult');
    
    if (!category || !type || !width || !height) {
        resultBox.innerHTML = `
            <p class="result-placeholder">Veuillez remplir tous les champs obligatoires</p>
            <p class="result-placeholder">يرجى ملء جميع الحقول المطلوبة</p>
        `;
        return;
    }
    
    // Calculate area in m²
    const areaM2 = (width / 100) * (height / 100);
    
    // Get glass price
    let glassPrice = 0;
    let glassName = 'Sans vitrage';
    if (glassIndex !== '' && typeof GLASS_TYPES !== 'undefined') {
        const glass = GLASS_TYPES[parseInt(glassIndex)];
        if (glass) {
            glassPrice = glass.price * areaM2;
            glassName = glass.name;
        }
    }
    
    // Get product and series info
    const product = PRODUCTS[category]?.[type];
    const productName = product?.name || type;
    const productNameAr = product?.nameAr || '';
    
    // Get series price
    let basePrice = areaM2 * 800; // Default fallback
    let seriesName = 'Standard';
    
    if (seriesId && product?.series) {
        const seriesInfo = product.series.find(s => s.id === seriesId);
        if (seriesInfo) {
            basePrice = areaM2 * seriesInfo.pricePerM2;
            seriesName = seriesInfo.name;
        }
    }
    
    const unitPrice = basePrice + glassPrice;
    const totalPrice = unitPrice * quantity;
    
    lastCalculation = {
        category,
        type: productName,
        typeAr: productNameAr,
        series: seriesName,
        glassName,
        width,
        height,
        quantity,
        unitPrice,
        totalPrice
    };
    
    resultBox.innerHTML = `
        <div class="result-details">
            <p><strong>Produit:</strong> ${productName}</p>
            <p><strong>المنتج:</strong> ${productNameAr}</p>
            <p><strong>Série:</strong> ${seriesName}</p>
            <p><strong>Vitrage:</strong> ${glassName}</p>
            <p><strong>Dimensions:</strong> ${width} × ${height} cm</p>
            <p><strong>Surface:</strong> ${areaM2.toFixed(2)} m²</p>
            <p><strong>Quantité:</strong> ${quantity}</p>
            <hr>
            <p><strong>Prix unitaire:</strong> ${formatNumber(unitPrice)} MAD</p>
            <p class="result-total"><strong>Total:</strong> ${formatNumber(totalPrice)} MAD</p>
        </div>
    `;
}

function addToQuote() {
    if (!lastCalculation) {
        showToast('Calculez d\'abord le prix / احسب السعر أولاً', 'warning');
        return;
    }
    
    currentQuoteItems.push({
        id: generateId(),
        ...lastCalculation
    });
    
    renderQuoteItems();
    showToast('Article ajouté / تمت الإضافة', 'success');
}

function renderQuoteItems() {
    const container = document.getElementById('quoteItems');
    const totalEl = document.getElementById('quoteTotal');
    
    if (currentQuoteItems.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-cart-plus"></i>
                <p>Aucun article ajouté / لم تتم إضافة أي عنصر</p>
            </div>
        `;
        totalEl.textContent = '0.00 MAD';
        return;
    }
    
    container.innerHTML = currentQuoteItems.map(item => `
        <div class="quote-item">
            <div class="quote-item-info">
                <div class="quote-item-name">${item.type} - ${item.series || 'Standard'}</div>
                <div class="quote-item-details">${item.width}×${item.height}cm × ${item.quantity} | ${item.glassName}</div>
            </div>
            <div class="quote-item-price">${formatNumber(item.totalPrice)} MAD</div>
            <button class="quote-item-remove" onclick="removeQuoteItem('${item.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    const total = currentQuoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
    totalEl.textContent = formatNumber(total) + ' MAD';
}

function removeQuoteItem(itemId) {
    currentQuoteItems = currentQuoteItems.filter(item => item.id !== itemId);
    renderQuoteItems();
}

function clearQuoteItems() {
    if (currentQuoteItems.length === 0) return;
    if (!confirm('Vider le devis? / مسح الفاتورة؟')) return;
    
    currentQuoteItems = [];
    renderQuoteItems();
}

// ============ QUOTES MANAGEMENT ============
function renderQuotesGrid() {
    const container = document.getElementById('quotesGrid');
    const filteredQuotes = getFilteredQuotes();
    
    const searchTerm = document.getElementById('quoteSearch')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('quoteStatusFilter')?.value || 'all';
    const installFilter = document.getElementById('quoteInstallFilter')?.value || 'all';
    const storeFilter = document.getElementById('quoteStoreFilter')?.value || 'all';
    
    let displayQuotes = [...filteredQuotes].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (searchTerm) {
        displayQuotes = displayQuotes.filter(q => {
            const client = clients.find(c => c.id === q.clientId);
            return client?.name?.toLowerCase().includes(searchTerm) ||
                   q.id?.toLowerCase().includes(searchTerm);
        });
    }
    
    if (statusFilter !== 'all') {
        displayQuotes = displayQuotes.filter(q => q.status === statusFilter);
    }
    
    if (installFilter !== 'all') {
        displayQuotes = displayQuotes.filter(q => {
            const status = q.installStatus || 'pending';
            return status === installFilter;
        });
    }
    
    if (storeFilter !== 'all' && currentUser.role === 'admin') {
        displayQuotes = displayQuotes.filter(q => q.storeId === storeFilter);
    }
    
    if (displayQuotes.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-file-invoice"></i>
                <p>Aucune facture trouvée / لم يتم العثور على فواتير</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = displayQuotes.map(quote => {
        const client = clients.find(c => c.id === quote.clientId);
        const remaining = (quote.total || 0) - (quote.paid || 0);
        const storeName = stores[quote.storeId]?.name || '';
        
        const statusLabels = {
            paid: 'Payé / مدفوع',
            partial: 'Partiel / جزئي',
            unpaid: 'Impayé / غير مدفوع'
        };
        
        const installLabels = {
            installed: 'Installé / مركب',
            pending: 'En attente / قيد الانتظار',
            cancelled: 'Annulé / ملغي'
        };
        
        const installStatus = quote.installStatus || 'pending';
        
        return `
            <div class="quote-card">
                <div class="quote-card-header">
                    <div class="quote-card-info">
                        <h4>${client?.name || 'Client inconnu'}</h4>
                        <span>#${quote.id.substring(0, 8)} | ${formatDate(quote.date)}</span>
                        ${currentUser.role === 'admin' ? `<span class="store-tag">${storeName}</span>` : ''}
                    </div>
                    <div class="quote-card-badges">
                        <span class="quote-badge ${quote.status || 'unpaid'}">${statusLabels[quote.status || 'unpaid']}</span>
                        <span class="quote-badge ${installStatus === 'installed' ? 'installed' : installStatus === 'cancelled' ? 'cancelled' : 'pending-install'}">${installLabels[installStatus]}</span>
                    </div>
                </div>
                <div class="quote-card-body">
                    <div class="quote-card-amounts">
                        <div class="quote-amount">
                            <div class="quote-amount-value">${formatNumber(quote.total || 0)}</div>
                            <div class="quote-amount-label">Total (MAD)</div>
                        </div>
                        <div class="quote-amount">
                            <div class="quote-amount-value">${formatNumber(quote.paid || 0)}</div>
                            <div class="quote-amount-label">Payé / مدفوع</div>
                        </div>
                        <div class="quote-amount">
                            <div class="quote-amount-value">${formatNumber(remaining)}</div>
                            <div class="quote-amount-label">Reste / المتبقي</div>
                        </div>
                    </div>
                </div>
                <div class="quote-card-footer">
                    <button class="btn btn-sm btn-primary" onclick="viewQuote('${quote.id}')" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="printQuote('${quote.id}')" title="Imprimer PDF">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="showPaymentModal('${quote.id}')" title="Paiement">
                        <i class="fas fa-money-bill"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editQuote('${quote.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${currentUser && currentUser.role === 'admin' ? `
                    <button class="btn btn-sm btn-danger" onclick="deleteQuote('${quote.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function filterQuotes() {
    renderQuotesGrid();
}

function showCreateQuoteModal() {
    if (currentQuoteItems.length === 0) {
        showToast('Ajoutez d\'abord des articles / أضف عناصر أولاً', 'warning');
        showSection('calculator');
        return;
    }
    
    document.getElementById('quoteModalTitle').textContent = 'Nouvelle Facture / فاتورة جديدة';
    document.getElementById('editQuoteId').value = '';
    document.getElementById('quoteForm').reset();
    document.getElementById('quoteDate').value = new Date().toISOString().split('T')[0];
    
    // Populate clients dropdown
    const clientSelect = document.getElementById('quoteClient');
    const filteredClients = getFilteredClients();
    
    clientSelect.innerHTML = '<option value="">-- Sélectionner / اختر --</option>';
    filteredClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.name} - ${client.phone}`;
        clientSelect.appendChild(option);
    });
    
    // Show items
    renderModalQuoteItems();
    updatePaymentStatus();
    
    openModal('quoteModal');
}

function renderModalQuoteItems() {
    const container = document.getElementById('modalQuoteItems');
    const totalEl = document.getElementById('modalQuoteTotal');
    
    container.innerHTML = currentQuoteItems.map(item => `
        <div class="quote-item">
            <div class="quote-item-info">
                <div class="quote-item-name">${item.type} - ${item.series || 'Standard'}</div>
                <div class="quote-item-details">${item.width}×${item.height}cm × ${item.quantity}</div>
            </div>
            <div class="quote-item-price">${formatNumber(item.totalPrice)} MAD</div>
        </div>
    `).join('');
    
    const total = currentQuoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
    totalEl.textContent = formatNumber(total) + ' MAD';
}

function updatePaymentStatus() {
    const total = currentQuoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const advance = parseFloat(document.getElementById('quoteAdvance')?.value) || 0;
    const remaining = total - advance;
    
    const remainingEl = document.getElementById('quoteRemaining');
    if (remainingEl) {
        remainingEl.value = formatNumber(remaining) + ' MAD';
    }
}

function saveQuote() {
    const clientId = document.getElementById('quoteClient').value;
    const date = document.getElementById('quoteDate').value;
    const advance = parseFloat(document.getElementById('quoteAdvance').value) || 0;
    const notes = document.getElementById('quoteNotes').value.trim();
    const editId = document.getElementById('editQuoteId').value;
    
    if (!clientId) {
        showToast('Sélectionnez un client / اختر عميل', 'error');
        return;
    }
    
    if (currentQuoteItems.length === 0) {
        showToast('Ajoutez des articles / أضف عناصر', 'error');
        return;
    }
    
    const total = currentQuoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
    let status = 'unpaid';
    if (advance >= total) {
        status = 'paid';
    } else if (advance > 0) {
        status = 'partial';
    }
    
    const quoteData = {
        clientId,
        date: date || new Date().toISOString().split('T')[0],
        items: [...currentQuoteItems],
        total,
        paid: advance,
        status,
        installStatus: 'pending',
        notes,
        storeId: currentUser.storeId || 'store1'
    };
    
    if (editId) {
        const index = quotes.findIndex(q => q.id === editId);
        if (index !== -1) {
            const existingInstallStatus = quotes[index].installStatus;
            quotes[index] = { ...quotes[index], ...quoteData, installStatus: existingInstallStatus };
            logActivity('invoice', `Facture modifiée: #${editId.substring(0, 8)}`, currentUser.storeId || 'admin');
        }
    } else {
        const newQuote = {
            id: generateId(),
            ...quoteData,
            createdAt: new Date().toISOString()
        };
        quotes.push(newQuote);
        logActivity('invoice', `Nouvelle facture: #${newQuote.id.substring(0, 8)} - ${formatNumber(total)} MAD`, currentUser.storeId || 'admin');
    }
    
    saveAllData();
    closeModal('quoteModal');
    currentQuoteItems = [];
    renderQuoteItems();
    renderQuotesGrid();
    updateDashboardStats();
    showToast('Facture enregistrée / تم حفظ الفاتورة', 'success');
}

function editQuote(quoteId) {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    currentQuoteItems = [...quote.items];
    
    document.getElementById('quoteModalTitle').textContent = 'Modifier Facture / تعديل الفاتورة';
    document.getElementById('editQuoteId').value = quoteId;
    document.getElementById('quoteDate').value = quote.date;
    document.getElementById('quoteAdvance').value = quote.paid || 0;
    document.getElementById('quoteNotes').value = quote.notes || '';
    
    // Populate clients dropdown
    const clientSelect = document.getElementById('quoteClient');
    const filteredClients = getFilteredClients();
    
    clientSelect.innerHTML = '<option value="">-- Sélectionner / اختر --</option>';
    filteredClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.name} - ${client.phone}`;
        if (client.id === quote.clientId) {
            option.selected = true;
        }
        clientSelect.appendChild(option);
    });
    
    renderModalQuoteItems();
    updatePaymentStatus();
    
    openModal('quoteModal');
}

function deleteQuote(quoteId) {
    // Only admin can delete
    if (!currentUser || currentUser.role !== 'admin') {
        showToast('⛔ Seul l\'admin peut supprimer / فقط المدير يمكنه الحذف', 'error');
        return;
    }
    
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    if (!confirm('Supprimer cette facture? / حذف هذه الفاتورة؟')) return;
    
    quotes = quotes.filter(q => q.id !== quoteId);
    logActivity('invoice', `Facture supprimée: #${quoteId.substring(0, 8)}`, 'admin');
    
    saveAllData();
    renderQuotesGrid();
    updateDashboardStats();
    showToast('Facture supprimée / تم حذف الفاتورة', 'success');
}

function viewQuote(quoteId) {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    currentViewingQuote = quote;
    const client = clients.find(c => c.id === quote.clientId);
    const container = document.getElementById('viewQuoteContent');
    
    const statusLabels = {
        paid: { text: 'Payé / مدفوع', class: 'paid' },
        partial: { text: 'Partiel / جزئي', class: 'partial' },
        unpaid: { text: 'Impayé / غير مدفوع', class: 'unpaid' }
    };
    
    const installLabels = {
        installed: { text: 'Installé / مركب', class: 'installed' },
        pending: { text: 'En attente / قيد الانتظار', class: 'pending-install' },
        cancelled: { text: 'Annulé / ملغي', class: 'cancelled' }
    };
    
    const status = statusLabels[quote.status || 'unpaid'];
    const installStatus = installLabels[quote.installStatus || 'pending'];
    const remaining = (quote.total || 0) - (quote.paid || 0);
    
    container.innerHTML = `
        <div class="quote-view">
            <div class="quote-view-header">
                <div class="quote-view-info">
                    <h4>Facture #${quote.id.substring(0, 8)}</h4>
                    <p>Date: ${formatDate(quote.date)}</p>
                </div>
                <div class="quote-view-badges">
                    <span class="quote-badge ${status.class}">${status.text}</span>
                    <span class="quote-badge ${installStatus.class}">${installStatus.text}</span>
                </div>
            </div>
            
            <div class="quote-view-client">
                <h5><i class="fas fa-user"></i> Client</h5>
                <p><strong>${client?.name || 'N/A'}</strong></p>
                <p>${client?.phone || ''}</p>
                <p>${client?.address || ''}</p>
            </div>
            
            <div class="quote-view-items">
                <h5><i class="fas fa-list"></i> Articles</h5>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Dimensions</th>
                            <th>Qté</th>
                            <th>Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${quote.items?.map(item => `
                            <tr>
                                <td>${item.type} - ${item.series || 'Standard'}</td>
                                <td>${item.width}×${item.height} cm</td>
                                <td>${item.quantity}</td>
                                <td>${formatNumber(item.totalPrice)} MAD</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4">Aucun article</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <div class="quote-view-totals">
                <div class="total-row">
                    <span>Total:</span>
                    <strong>${formatNumber(quote.total || 0)} MAD</strong>
                </div>
                <div class="total-row">
                    <span>Payé / Acompte:</span>
                    <strong class="text-success">${formatNumber(quote.paid || 0)} MAD</strong>
                </div>
                <div class="total-row">
                    <span>Reste à payer:</span>
                    <strong class="text-danger">${formatNumber(remaining)} MAD</strong>
                </div>
            </div>
            
            ${quote.notes ? `<div class="quote-view-notes"><h5>Notes:</h5><p>${quote.notes}</p></div>` : ''}
            
            <div class="quote-view-actions">
                <label>État d'installation:</label>
                <select id="viewInstallStatus" onchange="updateInstallStatus('${quote.id}', this.value)">
                    <option value="pending" ${quote.installStatus === 'pending' || !quote.installStatus ? 'selected' : ''}>En attente / قيد الانتظار</option>
                    <option value="installed" ${quote.installStatus === 'installed' ? 'selected' : ''}>Installé / تم التركيب</option>
                    <option value="cancelled" ${quote.installStatus === 'cancelled' ? 'selected' : ''}>Annulé / ملغي</option>
                </select>
            </div>
        </div>
        
        <style>
            .quote-view { }
            .quote-view-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); }
            .quote-view-header h4 { font-size: 18px; margin-bottom: 5px; }
            .quote-view-badges { display: flex; gap: 8px; }
            .quote-view-client { background: var(--bg-tertiary); padding: 15px; border-radius: var(--radius-md); margin-bottom: 20px; }
            .quote-view-client h5, .quote-view-items h5 { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; color: var(--primary); }
            .quote-view-items { margin-bottom: 20px; }
            .quote-view-totals { background: var(--bg-tertiary); padding: 15px; border-radius: var(--radius-md); }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); }
            .total-row:last-child { border-bottom: none; font-size: 18px; }
            .text-success { color: var(--success); }
            .text-danger { color: var(--danger); }
            .quote-view-notes { margin-top: 15px; padding: 15px; background: var(--bg-tertiary); border-radius: var(--radius-md); }
            .quote-view-actions { margin-top: 20px; display: flex; align-items: center; gap: 15px; }
            .quote-view-actions select { padding: 10px 15px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); }
        </style>
    `;
    
    openModal('viewQuoteModal');
}

function updateInstallStatus(quoteId, status) {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    quote.installStatus = status;
    saveAllData();
    
    const statusLabels = {
        installed: 'تم التركيب',
        pending: 'قيد الانتظار',
        cancelled: 'ملغي'
    };
    
    logActivity('install', `حالة التركيب تغيرت: #${quoteId.substring(0, 8)} → ${statusLabels[status]}`, currentUser.storeId || 'admin');
    
    renderQuotesGrid();
    updateDashboardStats();
    showToast('تم تحديث حالة التركيب', 'success');
}

function printCurrentQuote() {
    if (!currentViewingQuote) return;
    printQuote(currentViewingQuote.id);
}

function printQuote(quoteId) {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    const client = clients.find(c => c.id === quote.clientId);
    const remaining = (quote.total || 0) - (quote.paid || 0);
    
    const logoHtml = companySettings.logo 
        ? `<img src="${companySettings.logo}" alt="Logo" style="max-height: 80px; max-width: 200px;">`
        : `<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">G</div>`;
    
    const statusLabels = {
        paid: 'Payé ✓',
        partial: 'Partiel',
        unpaid: 'Non payé'
    };
    
    const installLabels = {
        installed: 'Installé ✓',
        pending: 'En attente',
        cancelled: 'Annulé'
    };
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Facture #${quote.id.substring(0, 8)}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1; }
                .logo { display: flex; align-items: center; gap: 15px; }
                .company-info h1 { font-size: 24px; color: #6366f1; }
                .company-info p { font-size: 12px; color: #666; }
                .invoice-info { text-align: right; }
                .invoice-info h2 { font-size: 28px; color: #333; }
                .invoice-info p { color: #666; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
                .badge-paid { background: #d1fae5; color: #059669; }
                .badge-partial { background: #fef3c7; color: #d97706; }
                .badge-unpaid { background: #fee2e2; color: #dc2626; }
                .client-section { margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 10px; }
                .client-section h3 { color: #6366f1; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th { background: #6366f1; color: white; padding: 12px; text-align: left; }
                td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
                .totals { margin-left: auto; width: 300px; }
                .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                .total-row.final { font-size: 18px; font-weight: bold; border-bottom: none; border-top: 2px solid #6366f1; margin-top: 10px; padding-top: 15px; }
                .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">
                    ${logoHtml}
                    <div class="company-info">
                        <h1>${companySettings.name || 'GOLD PVC'}</h1>
                        <p>${companySettings.address || ''}</p>
                        <p>Tél: ${companySettings.phone || ''} | Email: ${companySettings.email || ''}</p>
                        ${companySettings.ice ? `<p>ICE: ${companySettings.ice}</p>` : ''}
                    </div>
                </div>
                <div class="invoice-info">
                    <h2>FACTURE</h2>
                    <p><strong>#${quote.id.substring(0, 8)}</strong></p>
                    <p>Date: ${formatDate(quote.date)}</p>
                    <p style="margin-top: 10px;">
                        <span class="badge badge-${quote.status || 'unpaid'}">${statusLabels[quote.status || 'unpaid']}</span>
                    </p>
                    <p>
                        <span class="badge ${quote.installStatus === 'installed' ? 'badge-paid' : 'badge-partial'}">${installLabels[quote.installStatus || 'pending']}</span>
                    </p>
                </div>
            </div>
            
            <div class="client-section">
                <h3>Client</h3>
                <p><strong>${client?.name || 'N/A'}</strong></p>
                <p>Tél: ${client?.phone || 'N/A'}</p>
                ${client?.address ? `<p>Adresse: ${client.address}</p>` : ''}
                ${client?.city ? `<p>Ville: ${client.city}</p>` : ''}
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Série</th>
                        <th>Dimensions</th>
                        <th>Qté</th>
                        <th style="text-align: right;">Prix</th>
                    </tr>
                </thead>
                <tbody>
                    ${quote.items?.map(item => `
                        <tr>
                            <td>${item.type || 'Produit'}</td>
                            <td>${item.series || 'Standard'}</td>
                            <td>${item.width} × ${item.height} cm</td>
                            <td>${item.quantity}</td>
                            <td style="text-align: right;">${formatNumber(item.totalPrice)} MAD</td>
                        </tr>
                    `).join('') || ''}
                </tbody>
            </table>
            
            <div class="totals">
                <div class="total-row">
                    <span>Total HT:</span>
                    <span>${formatNumber(quote.total || 0)} MAD</span>
                </div>
                <div class="total-row">
                    <span>Acompte / تسبيق:</span>
                    <span style="color: #059669;">- ${formatNumber(quote.paid || 0)} MAD</span>
                </div>
                <div class="total-row final">
                    <span>Reste à payer / المتبقي:</span>
                    <span style="color: ${remaining > 0 ? '#dc2626' : '#059669'};">${formatNumber(remaining)} MAD</span>
                </div>
            </div>
            
            ${quote.notes ? `<div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 10px;"><strong>Notes:</strong> ${quote.notes}</div>` : ''}
            
            <div class="footer">
                <p>Merci pour votre confiance! | شكراً لثقتكم</p>
                <p>${companySettings.name || 'GOLD PVC'} - ${companySettings.phone || ''}</p>
            </div>
            
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
}

// ============ PAYMENTS ============
function showPaymentModal(quoteId) {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    document.getElementById('paymentQuoteId').value = quoteId;
    document.getElementById('paymentTotal').textContent = formatNumber(quote.total || 0) + ' MAD';
    document.getElementById('paymentPaid').textContent = formatNumber(quote.paid || 0) + ' MAD';
    document.getElementById('paymentRemaining').textContent = formatNumber((quote.total || 0) - (quote.paid || 0)) + ' MAD';
    document.getElementById('paymentAmount').value = '';
    document.getElementById('paymentNote').value = '';
    
    openModal('paymentModal');
}

function addPayment() {
    const quoteId = document.getElementById('paymentQuoteId').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value) || 0;
    const note = document.getElementById('paymentNote').value.trim();
    
    if (amount <= 0) {
        showToast('Entrez un montant valide / أدخل مبلغاً صحيحاً', 'error');
        return;
    }
    
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    const remaining = (quote.total || 0) - (quote.paid || 0);
    
    if (amount > remaining) {
        showToast('Le montant dépasse le reste à payer / المبلغ أكبر من المتبقي', 'warning');
        return;
    }
    
    quote.paid = (quote.paid || 0) + amount;
    
    if (quote.paid >= quote.total) {
        quote.status = 'paid';
    } else if (quote.paid > 0) {
        quote.status = 'partial';
    }
    
    // Add payment record
    if (!quote.payments) quote.payments = [];
    quote.payments.push({
        amount,
        note,
        date: new Date().toISOString(),
        by: currentUser.username
    });
    
    logActivity('payment', `Paiement reçu: ${formatNumber(amount)} MAD pour #${quoteId.substring(0, 8)}`, currentUser.storeId || 'admin');
    
    saveAllData();
    closeModal('paymentModal');
    renderQuotesGrid();
    updateDashboardStats();
    showToast('Paiement enregistré / تم تسجيل الدفعة', 'success');
}

// ============ INSTALLATIONS ============
function renderInstallationsList() {
    const container = document.getElementById('installationsList');
    const filteredQuotes = getFilteredQuotes();
    
    const searchTerm = document.getElementById('installSearch')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('installStatusFilter')?.value || 'all';
    const storeFilter = document.getElementById('installStoreFilter')?.value || 'all';
    
    let displayQuotes = [...filteredQuotes].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (searchTerm) {
        displayQuotes = displayQuotes.filter(q => {
            const client = clients.find(c => c.id === q.clientId);
            return client?.name?.toLowerCase().includes(searchTerm);
        });
    }
    
    if (statusFilter !== 'all') {
        displayQuotes = displayQuotes.filter(q => {
            const status = q.installStatus || 'pending';
            return status === statusFilter;
        });
    }
    
    if (storeFilter !== 'all' && currentUser.role === 'admin') {
        displayQuotes = displayQuotes.filter(q => q.storeId === storeFilter);
    }
    
    // Update summary counts
    const pending = filteredQuotes.filter(q => q.installStatus === 'pending' || !q.installStatus).length;
    const installed = filteredQuotes.filter(q => q.installStatus === 'installed').length;
    const cancelled = filteredQuotes.filter(q => q.installStatus === 'cancelled').length;
    
    document.getElementById('summaryPending').textContent = pending;
    document.getElementById('summaryInstalled').textContent = installed;
    document.getElementById('summaryCancelled').textContent = cancelled;
    
    if (displayQuotes.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-tools"></i>
                <p>Aucune installation trouvée / لا توجد تركيبات</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = displayQuotes.map(quote => {
        const client = clients.find(c => c.id === quote.clientId);
        const installStatus = quote.installStatus || 'pending';
        const storeName = stores[quote.storeId]?.name || '';
        
        const statusIcons = {
            pending: 'fa-clock',
            installed: 'fa-check-circle',
            cancelled: 'fa-times-circle'
        };
        
        const statusLabels = {
            pending: 'En attente / قيد الانتظار',
            installed: 'Installé / تم التركيب',
            cancelled: 'Annulé / ملغي'
        };
        
        return `
            <div class="installation-item">
                <div class="installation-status ${installStatus}">
                    <i class="fas ${statusIcons[installStatus]}"></i>
                </div>
                <div class="installation-info">
                    <h4>${client?.name || 'Client inconnu'} - #${quote.id.substring(0, 8)}</h4>
                    <p>${formatDate(quote.date)} | ${client?.address || client?.city || 'Adresse non spécifiée'}</p>
                    ${currentUser.role === 'admin' ? `<p><small>${storeName}</small></p>` : ''}
                </div>
                <div class="installation-actions">
                    <select onchange="updateInstallStatus('${quote.id}', this.value)" class="filter-select" style="min-width: 150px;">
                        <option value="pending" ${installStatus === 'pending' ? 'selected' : ''}>En attente</option>
                        <option value="installed" ${installStatus === 'installed' ? 'selected' : ''}>Installé</option>
                        <option value="cancelled" ${installStatus === 'cancelled' ? 'selected' : ''}>Annulé</option>
                    </select>
                    <button class="btn btn-sm btn-primary" onclick="viewQuote('${quote.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function filterInstallations() {
    renderInstallationsList();
}

// ============ ACTIVITY LOG ============
function logActivity(type, description, storeId) {
    const activity = {
        id: generateId(),
        type,
        description,
        storeId,
        user: currentUser?.username || 'system',
        timestamp: new Date().toISOString()
    };
    
    activityLog.unshift(activity);
    
    // Keep only last 500 activities
    if (activityLog.length > 500) {
        activityLog = activityLog.slice(0, 500);
    }
    
    saveAllData();
}

function renderActivityTimeline() {
    const container = document.getElementById('activityTimeline');
    
    const searchTerm = document.getElementById('activitySearch')?.value?.toLowerCase() || '';
    const typeFilter = document.getElementById('activityTypeFilter')?.value || 'all';
    const storeFilter = document.getElementById('activityStoreFilter')?.value || 'all';
    
    let displayActivities = [...activityLog];
    
    if (searchTerm) {
        displayActivities = displayActivities.filter(a => 
            a.description?.toLowerCase().includes(searchTerm)
        );
    }
    
    if (typeFilter !== 'all') {
        displayActivities = displayActivities.filter(a => a.type === typeFilter);
    }
    
    if (storeFilter !== 'all') {
        displayActivities = displayActivities.filter(a => a.storeId === storeFilter);
    }
    
    displayActivities = displayActivities.slice(0, 100);
    
    if (displayActivities.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-history"></i>
                <p>Aucune activité enregistrée / لا يوجد نشاط مسجل</p>
            </div>
        `;
        return;
    }
    
    const iconMap = {
        login: 'fa-sign-in-alt',
        invoice: 'fa-file-invoice',
        client: 'fa-user',
        payment: 'fa-money-bill-wave',
        install: 'fa-tools',
        delete: 'fa-trash'
    };
    
    container.innerHTML = displayActivities.map(activity => {
        const icon = iconMap[activity.type] || 'fa-circle';
        const iconClass = activity.description?.includes('supprim') || activity.description?.includes('حذف') ? 'delete' : activity.type;
        const storeName = activity.storeId === 'admin' ? 'Admin' : (stores[activity.storeId]?.name || activity.storeId);
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.description}</div>
                    <div class="activity-description">Par: ${activity.user}</div>
                </div>
                <div class="activity-meta">
                    <div class="activity-time">${formatDateTime(activity.timestamp)}</div>
                    <div class="activity-store">${storeName}</div>
                </div>
            </div>
        `;
    }).join('');
}

function filterActivity() {
    renderActivityTimeline();
}

function exportActivityLog() {
    const csv = [
        ['Date', 'Type', 'Description', 'Utilisateur', 'Magasin'].join(','),
        ...activityLog.map(a => [
            formatDateTime(a.timestamp),
            a.type,
            `"${a.description}"`,
            a.user,
            a.storeId
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `activity_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast('Journal exporté / تم تصدير السجل', 'success');
}

// ============ SETTINGS ============
function loadSettings() {
    // Company info
    document.getElementById('companyName').value = companySettings.name || '';
    document.getElementById('companyAddress').value = companySettings.address || '';
    document.getElementById('companyPhone').value = companySettings.phone || '';
    document.getElementById('companyEmail').value = companySettings.email || '';
    document.getElementById('companyICE').value = companySettings.ice || '';
    
    // Logo
    updateLogoPreview();
    
    // Store names
    document.getElementById('store1Name').value = stores.store1?.name || 'محل 1';
    document.getElementById('store2Name').value = stores.store2?.name || 'محل 2';
    document.getElementById('store3Name').value = stores.store3?.name || 'محل 3';
}

function saveCompanyInfo() {
    companySettings.name = document.getElementById('companyName').value.trim();
    companySettings.address = document.getElementById('companyAddress').value.trim();
    companySettings.phone = document.getElementById('companyPhone').value.trim();
    companySettings.email = document.getElementById('companyEmail').value.trim();
    companySettings.ice = document.getElementById('companyICE').value.trim();
    
    saveAllData();
    showToast('Informations enregistrées / تم حفظ المعلومات', 'success');
}

function saveStoreNames() {
    stores.store1.name = document.getElementById('store1Name').value.trim() || 'محل 1';
    stores.store2.name = document.getElementById('store2Name').value.trim() || 'محل 2';
    stores.store3.name = document.getElementById('store3Name').value.trim() || 'محل 3';
    
    saveAllData();
    showToast('Noms enregistrés / تم حفظ الأسماء', 'success');
}

function savePasswords() {
    const adminPass = document.getElementById('adminPassword').value;
    const store1Pass = document.getElementById('store1Password').value;
    const store2Pass = document.getElementById('store2Password').value;
    const store3Pass = document.getElementById('store3Password').value;
    
    if (adminPass) users.admin.password = adminPass;
    if (store1Pass) users.store1.password = store1Pass;
    if (store2Pass) users.store2.password = store2Pass;
    if (store3Pass) users.store3.password = store3Pass;
    
    saveAllData();
    
    document.getElementById('adminPassword').value = '';
    document.getElementById('store1Password').value = '';
    document.getElementById('store2Password').value = '';
    document.getElementById('store3Password').value = '';
    
    showToast('Mots de passe mis à jour / تم تحديث كلمات المرور', 'success');
}

// Logo Upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleLogoFile(file);
    }
}

function handleLogoFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Veuillez sélectionner une image / يرجى اختيار صورة', 'error');
        return;
    }
    
    if (file.size > 500 * 1024) {
        showToast('Image trop grande (max 500KB) / الصورة كبيرة جداً', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        companySettings.logo = e.target.result;
        saveAllData();
        updateLogoPreview();
        showToast('Logo enregistré / تم حفظ الشعار', 'success');
    };
    reader.readAsDataURL(file);
}

function updateLogoPreview() {
    const preview = document.getElementById('logoPreview');
    if (!preview) return;
    
    if (companySettings.logo) {
        preview.innerHTML = `<img src="${companySettings.logo}" alt="Logo">`;
    } else {
        preview.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Cliquez ou glissez une image</p>
            <p>اضغط أو اسحب صورة</p>
        `;
    }
}

function removeLogo() {
    companySettings.logo = null;
    saveAllData();
    updateLogoPreview();
    showToast('Logo supprimé / تم حذف الشعار', 'success');
}

// ============ MODAL MANAGEMENT ============
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ UTILITY FUNCTIONS ============
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(num * 100) / 100);
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
}

function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
