// Sync Manager - Para compartir datos entre usuarios
class SyncManager {
    constructor() {
        this.syncUrl = 'https://api.jsonbin.io/v3/b/'; // Servicio gratuito para JSON
        this.apiKey = '$2a$10$example-key'; // Reemplazar con clave real
        this.binId = null; // ID del "bin" donde se guardan los datos
    }

    // Inicializar con URL compartida
    async initialize(sharedBinId = null) {
        this.binId = sharedBinId || localStorage.getItem('bafarBinId');
        
        if (!this.binId) {
            // Crear nuevo bin compartido
            const newBin = await this.createSharedBin();
            if (newBin) {
                this.binId = newBin.id;
                localStorage.setItem('bafarBinId', this.binId);
                console.log('Nuevo bin creado:', this.binId);
                return this.binId;
            }
        }
        
        return this.binId;
    }

    // Crear nuevo espacio compartido
    async createSharedBin() {
        const defaultData = {
            project: "BAFAR Intelligence Hub",
            version: "1.0",
            lastUpdate: new Date().toISOString(),
            units: [
                { id: 1, name: 'DPC Carnes Frías', responsible: '', email: '', frequency: 'Semanal', status: 'Pendiente' },
                { id: 2, name: 'Food Service', responsible: '', email: '', frequency: 'Diaria', status: 'Pendiente' },
                { id: 3, name: 'Retail', responsible: '', email: '', frequency: 'Semanal', status: 'Pendiente' },
                { id: 4, name: 'Exportación', responsible: '', email: '', frequency: 'Diaria', status: 'Pendiente' },
                { id: 5, name: 'Agroindustrial', responsible: '', email: '', frequency: 'Semanal', status: 'Pendiente' }
            ],
            needs: {},
            research: {},
            metrics: { decisions: 0, opportunities: 0, risks: 0, time: 0 },
            startDate: new Date().toISOString().split('T')[0],
            progress: 5
        };

        // Inicializar needs y research
        defaultData.units.forEach(unit => {
            defaultData.needs[unit.id] = {
                critical: '', competitors: '', regulations: '', market: '', technology: ''
            };
            defaultData.research[unit.id] = { topics: [] };
        });

        try {
            const response = await fetch('https://api.jsonbin.io/v3/b', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Name': 'BAFAR Intelligence Hub'
                },
                body: JSON.stringify(defaultData)
            });

            if (response.ok) {
                const result = await response.json();
                return { id: result.metadata.id, data: defaultData };
            }
        } catch (error) {
            console.error('Error creating shared bin:', error);
        }
        
        return null;
    }

    // Cargar datos del servidor
    async loadData() {
        if (!this.binId) {
            console.warn('No bin ID available');
            return null;
        }

        try {
            const response = await fetch(`${this.syncUrl}${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (response.ok) {
                const result = await response.json();
                return result.record;
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        
        return null;
    }

    // Guardar datos al servidor
    async saveData(data) {
        if (!this.binId) {
            console.warn('No bin ID available for saving');
            return false;
        }

        try {
            data.lastUpdate = new Date().toISOString();
            data.version = (parseFloat(data.version || "1.0") + 0.1).toFixed(1);

            const response = await fetch(`${this.syncUrl}${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(data)
            });

            return response.ok;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Obtener URL para compartir
    getShareableUrl() {
        const currentUrl = window.location.href.split('?')[0];
        return `${currentUrl}?bin=${this.binId}`;
    }

    // Verificar si hay actualizaciones
    async checkForUpdates(currentVersion) {
        try {
            const serverData = await this.loadData();
            if (serverData && serverData.version !== currentVersion) {
                return {
                    hasUpdates: true,
                    serverVersion: serverData.version,
                    serverData: serverData
                };
            }
        } catch (error) {
            console.error('Error checking updates:', error);
        }
        
        return { hasUpdates: false };
    }

    // Sincronizar automáticamente
    startAutoSync(interval = 30000) { // 30 segundos
        setInterval(async () => {
            const currentData = window.dataManager?.getData();
            if (currentData) {
                const saved = await this.saveData(currentData);
                if (saved) {
                    console.log('Auto-sync completed');
                }
            }
        }, interval);
    }
}

// Función para configurar sincronización
async function setupCollaboration() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedBinId = urlParams.get('bin');
    
    if (sharedBinId) {
        // Unirse a sesión compartida
        console.log('Joining shared session:', sharedBinId);
        const syncManager = new SyncManager();
        await syncManager.initialize(sharedBinId);
        
        // Cargar datos compartidos
        const sharedData = await syncManager.loadData();
        if (sharedData && window.dataManager) {
            window.dataManager.appData = sharedData;
            window.uiController?.updateUI();
            
            Utils.showNotification('Conectado a sesión colaborativa', 'success');
            
            // Mostrar información de colaboración
            showCollaborationInfo(syncManager.getShareableUrl());
        }
        
        // Iniciar auto-sync
        syncManager.startAutoSync();
        window.syncManager = syncManager;
        
        return syncManager;
    }
    
    return null;
}

// Mostrar información de colaboración
function showCollaborationInfo(shareUrl) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; width: 90%;">
            <h3 style="color: #1e3a5f; margin-bottom: 20px;">🤝 Modo Colaborativo Activado</h3>
            <p>Comparte esta URL con tu equipo para trabajar juntos:</p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
                ${shareUrl}
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button onclick="navigator.clipboard.writeText('${shareUrl}'); Utils.showNotification('URL copiada', 'success')" 
                        style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Copiar URL
                </button>
                <button onclick="this.closest('div').parentElement.remove()" 
                        style="background: #1e3a5f; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para crear nueva sesión colaborativa
async function createCollaborativeSession() {
    const syncManager = new SyncManager();
    const binId = await syncManager.initialize();
    
    if (binId) {
        // Guardar datos actuales
        const currentData = window.dataManager?.getData();
        if (currentData) {
            await syncManager.saveData(currentData);
        }
        
        // Redirigir a URL colaborativa
        const shareUrl = syncManager.getShareableUrl();
        window.location.href = shareUrl;
    } else {
        Utils.showNotification('Error al crear sesión colaborativa', 'error');
    }
}

// Export para uso global
window.SyncManager = SyncManager;
window.setupCollaboration = setupCollaboration;
window.createCollaborativeSession = createCollaborativeSession;