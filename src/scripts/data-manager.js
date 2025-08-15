// Data management module
class DataManager {
    constructor() {
        this.appData = {
            units: [],
            needs: {},
            research: {},
            metrics: {},
            startDate: new Date().toISOString().split('T')[0],
            progress: 5
        };
    }

    // Initialize the application data
    initApp() {
        const saved = localStorage.getItem('bafarHub');
        if (saved) {
            try {
                this.appData = JSON.parse(saved);
                
                // Migrate old data structure to include research
                if (!this.appData.research) {
                    console.log('Migrating old data structure...');
                    this.appData.research = {};
                }
                
                // Ensure each unit has research data
                if (this.appData.units && this.appData.units.length > 0) {
                    this.appData.units.forEach(unit => {
                        if (!this.appData.research[unit.id]) {
                            console.log('Creating research data for unit:', unit.name);
                            this.appData.research[unit.id] = { topics: [] };
                        }
                    });
                    
                    this.saveData();
                    console.log('Data migration completed');
                }
                
            } catch (e) {
                console.error('Error loading saved data, starting fresh');
                this.initDefaultData();
            }
        } else {
            this.initDefaultData();
        }
    }

    // Initialize with default data
    initDefaultData() {
        this.appData = {
            units: [
                { id: 1, name: 'DPC Carnes Frias', responsible: '', email: '', frequency: 'Semanal', status: 'Pendiente' },
                { id: 2, name: 'Food Service', responsible: '', email: '', frequency: 'Diaria', status: 'Pendiente' },
                { id: 3, name: 'Retail', responsible: '', email: '', frequency: 'Semanal', status: 'Pendiente' },
                { id: 4, name: 'Exportacion', responsible: '', email: '', frequency: 'Diaria', status: 'Pendiente' },
                { id: 5, name: 'Agroindustrial', responsible: '', email: '', frequency: 'Semanal', status: 'Pendiente' }
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
            progress: 5
        };
        
        // Initialize needs and research for each unit
        this.appData.units.forEach(unit => {
            this.appData.needs[unit.id] = {
                critical: '',
                competitors: '',
                regulations: '',
                market: '',
                technology: ''
            };
            
            this.appData.research[unit.id] = {
                topics: []
            };
        });
    }

    // Get current data
    getData() {
        return this.appData;
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('bafarHub', JSON.stringify(this.appData));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }

    // Unit management
    addUnit(unitData) {
        let newId = 1;
        if (this.appData.units.length > 0) {
            const maxId = Math.max(...this.appData.units.map(u => u.id || 0));
            newId = maxId + 1;
        }
        
        const newUnit = {
            id: newId,
            name: unitData.name,
            responsible: unitData.responsible || '',
            email: unitData.email || '',
            frequency: unitData.frequency || 'Semanal',
            status: unitData.status || 'Pendiente'
        };
        
        this.appData.units.push(newUnit);
        
        // Initialize needs and research
        this.appData.needs[newId] = {
            critical: '',
            competitors: '',
            regulations: '',
            market: '',
            technology: ''
        };
        
        this.appData.research[newId] = {
            topics: []
        };
        
        return newUnit;
    }

    removeUnit(unitId) {
        const index = this.appData.units.findIndex(unit => unit.id === unitId);
        if (index !== -1) {
            this.appData.units.splice(index, 1);
            
            // Remove associated data
            delete this.appData.needs[unitId];
            delete this.appData.research[unitId];
            
            return true;
        }
        return false;
    }

    updateUnit(unitId, field, value) {
        const unit = this.appData.units.find(u => u.id === unitId);
        if (unit) {
            unit[field] = value;
            return true;
        }
        return false;
    }

    // Needs management
    updateNeed(unitId, field, value) {
        if (!this.appData.needs[unitId]) {
            this.appData.needs[unitId] = {};
        }
        this.appData.needs[unitId][field] = value;
    }

    // Research management
    addResearchTopic(unitId, topicData) {
        if (!this.appData.research[unitId]) {
            this.appData.research[unitId] = { topics: [] };
        }
        
        const newTopic = {
            topic: topicData.topic || '',
            frequency: topicData.frequency || 'Semanal',
            nextDate: topicData.nextDate || '',
            responsible: topicData.responsible || '',
            priority: topicData.priority || 'Media'
        };
        
        this.appData.research[unitId].topics.push(newTopic);
        return newTopic;
    }

    updateResearchTopic(unitId, topicIndex, field, value) {
        if (this.appData.research[unitId] && this.appData.research[unitId].topics[topicIndex]) {
            this.appData.research[unitId].topics[topicIndex][field] = value;
            return true;
        }
        return false;
    }

    removeResearchTopic(unitId, topicIndex) {
        if (this.appData.research[unitId] && this.appData.research[unitId].topics) {
            this.appData.research[unitId].topics.splice(topicIndex, 1);
            return true;
        }
        return false;
    }

    // Metrics management
    updateMetric(field, value) {
        this.appData.metrics[field] = value;
    }

    // Reset all data
    resetData() {
        localStorage.removeItem('bafarHub');
        this.initDefaultData();
    }

    // Fix data structure
    fixDataStructure() {
        let fixed = false;
        
        if (!this.appData.research) {
            this.appData.research = {};
            fixed = true;
        }
        
        this.appData.units.forEach(unit => {
            if (!this.appData.research[unit.id]) {
                this.appData.research[unit.id] = { topics: [] };
                fixed = true;
            }
            
            if (!this.appData.needs[unit.id]) {
                this.appData.needs[unit.id] = {
                    critical: '',
                    competitors: '',
                    regulations: '',
                    market: '',
                    technology: ''
                };
                fixed = true;
            }
        });
        
        if (fixed) {
            this.saveData();
        }
        
        return fixed;
    }
}

// Export for use in other modules
window.DataManager = DataManager;