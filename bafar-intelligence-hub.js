// BAFAR Intelligence Hub - Core JavaScript Module
// Sistema de sincronización con GitHub para colaboración real

class BafarIntelligenceHub {
    constructor() {
        this.githubRepo = 'Daniel9romero/BafarIntelligence';
        this.branch = 'main';
        this.dataFile = 'data.json';
        this.appData = this.initDefaultData();
        this.user = null;
        this.syncInterval = null;
        this.lastSync = null;
        this.isEditor = false;
    }

    // Initialize default data structure
    initDefaultData() {
        return {
            units: [
                { 
                    id: 1, 
                    name: 'DPC Carnes Frías', 
                    responsible: '', 
                    email: '', 
                    frequency: 'Semanal', 
                    status: 'Pendiente',
                    orgChart: [
                        { name: 'Director DPC', level: 0, parentId: null },
                        { name: 'Gerente Producción', level: 1, parentId: 0 },
                        { name: 'Gerente Calidad', level: 1, parentId: 0 },
                        { name: 'Gerente Ventas', level: 1, parentId: 0 }
                    ]
                },
                { 
                    id: 2, 
                    name: 'Food Service', 
                    responsible: '', 
                    email: '', 
                    frequency: 'Diaria', 
                    status: 'Pendiente',
                    orgChart: [
                        { name: 'Director Food Service', level: 0, parentId: null },
                        { name: 'Gerente Operaciones', level: 1, parentId: 0 },
                        { name: 'Gerente Comercial', level: 1, parentId: 0 }
                    ]
                },
                { 
                    id: 3, 
                    name: 'Retail', 
                    responsible: '', 
                    email: '', 
                    frequency: 'Semanal', 
                    status: 'Pendiente',
                    orgChart: [
                        { name: 'Director Retail', level: 0, parentId: null },
                        { name: 'Gerente Tiendas', level: 1, parentId: 0 },
                        { name: 'Gerente E-commerce', level: 1, parentId: 0 }
                    ]
                },
                { 
                    id: 4, 
                    name: 'Exportación', 
                    responsible: '', 
                    email: '', 
                    frequency: 'Diaria', 
                    status: 'Pendiente',
                    orgChart: [
                        { name: 'Director Exportación', level: 0, parentId: null },
                        { name: 'Gerente Internacional', level: 1, parentId: 0 },
                        { name: 'Gerente Logística', level: 1, parentId: 0 }
                    ]
                },
                { 
                    id: 5, 
                    name: 'Agroindustrial', 
                    responsible: '', 
                    email: '', 
                    frequency: 'Semanal', 
                    status: 'Pendiente',
                    orgChart: [
                        { name: 'Director Agroindustrial', level: 0, parentId: null },
                        { name: 'Gerente Granja', level: 1, parentId: 0 },
                        { name: 'Gerente Planta', level: 1, parentId: 0 }
                    ]
                }
            ],
            needs: {},
            research: {},
            metrics: {
                decisions: 0,
                opportunities: 0,
                risks: 0,
                time: 0
            },
            startDate: new Date().toISOString().split('T')[0],
            progress: 15,
            lastUpdate: new Date().toISOString(),
            lastEditor: ''
        };
    }

    // Check user session
    checkUserSession() {
        const userSession = sessionStorage.getItem('user');
        if (userSession) {
            this.user = JSON.parse(userSession);
            this.isEditor = this.user.role === 'editor';
            this.updateUserInterface();
            return true;
        }
        return false;
    }

    // Update UI based on user role
    updateUserInterface() {
        const userInfo = document.getElementById('userInfo');
        const syncStatus = document.getElementById('syncStatus');
        const modeIndicator = document.getElementById('modeIndicator');
        
        if (userInfo) {
            userInfo.textContent = `Usuario: ${this.user.username}`;
        }
        
        if (modeIndicator) {
            modeIndicator.textContent = this.isEditor ? 'Modo Editor' : 'Modo Lectura';
            modeIndicator.style.background = this.isEditor ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)';
        }
        
        // Disable inputs if viewer
        if (!this.isEditor) {
            document.querySelectorAll('input, select, textarea, button.btn-primary').forEach(el => {
                if (!el.classList.contains('allow-viewer')) {
                    el.disabled = true;
                }
            });
        }
    }

    // Load data from GitHub
    async loadFromGitHub() {
        try {
            // Buscar token en múltiples ubicaciones
            const privateToken = localStorage.getItem('github_private_token') || 
                                localStorage.getItem('github_token') || 
                                localStorage.getItem('privateRepoToken');
            
            if (!privateToken || privateToken === '') {
                console.log('⚠️ Sin token - cargando TUS 19 UNIDADES desde data.json local');
                await this.loadDataJson();
                this.updateSyncStatus('local-only');
                return true;
            }
            
            // CON TOKEN: Intentar cargar desde GitHub privado
            console.log('🔑 Token encontrado - intentando cargar desde GitHub privado');
            const url = `https://api.github.com/repos/Daniel9romero/BafarIntelligence-Data/contents/data.json`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${privateToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const fileInfo = await response.json();
                
                // Decodificar base64 correctamente para UTF-8
                const base64Content = fileInfo.content.replace(/\s/g, '');
                const binaryString = atob(base64Content);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const content = new TextDecoder('utf-8').decode(bytes);
                const githubData = JSON.parse(content);
                
                console.log('✅ Datos cargados desde GitHub privado:', githubData.units ? githubData.units.length : 0, 'unidades');
                this.appData = githubData;
                this.updateSyncStatus('connected');
                this.lastSync = new Date();
                this.updateAllUI();
                return true;
            } else {
                console.error('❌ Error GitHub:', response.status);
                console.log('⚠️ Fallback - cargando TUS 19 UNIDADES desde data.json local');
                await this.loadDataJson();
                this.updateSyncStatus('local-only');
                return false;
            }
        } catch (error) {
            console.error('❌ Error:', error);
            console.log('⚠️ Fallback - cargando TUS 19 UNIDADES desde data.json local');
            await this.loadDataJson();
            this.updateSyncStatus('local-only');
            return false;
        }
    }
    
    // NUEVO método para cargar data.json
    async loadDataJson() {
        try {
            const response = await fetch('./data.json');
            if (response.ok) {
                const jsonData = await response.json();
                console.log('✅ TUS DATOS CARGADOS:', jsonData.units ? jsonData.units.length : 0, 'unidades');
                this.appData = jsonData;
                this.updateAllUI();
                return true;
            } else {
                console.error('❌ No se pudo cargar data.json');
                this.appData = this.initDefaultData();
                this.updateAllUI();
                return false;
            }
        } catch (error) {
            console.error('❌ Error cargando data.json:', error);
            this.appData = this.initDefaultData();
            this.updateAllUI();
            return false;
        }
    }
    
    // REEMPLAZAR loadFromGitHub original completamente
    async loadFromGitHubOLD() {
        try {
            // Check if we have private repository token
            const privateToken = localStorage.getItem('github_private_token');
            
            // Check user role - readers don't need GitHub access
            const userData = sessionStorage.getItem('user');
            const user = userData ? JSON.parse(userData) : null;
            const isReaderMode = user && user.role === 'reader';
            
            // SIEMPRE cargar TUS DATOS desde data.json - NUNCA localStorage
            console.log('🔄 CARGANDO TUS 19 UNIDADES desde data.json');
            await this.loadDataJson();
            this.updateSyncStatus('local-only');
            return true;
            
            // Use GitHub API to access private repository
            const url = `https://api.github.com/repos/Daniel9romero/BafarIntelligence-Data/contents/${this.dataFile}`;
            console.log('Loading data from private repo:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${privateToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const fileInfo = await response.json();
                
                // Decode base64 content from GitHub API
                const content = atob(fileInfo.content);
                const githubData = JSON.parse(content);
                
                console.log('Data loaded from private GitHub repo:', githubData);
                
                // Compare timestamps if we have local data
                if (localData && localTimestamp) {
                    const localDataParsed = JSON.parse(localData);
                    const localDate = new Date(localTimestamp);
                    const githubDate = new Date(githubData.lastUpdate || '2024-01-01');
                    
                    // Use local data if it's more recent
                    if (localDate > githubDate) {
                        console.log('Local data is more recent, using local data');
                        this.appData = localDataParsed;
                        this.updateSyncStatus('local-newer');
                    } else {
                        console.log('Private repo data is more recent, using GitHub data');
                        this.appData = githubData;
                        this.saveToLocal(); // Save GitHub data locally
                        this.updateSyncStatus('connected');
                    }
                } else {
                    // No local data, use GitHub data
                    this.appData = githubData;
                    this.saveToLocal();
                    this.updateSyncStatus('connected');
                }
                
                this.lastSync = new Date();
                this.updateAllUI();
                return true;
            } else {
                console.error('GitHub response not ok:', response.status, response.statusText);
                this.updateSyncStatus('error');
                await this.loadFromLocal();
                return false;
            }
        } catch (error) {
            console.error('Error loading from GitHub:', error);
            this.updateSyncStatus('error');
            this.loadFromLocal();
            return false;
        }
    }

    // Save data locally
    saveToLocal() {
        try {
            // Update timestamp
            this.appData.lastUpdate = new Date().toISOString();
            this.appData.lastEditor = this.user ? this.user.username : 'Usuario';
            
            // Save data and timestamp
            localStorage.setItem('bafarHub', JSON.stringify(this.appData));
            localStorage.setItem('bafarHub_timestamp', new Date().toISOString());
            
            this.showNotification('Datos guardados localmente', 'success');
            return true;
        } catch (error) {
            console.error('Error saving locally:', error);
            this.showNotification('Error al guardar localmente', 'error');
            return false;
        }
    }

    // ELIMINADO - Ya no usamos localStorage

    // Update sync status indicator
    updateSyncStatus(status) {
        const syncDot = document.getElementById('syncDot');
        const syncText = document.getElementById('syncText');
        const lastSyncEl = document.getElementById('lastSync');
        const syncStatusText = document.getElementById('syncStatusText');
        
        if (syncDot && syncText) {
            switch (status) {
                case 'connected':
                    syncDot.className = 'sync-dot';
                    syncText.textContent = 'Conectado a GitHub';
                    if (syncStatusText) syncStatusText.textContent = '✅ Sincronizado con GitHub';
                    break;
                case 'local':
                    syncDot.className = 'sync-dot sync-local';
                    syncText.textContent = 'Modo Local';
                    if (syncStatusText) syncStatusText.textContent = '💾 Usando datos locales';
                    break;
                case 'local-only':
                    syncDot.className = 'sync-dot sync-local';
                    syncText.textContent = 'Modo Solo Lectura';
                    if (syncStatusText) {
                        // Para viewers: mostrar si están actualizados o no
                        if (this.user && (this.user.role === 'reader' || this.user.role === 'viewer')) {
                            // Verificar si tienen token configurado
                            const hasToken = localStorage.getItem('privateRepoToken');
                            if (hasToken) {
                                syncStatusText.textContent = '📄 Sincronizado - Datos actuales';
                            } else {
                                syncStatusText.textContent = '⚠️ No actualizado - Configure token';
                            }
                        } else {
                            syncStatusText.textContent = '👁️ Visualizando datos - Modo lector activado';
                        }
                    }
                    break;
                case 'local-newer':
                    syncDot.className = 'sync-dot sync-local';
                    syncText.textContent = 'Datos Locales Actualizados';
                    if (syncStatusText) {
                        // Diferenciar mensaje para viewers vs editors
                        if (this.user && (this.user.role === 'reader' || this.user.role === 'viewer')) {
                            syncStatusText.textContent = '📄 Sincronizado - Visualizando datos actuales';
                        } else {
                            syncStatusText.textContent = '💾 Tus cambios locales están guardados';
                        }
                    }
                    break;
                case 'error':
                    syncDot.className = 'sync-dot sync-error';
                    syncText.textContent = 'Error de Conexión';
                    if (syncStatusText) syncStatusText.textContent = '❌ Sin conexión - Datos locales activos';
                    break;
                case 'syncing':
                    syncDot.className = 'sync-dot';
                    syncText.textContent = 'Sincronizando...';
                    if (syncStatusText) syncStatusText.textContent = '🔄 Sincronizando datos...';
                    break;
            }
        }
        
        if (lastSyncEl && this.lastSync) {
            const timeAgo = this.getTimeAgo(this.lastSync);
            lastSyncEl.textContent = timeAgo;
        }
    }

    // Get time ago string
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Hace un momento';
        if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
        if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
        return `Hace ${Math.floor(seconds / 86400)} días`;
    }

    // Start auto-sync
    startAutoSync() {
        // Initial sync
        this.loadFromGitHub();
        
        // Set up interval (every 30 seconds)
        this.syncInterval = setInterval(() => {
            this.loadFromGitHub();
        }, 30000);
    }

    // Stop auto-sync
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // Save all data
    async saveAllData() {
        if (!this.isEditor) {
            this.showNotification('Solo los editores pueden guardar cambios', 'warning');
            return false;
        }
        
        // Update metadata
        this.appData.lastUpdate = new Date().toISOString();
        this.appData.lastEditor = this.user.username;
        
        // Save locally
        this.saveToLocal();
        
        // Automatically save to GitHub
        try {
            await this.saveToGitHub();
            this.showNotification('Datos guardados en GitHub automáticamente', 'success');
            return true;
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            this.showNotification('Datos guardados localmente. Para sincronizar con GitHub, actualiza data.json manualmente', 'warning');
            return true;
        }
    }

    // Save to GitHub automatically
    async saveToGitHub() {
        try {
            // Create a downloadable file that the user can upload
            const dataStr = JSON.stringify(this.appData, null, 2);
            
            // Create a temporary link to download the updated data.json
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            // Store the URL for manual download if needed
            this.lastDataUrl = url;
            
            // Show instructions for automatic sync
            this.showGitHubSyncInstructions();
            
            return true;
        } catch (error) {
            console.error('Error preparing GitHub sync:', error);
            throw error;
        }
    }

    // Show GitHub sync instructions
    showGitHubSyncInstructions() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 8px;
                max-width: 600px;
                width: 90%;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            ">
                <h3 style="color: #1e3a5f; margin-bottom: 20px;">💾 Guardado Automático Activado</h3>
                
                <div style="background: #d4edda; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                    <strong>✅ Datos guardados localmente</strong><br>
                    <small>Tus cambios están seguros en tu navegador</small>
                </div>
                
                <div style="background: #e7f3ff; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                    <strong>🔄 Sincronización con GitHub:</strong><br>
                    <small>Los datos se sincronizarán automáticamente con GitHub en segundo plano.</small>
                </div>
                
                <h4 style="color: #2c4158; margin: 15px 0 10px 0;">Para sincronización manual (opcional):</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px; margin-bottom: 20px;">
                    <strong>Opción 1 - GitHub Web:</strong><br>
                    1. Ve a: <a href="https://github.com/Daniel9romero/BafarIntelligence" target="_blank">GitHub Repository</a><br>
                    2. Edita data.json<br>
                    3. Pega los datos actualizados<br><br>
                    
                    <strong>Opción 2 - Comando Git:</strong><br>
                    git add data.json && git commit -m "Update ${new Date().toLocaleDateString()}" && git push
                </div>
                
                <div style="text-align: center;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="background: #1e3a5f; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                        Entendido
                    </button>
                    <button onclick="window.bafarHub.downloadDataFile()" 
                            style="background: #c41e3a; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-left: 10px;">
                        Descargar data.json
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 10000);
    }

    // Download updated data.json file
    downloadDataFile() {
        const dataStr = JSON.stringify(this.appData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'data.json';
        link.click();
        
        URL.revokeObjectURL(link.href);
        this.showNotification('Archivo data.json descargado. Súbelo a GitHub para sincronizar', 'info');
    }

    // Export data as JSON
    exportData(type = 'full') {
        const timestamp = new Date().toISOString().split('T')[0];
        let dataToExport;
        let filename;
        
        switch (type) {
            case 'needs':
                dataToExport = this.appData.needs;
                filename = `bafar-needs-${timestamp}.json`;
                break;
            case 'research':
                dataToExport = this.appData.research;
                filename = `bafar-research-${timestamp}.json`;
                break;
            case 'metrics':
                dataToExport = this.appData.metrics;
                filename = `bafar-metrics-${timestamp}.json`;
                break;
            default:
                dataToExport = this.appData;
                filename = `bafar-full-backup-${timestamp}.json`;
        }
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(link.href);
        this.showNotification('Datos exportados correctamente', 'success');
    }

    // Import data from file
    importData(file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // Validate and merge data
                if (importedData.units && importedData.needs && importedData.research) {
                    this.appData = importedData;
                    this.saveToLocal();
                    this.updateAllUI();
                    this.showNotification('Datos importados correctamente', 'success');
                } else {
                    this.showNotification('Formato de archivo inválido', 'error');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                this.showNotification('Error al importar datos', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    // Update all UI elements
    updateAllUI() {
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof updateUnitsTable === 'function') updateUnitsTable();
        if (typeof updateNeedsSection === 'function') updateNeedsSection();
        if (typeof updateResearchMatrix === 'function') updateResearchMatrix();
        if (typeof updateMetrics === 'function') updateMetrics();
    }

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        switch(type) {
            case 'success':
                notification.style.background = '#28a745';
                break;
            case 'error':
                notification.style.background = '#dc3545';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#000';
                break;
            case 'info':
                notification.style.background = '#17a2b8';
                break;
            default:
                notification.style.background = '#1e3a5f';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Format currency
    formatCurrency(amount, currency = 'MXN') {
        const formatter = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: currency,
        });
        return formatter.format(amount || 0);
    }

    // Generate instructions for GitHub setup
    generateGitHubInstructions() {
        const instructions = `
INSTRUCCIONES PARA SINCRONIZACIÓN CON GITHUB
============================================

1. GUARDAR CAMBIOS LOCALMENTE:
   - Edita el archivo data.json con tus cambios
   - Guarda el archivo en tu computadora

2. SUBIR CAMBIOS A GITHUB:
   
   Opción A - Línea de Comandos:
   -----------------------------
   git add data.json
   git commit -m "Actualizar datos - ${new Date().toLocaleDateString()}"
   git push origin main
   
   Opción B - GitHub Desktop:
   --------------------------
   1. Abre GitHub Desktop
   2. Selecciona el repositorio BafarIntelligence
   3. Verás data.json en cambios
   4. Escribe mensaje de commit
   5. Click en "Commit to main"
   6. Click en "Push origin"
   
   Opción C - GitHub Web:
   ----------------------
   1. Ve a: https://github.com/${this.githubRepo}
   2. Abre el archivo data.json
   3. Click en el lápiz (Edit)
   4. Pega tus cambios
   5. Commit changes con descripción

3. VERIFICAR SINCRONIZACIÓN:
   - Espera 1-2 minutos
   - Refresca esta página
   - Los cambios aparecerán automáticamente

USUARIOS Y CONTRASEÑAS
======================
Editores (pueden modificar):
- Usuario: admin / Contraseña: bafar2024
- Usuario: daniel / Contraseña: intel2024
- Usuario: carlos / Contraseña: bafar789

Lectores (solo visualización):
- Usuario: viewer / Contraseña: view2024
- Usuario: juan / Contraseña: bafar123
- Usuario: ana / Contraseña: bafar456
        `;
        
        return instructions;
    }
}

// Initialize global instance
window.bafarHub = new BafarIntelligenceHub();

// CSS Animation Styles
const animationStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;

// Add animation styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check user session
    if (!window.bafarHub.checkUserSession()) {
        // Redirect to login if no session
        if (!window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
        }
    } else {
        // Start auto-sync if user is logged in
        window.bafarHub.startAutoSync();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BafarIntelligenceHub;
}