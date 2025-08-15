// UI Controllers module
class UIController {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    // Update all UI elements
    updateUI() {
        this.updateDashboard();
        this.updateUnitsTable();
        this.updateNeedsSection();
        this.updateResearchMatrix();
        this.updateMetrics();
    }

    // Update dashboard
    updateDashboard() {
        const data = this.dataManager.getData();
        
        // Update days remaining
        const start = new Date(data.startDate);
        const today = new Date();
        const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, 90 - diff);
        
        const daysEl = document.getElementById('daysRemaining');
        if (daysEl) daysEl.textContent = remaining;
        
        const startDateEl = document.getElementById('startDate');
        if (startDateEl) startDateEl.textContent = data.startDate;
        
        // Update units count
        const totalUnits = data.units.length;
        const activeUnits = data.units.filter(u => u.responsible && u.responsible.trim() !== '').length;
        const unitsCountEl = document.getElementById('unitsCount');
        if (unitsCountEl) unitsCountEl.textContent = `${activeUnits}/${totalUnits}`;
        
        // Update progress
        const progressEl = document.getElementById('progressPercent');
        if (progressEl) progressEl.textContent = data.progress + '%';
    }

    // Update units table
    updateUnitsTable() {
        const tbody = document.getElementById('unitsTableBody');
        if (!tbody) return;
        
        const data = this.dataManager.getData();
        tbody.innerHTML = '';
        
        data.units.forEach((unit, index) => {
            const row = tbody.insertRow();
            
            // Index cell
            const cellIndex = row.insertCell(0);
            cellIndex.innerHTML = (index + 1);
            
            // Name cell
            const cellName = row.insertCell(1);
            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.value = unit.name;
            inputName.onchange = () => this.updateUnitField(unit.id, 'name', inputName.value);
            cellName.appendChild(inputName);
            
            // Responsible cell
            const cellResponsible = row.insertCell(2);
            const inputResponsible = document.createElement('input');
            inputResponsible.type = 'text';
            inputResponsible.value = unit.responsible || '';
            inputResponsible.placeholder = 'Nombre';
            inputResponsible.onchange = () => this.updateUnitField(unit.id, 'responsible', inputResponsible.value);
            cellResponsible.appendChild(inputResponsible);
            
            // Email cell
            const cellEmail = row.insertCell(3);
            const inputEmail = document.createElement('input');
            inputEmail.type = 'email';
            inputEmail.value = unit.email || '';
            inputEmail.placeholder = 'correo@bafar.com';
            inputEmail.onchange = () => this.updateUnitField(unit.id, 'email', inputEmail.value);
            cellEmail.appendChild(inputEmail);
            
            // Frequency cell
            const cellFrequency = row.insertCell(4);
            const selectFrequency = document.createElement('select');
            ['Diaria', 'Semanal', 'Quincenal', 'Mensual'].forEach(freq => {
                const option = document.createElement('option');
                option.value = freq;
                option.text = freq;
                if (unit.frequency === freq) option.selected = true;
                selectFrequency.appendChild(option);
            });
            selectFrequency.onchange = () => this.updateUnitField(unit.id, 'frequency', selectFrequency.value);
            cellFrequency.appendChild(selectFrequency);
            
            // Status cell
            const cellStatus = row.insertCell(5);
            const selectStatus = document.createElement('select');
            ['Pendiente', 'En Proceso', 'Activo'].forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.text = status;
                if (unit.status === status) option.selected = true;
                selectStatus.appendChild(option);
            });
            selectStatus.onchange = () => this.updateUnitField(unit.id, 'status', selectStatus.value);
            cellStatus.appendChild(selectStatus);
            
            // Action cell
            const cellAction = row.insertCell(6);
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-danger btn-small';
            btnDelete.textContent = 'Eliminar';
            btnDelete.onclick = () => this.removeUnit(unit.id);
            cellAction.appendChild(btnDelete);
        });
    }

    // Update needs section
    updateNeedsSection() {
        const container = document.getElementById('needsContainer');
        const emptyMessage = document.getElementById('emptyNeedsMessage');
        if (!container) return;
        
        const data = this.dataManager.getData();
        container.innerHTML = '';
        
        if (data.units.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            container.style.display = 'none';
            return;
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            container.style.display = 'grid';
        }
        
        data.units.forEach(unit => {
            const needs = data.needs[unit.id] || {};
            
            const unitDiv = document.createElement('div');
            unitDiv.className = 'unit-needs';
            unitDiv.innerHTML = `
                <div class="unit-header">${unit.name}</div>
                <div class="unit-body">
                    <div class="needs-section">
                        <h5>Información Crítica del Negocio</h5>
                        <textarea class="needs-input" 
                            placeholder="¿Qué información es vital para la operación diaria?"
                            onchange="window.uiController.updateNeedField(${unit.id}, 'critical', this.value)">${needs.critical || ''}</textarea>
                    </div>
                    <div class="needs-section">
                        <h5>Monitoreo de Competencia</h5>
                        <textarea class="needs-input" 
                            placeholder="¿Qué necesitas saber sobre la competencia?"
                            onchange="window.uiController.updateNeedField(${unit.id}, 'competitors', this.value)">${needs.competitors || ''}</textarea>
                    </div>
                    <div class="needs-section">
                        <h5>Regulaciones y Normatividad</h5>
                        <textarea class="needs-input" 
                            placeholder="¿Qué cambios regulatorios debes monitorear?"
                            onchange="window.uiController.updateNeedField(${unit.id}, 'regulations', this.value)">${needs.regulations || ''}</textarea>
                    </div>
                    <div class="needs-section">
                        <h5>Tendencias de Mercado</h5>
                        <textarea class="needs-input" 
                            placeholder="¿Qué tendencias del mercado impactan tu negocio?"
                            onchange="window.uiController.updateNeedField(${unit.id}, 'market', this.value)">${needs.market || ''}</textarea>
                    </div>
                    <div class="needs-section">
                        <h5>Innovación y Tecnología</h5>
                        <textarea class="needs-input" 
                            placeholder="¿Qué avances tecnológicos debes seguir?"
                            onchange="window.uiController.updateNeedField(${unit.id}, 'technology', this.value)">${needs.technology || ''}</textarea>
                    </div>
                </div>
            `;
            container.appendChild(unitDiv);
        });
    }

    // Update research matrix
    updateResearchMatrix() {
        const container = document.getElementById('researchMatrixContainer');
        if (!container) return;
        
        const data = this.dataManager.getData();
        container.innerHTML = '';
        
        if (data.units.length === 0) {
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; background: #f8f9fa; border-radius: 8px;">
                    <p style="color: #6c757d; font-size: 16px;">No hay unidades de negocio configuradas.</p>
                    <p style="color: #6c757d;">Agregue unidades en la pestaña "Unidades de Negocio".</p>
                </div>
            `;
            return;
        }
        
        data.units.forEach(unit => {
            const research = data.research[unit.id] || { topics: [] };
            const topicsCount = research.topics.length;
            
            const unitCard = document.createElement('div');
            unitCard.className = 'unit-research-card';
            unitCard.innerHTML = `
                <div class="unit-research-header" onclick="window.uiController.toggleResearchCard(${unit.id})">
                    <h3>${unit.name}</h3>
                    <div class="unit-info">
                        <span>Responsable: ${unit.responsible || 'No asignado'}</span>
                        <span>Tópicos: ${topicsCount}</span>
                        <span>Estado: ${unit.status}</span>
                        <span class="expand-icon">▼</span>
                    </div>
                </div>
                <div class="unit-research-body" id="research-body-${unit.id}" style="display: block;">
                    <div class="unit-summary">
                        <div class="summary-item">
                            <div class="summary-label">Total Tópicos</div>
                            <div class="summary-value">${topicsCount}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Investigaciones/Mes</div>
                            <div class="summary-value">${this.calculateMonthlyResearch(research.topics)}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Próxima Entrega</div>
                            <div class="summary-value">${this.getNextDelivery(research.topics)}</div>
                        </div>
                    </div>
                    
                    <h4>Tópicos de Investigación</h4>
                    <table class="research-topics-table">
                        <thead>
                            <tr>
                                <th width="25%">Tópico</th>
                                <th width="15%">Frecuencia</th>
                                <th width="15%">Próxima Fecha</th>
                                <th width="20%">Responsable</th>
                                <th width="15%">Prioridad</th>
                                <th width="10%">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="topics-table-${unit.id}">
                            ${this.generateTopicsRows(unit.id, research.topics)}
                        </tbody>
                    </table>
                    <button class="add-topic-btn" onclick="window.uiController.addResearchTopic(${unit.id})">+ Agregar Tópico</button>
                </div>
            `;
            container.appendChild(unitCard);
        });
    }

    // Update metrics
    updateMetrics() {
        const data = this.dataManager.getData();
        
        const decisionsEl = document.getElementById('metricDecisions');
        const opportunitiesEl = document.getElementById('metricOpportunities');
        const risksEl = document.getElementById('metricRisks');
        const timeEl = document.getElementById('metricTime');
        
        if (decisionsEl) decisionsEl.value = data.metrics.decisions || 0;
        if (opportunitiesEl) opportunitiesEl.value = data.metrics.opportunities || 0;
        if (risksEl) risksEl.value = data.metrics.risks || 0;
        if (timeEl) timeEl.value = data.metrics.time || 0;
    }

    // Event handlers
    updateUnitField(unitId, field, value) {
        this.dataManager.updateUnit(unitId, field, value);
        
        if (field === 'name') {
            this.updateNeedsSection();
            this.updateResearchMatrix();
        }
        
        if (field === 'responsible') {
            this.updateDashboard();
            this.updateResearchMatrix();
        }
    }

    updateNeedField(unitId, field, value) {
        this.dataManager.updateNeed(unitId, field, value);
    }

    addUnit(unitData) {
        const newUnit = this.dataManager.addUnit(unitData);
        this.updateUI();
        this.dataManager.saveData();
        this.showSaveIndicator();
        return newUnit;
    }

    removeUnit(unitId) {
        const unit = this.dataManager.getData().units.find(u => u.id === unitId);
        if (unit && confirm('¿Está seguro de eliminar esta unidad: ' + unit.name + '?')) {
            this.dataManager.removeUnit(unitId);
            this.updateUI();
            this.dataManager.saveData();
            alert('Unidad eliminada: ' + unit.name);
        }
    }

    addResearchTopic(unitId) {
        const newTopic = {
            topic: '',
            frequency: 'Semanal',
            nextDate: '',
            responsible: '',
            priority: 'Media'
        };
        
        this.dataManager.addResearchTopic(unitId, newTopic);
        this.updateResearchMatrix();
        this.dataManager.saveData();
    }

    updateResearchTopic(unitId, topicIndex, field, value) {
        this.dataManager.updateResearchTopic(unitId, topicIndex, field, value);
    }

    removeResearchTopic(unitId, topicIndex) {
        if (confirm('¿Eliminar este tópico de investigación?')) {
            this.dataManager.removeResearchTopic(unitId, topicIndex);
            this.updateResearchMatrix();
            this.dataManager.saveData();
        }
    }

    toggleResearchCard(unitId) {
        const body = document.getElementById(`research-body-${unitId}`);
        const header = body.previousElementSibling;
        
        if (body.style.display === 'none') {
            body.style.display = 'block';
            header.classList.add('expanded');
        } else {
            body.style.display = 'none';
            header.classList.remove('expanded');
        }
    }

    saveAllData() {
        // Save metrics from inputs
        const decisionsEl = document.getElementById('metricDecisions');
        const opportunitiesEl = document.getElementById('metricOpportunities');
        const risksEl = document.getElementById('metricRisks');
        const timeEl = document.getElementById('metricTime');
        
        if (decisionsEl) this.dataManager.updateMetric('decisions', decisionsEl.value);
        if (opportunitiesEl) this.dataManager.updateMetric('opportunities', opportunitiesEl.value);
        if (risksEl) this.dataManager.updateMetric('risks', risksEl.value);
        if (timeEl) this.dataManager.updateMetric('time', timeEl.value);
        
        if (this.dataManager.saveData()) {
            this.showSaveIndicator();
        } else {
            alert('Error al guardar los datos');
        }
    }

    showSaveIndicator() {
        const indicator = document.getElementById('saveIndicator');
        if (indicator) {
            indicator.style.display = 'block';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 2000);
        }
    }

    showSection(sectionId, button) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
        
        if (button) {
            document.querySelectorAll('.nav button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        }
    }

    // Helper methods
    generateTopicsRows(unitId, topics) {
        if (!topics || topics.length === 0) {
            return '<tr><td colspan="6" style="text-align: center; color: #6c757d;">No hay tópicos configurados</td></tr>';
        }
        
        return topics.map((topic, index) => `
            <tr class="${this.getPriorityClass(topic.priority)}">
                <td><input type="text" value="${topic.topic || ''}" onchange="window.uiController.updateResearchTopic(${unitId}, ${index}, 'topic', this.value)" placeholder="Nombre del tópico"></td>
                <td>
                    <select onchange="window.uiController.updateResearchTopic(${unitId}, ${index}, 'frequency', this.value)">
                        <option value="Diaria" ${topic.frequency === 'Diaria' ? 'selected' : ''}>Diaria</option>
                        <option value="Semanal" ${topic.frequency === 'Semanal' ? 'selected' : ''}>Semanal</option>
                        <option value="Quincenal" ${topic.frequency === 'Quincenal' ? 'selected' : ''}>Quincenal</option>
                        <option value="Mensual" ${topic.frequency === 'Mensual' ? 'selected' : ''}>Mensual</option>
                        <option value="Trimestral" ${topic.frequency === 'Trimestral' ? 'selected' : ''}>Trimestral</option>
                    </select>
                </td>
                <td><input type="date" value="${topic.nextDate || ''}" onchange="window.uiController.updateResearchTopic(${unitId}, ${index}, 'nextDate', this.value)"></td>
                <td><input type="text" value="${topic.responsible || ''}" onchange="window.uiController.updateResearchTopic(${unitId}, ${index}, 'responsible', this.value)" placeholder="Responsable"></td>
                <td>
                    <select onchange="window.uiController.updateResearchTopic(${unitId}, ${index}, 'priority', this.value)">
                        <option value="Alta" ${topic.priority === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Media" ${topic.priority === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Baja" ${topic.priority === 'Baja' ? 'selected' : ''}>Baja</option>
                    </select>
                </td>
                <td>
                    <button class="remove-topic-btn" onclick="window.uiController.removeResearchTopic(${unitId}, ${index})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    calculateMonthlyResearch(topics) {
        if (!topics || topics.length === 0) return 0;
        
        let monthly = 0;
        topics.forEach(topic => {
            if (topic && topic.frequency) {
                switch(topic.frequency) {
                    case 'Diaria': monthly += 30; break;
                    case 'Semanal': monthly += 4; break;
                    case 'Quincenal': monthly += 2; break;
                    case 'Mensual': monthly += 1; break;
                    case 'Trimestral': monthly += 0.33; break;
                }
            }
        });
        return Math.round(monthly);
    }

    getNextDelivery(topics) {
        if (!topics || topics.length === 0) return 'N/A';
        
        const dates = topics
            .filter(t => t && t.nextDate)
            .map(t => new Date(t.nextDate))
            .filter(d => !isNaN(d.getTime()) && d >= new Date())
            .sort((a, b) => a - b);
        
        if (dates.length === 0) return 'Sin fecha';
        
        const nextDate = dates[0];
        const options = { day: 'numeric', month: 'short' };
        return nextDate.toLocaleDateString('es-MX', options);
    }

    getPriorityClass(priority) {
        switch(priority) {
            case 'Alta': return 'priority-high';
            case 'Media': return 'priority-medium';
            case 'Baja': return 'priority-low';
            default: return '';
        }
    }
}

// Export for global use
window.UIController = UIController;