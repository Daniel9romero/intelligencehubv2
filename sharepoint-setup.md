# Configuración para SharePoint - BAFAR Intelligence Hub

## 🎯 Objetivo
Subir toda la carpeta a SharePoint para que el equipo de BAFAR pueda acceder desde cualquier lugar.

## 📋 Pasos para SharePoint

### 1. Preparar Archivos
✅ Carpeta completa lista
✅ Archivo principal: `index.html` (funciona en SharePoint)
✅ Estructura modular mantenida

### 2. Subir a SharePoint
1. Ir a SharePoint de BAFAR
2. Crear nueva carpeta: "Intelligence Hub"
3. Subir TODA la carpeta del proyecto
4. Estructura final en SharePoint:

```
SharePoint > Intelligence Hub/
├── index.html                 ← Archivo principal
├── src/
│   ├── components/
│   ├── styles/
│   └── scripts/
├── README.md
└── otros archivos...
```

### 3. Acceso del Equipo
- **URL SharePoint**: https://bafar.sharepoint.com/sites/tu-site/Intelligence%20Hub/index.html
- **Permisos**: Dar acceso a todo el equipo de inteligencia
- **Sincronización**: Automática con OneDrive

## ⚠️ Limitaciones de SharePoint + HTML

### ❌ Problemas Actuales:
1. **Módulos no cargan**: SharePoint bloquea fetch() entre archivos
2. **CORS errors**: No puede cargar components/
3. **Solo funciona integrado**: Un solo archivo HTML

### ✅ Soluciones:

#### Opción A: Archivo Único (Recomendado para SharePoint)
- Usar: `bafar-hub-integrated.html`
- Renombrar a: `index.html`
- ✅ Funciona perfectamente en SharePoint
- ✅ Todo el equipo puede usar
- ✅ Sin problemas técnicos

#### Opción B: SharePoint + Power Platform
- Migrar a Power Apps
- Base de datos en SharePoint Lists
- ✅ Colaborativo real
- ✅ Permisos corporativos

## 🚀 Implementación Inmediata

### Para Hoy:
1. Copiar `bafar-hub-integrated.html`
2. Renombrar a `index.html`
3. Subir a SharePoint
4. Compartir URL con equipo

### Comando rápido:
```bash
copy "bafar-hub-integrated.html" "index.html"
```

## 📊 Datos Compartidos en SharePoint

### Limitación Actual:
- Cada usuario ve sus propios datos (localStorage)
- No hay sincronización automática

### Solución Futura:
- Migrar a SharePoint Lists
- Power Automate para sincronización
- Power BI para dashboards

## 🔄 Workflow Recomendado

1. **Fase 1** (Esta semana): HTML en SharePoint
2. **Fase 2** (Próximo mes): Power Apps + SharePoint Lists  
3. **Fase 3** (Futuro): Integración completa con sistemas BAFAR