# BAFAR Intelligence Hub

Centro de Inteligencia Competitiva Personalizada por Unidad de Negocio

## 🚀 Características

- **Dashboard Ejecutivo**: Métricas en tiempo real y seguimiento de progreso
- **Gestión de Unidades**: Configuración de unidades de negocio y responsables
- **Necesidades de Información**: Mapeo personalizado por unidad
- **Matriz de Investigación**: Planificación y seguimiento de tópicos
- **Cronograma**: Timeline de implementación de 90 días
- **Métricas de Éxito**: KPIs de impacto del negocio

## 📁 Estructura del Proyecto

```
bafar-intelligence-hub/
├── src/
│   ├── components/           # Componentes HTML modulares
│   │   ├── dashboard/
│   │   ├── units/
│   │   ├── needs/
│   │   ├── research/
│   │   ├── timeline/
│   │   └── metrics/
│   ├── styles/              # Archivos CSS modulares
│   │   ├── base.css         # Estilos base y reset
│   │   ├── components.css   # Componentes reutilizables
│   │   └── modules.css      # Módulos específicos
│   ├── scripts/             # Módulos JavaScript
│   │   ├── data-manager.js  # Gestión de datos
│   │   ├── ui-controllers.js # Controladores de UI
│   │   └── utils.js         # Utilidades
│   └── assets/              # Recursos estáticos
│       ├── images/
│       ├── icons/
│       └── logos/
├── docs/                    # Documentación
├── tests/                   # Pruebas
├── index.html              # Archivo principal
└── README.md               # Este archivo
```

## 🛠️ Instalación y Uso

### Opción 1: Servidor Local
```bash
# Clonar el repositorio
git clone [url-del-repo]

# Navegar al directorio
cd bafar-intelligence-hub

# Servir con un servidor HTTP simple
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (si tienes npx)
npx serve .

# Acceder en el navegador
http://localhost:8000
```

### Opción 2: Abrir Directamente
Abre `index.html` directamente en tu navegador (algunas funciones pueden estar limitadas por CORS).

## 💾 Persistencia de Datos

Los datos se almacenan en `localStorage` del navegador:
- **Clave**: `bafarHub`
- **Formato**: JSON
- **Auto-guardado**: Cada 60 segundos

### Exportar/Importar Datos
- **Exportar**: Usar botones de exportación en cada sección
- **Importar**: Funcionalidad disponible en utilidades de desarrollo

## 🔧 Desarrollo

### Funciones de Desarrollo
Abre la consola del navegador y usa:

```javascript
// Acceder al gestor de datos
window.dev.dataManager()

// Acceder al controlador de UI
window.dev.uiController()

// Reiniciar aplicación
window.dev.resetApp()

// Exportar todos los datos
window.dev.exportAllData()
```

### Añadir Nuevos Componentes

1. Crear directorio en `src/components/nuevo-componente/`
2. Añadir `nuevo-componente.html`
3. Registrar en `index.html` en el array de componentes
4. Añadir estilos específicos en `src/styles/modules.css`

### Añadir Nuevas Funcionalidades

1. **Datos**: Extender `DataManager` en `data-manager.js`
2. **UI**: Añadir métodos en `UIController` en `ui-controllers.js`
3. **Utilidades**: Añadir funciones helper en `utils.js`

## 📊 Funcionalidades Principales

### Dashboard
- Contador de días restantes del proyecto
- Métricas de unidades activas
- Progreso del sprint actual
- Flujo de procesamiento de inteligencia

### Unidades de Negocio
- Registro de unidades y responsables
- Configuración de frecuencias de reporte
- Estados de configuración
- Gestión dinámica (agregar/eliminar)

### Necesidades de Información
- Información crítica del negocio
- Monitoreo de competencia
- Regulaciones y normatividad
- Tendencias de mercado
- Innovación y tecnología

### Matriz de Investigación
- Tópicos de investigación por unidad
- Asignación de responsables
- Frecuencias de actualización
- Prioridades configurables
- Seguimiento de fechas

### Cronograma
- Timeline de 90 días en 4 fases
- Progreso visual por fase
- Exportación de cronograma

### Métricas
- Decisiones informadas
- Oportunidades identificadas ($MXN)
- Riesgos mitigados
- Tiempo ahorrado (hrs)
- Reportes automáticos

## 🎨 Personalización

### Colores Corporativos
Los colores de BAFAR están definidos en `src/styles/base.css`:
- **Azul Principal**: `#1e3a5f`
- **Rojo Corporativo**: `#c41e3a`
- **Azul Secundario**: `#2c4158`

### Logotipos
Coloca los logos de BAFAR en `src/assets/logos/` y actualiza las referencias en los componentes.

## 🔒 Seguridad

- Sanitización de inputs implementada
- Validación de datos en cliente
- Almacenamiento local sin datos sensibles
- Sin comunicación con servidores externos (por ahora)

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa
- **Tablet**: Navegación adaptada
- **Mobile**: Interfaz simplificada

## 🚧 Roadmap

### Fase 2: Integración
- [ ] API REST para sincronización
- [ ] Base de datos backend
- [ ] Autenticación de usuarios
- [ ] Roles y permisos

### Fase 3: Inteligencia
- [ ] Conectores a fuentes externas
- [ ] Procesamiento automático de datos
- [ ] Alertas inteligentes
- [ ] Dashboards predictivos

### Fase 4: Colaboración
- [ ] Comentarios en documentos
- [ ] Workflow de aprobación
- [ ] Distribución automática
- [ ] Notificaciones push

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Grupo BAFAR. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo interno.

---

**BAFAR Intelligence Hub** - Transformando datos en ventaja competitiva 🎯