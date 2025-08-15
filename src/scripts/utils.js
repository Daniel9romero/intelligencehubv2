// Utility functions
class Utils {
    // Format date for display
    static formatDate(dateString) {
        if (!dateString) return 'No definida';
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('es-MX', options);
    }

    // Calculate days between dates
    static daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    }

    // Validate email format
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Generate unique ID
    static generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Debounce function calls
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Format currency
    static formatCurrency(amount, currency = 'MXN') {
        const formatter = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: currency,
        });
        return formatter.format(amount);
    }

    // Export data to JSON
    static exportToJSON(data, filename = 'bafar-intelligence-data.json') {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    // Import data from JSON file
    static importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('Archivo JSON inválido'));
                }
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file);
        });
    }

    // Calculate progress percentage
    static calculateProgress(current, total) {
        if (total === 0) return 0;
        return Math.round((current / total) * 100);
    }

    // Sanitize HTML to prevent XSS
    static sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Create notification
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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

    // Local storage helpers
    static setLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    }

    static getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    }

    // Check if device is mobile
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // Scroll to element
    static scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    // Copy text to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Texto copiado al portapapeles', 'success');
            return true;
        } catch (err) {
            console.error('Error copying to clipboard:', err);
            this.showNotification('Error al copiar texto', 'error');
            return false;
        }
    }

    // Generate report summary
    static generateReportSummary(data) {
        const totalUnits = data.units.length;
        const activeUnits = data.units.filter(u => u.responsible && u.responsible.trim() !== '').length;
        const totalTopics = Object.values(data.research || {})
            .reduce((acc, unit) => acc + (unit.topics ? unit.topics.length : 0), 0);
        
        return {
            totalUnits,
            activeUnits,
            totalTopics,
            completionRate: Utils.calculateProgress(activeUnits, totalUnits),
            lastUpdate: new Date().toLocaleDateString('es-MX')
        };
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export for global use
window.Utils = Utils;