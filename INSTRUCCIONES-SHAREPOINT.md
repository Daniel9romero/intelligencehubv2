# 🎯 INSTRUCCIONES PARA SHAREPOINT - SISTEMA DE DATOS COMPARTIDOS

## ✅ SOLUCIÓN IMPLEMENTADA

### **Para Ti (Administrador):**
- **Editas**: `data.json` directamente en SharePoint
- **Control total**: Modificas toda la información
- **Sin HTML**: Solo editas el archivo JSON

### **Para el Equipo (Visualización):**
- **Ven**: `index-shared.html` que carga datos automáticamente
- **Solo lectura**: No pueden modificar nada
- **Auto-actualización**: Cada 30 segundos

---

## 📂 ARCHIVOS A SUBIR A SHAREPOINT

### 1. **data.json** ← TÚ EDITAS ESTE
```
data.json (archivo JSON con todos los datos)
```

### 2. **index-shared.html** ← EL EQUIPO USA ESTE
```
index-shared.html (interfaz de solo lectura)
```

---

## 🚀 PASOS PARA IMPLEMENTAR

### **Paso 1: Subir a SharePoint**
1. Ve a SharePoint de BAFAR
2. Crea carpeta: **"Intelligence Hub"**
3. Sube estos 2 archivos:
   - `data.json`
   - `index-shared.html`

### **Paso 2: Compartir con Equipo**
1. **URL para el equipo**: `https://bafar.sharepoint.com/.../Intelligence%20Hub/index-shared.html`
2. **Dar permisos de LECTURA** al equipo
3. **Dar permisos de EDICIÓN** solo a ti para `data.json`

### **Paso 3: Para Editar Datos (Solo Tú)**
1. Abrir `data.json` en SharePoint
2. Editar directamente en el navegador o descargar/subir
3. Guardar cambios
4. **Los cambios se reflejan automáticamente** en el equipo

---

## 📊 CÓMO EDITAR LOS DATOS

### **Estructura del JSON:**

```json
{
  "units": [
    {
      "id": 1,
      "name": "DPC Carnes Frías",
      "responsible": "Juan Pérez",
      "email": "juan.perez@bafar.com",
      "frequency": "Semanal",
      "status": "Activo"
    }
  ],
  "needs": {
    "1": {
      "critical": "Texto aquí...",
      "competitors": "Texto aquí...",
      "regulations": "Texto aquí...",
      "market": "Texto aquí...",
      "technology": "Texto aquí..."
    }
  },
  "research": {
    "1": {
      "topics": [
        {
          "topic": "Análisis competitivo",
          "frequency": "Mensual",
          "nextDate": "2024-01-15",
          "responsible": "Equipo Inteligencia",
          "priority": "Alta"
        }
      ]
    }
  },
  "metrics": {
    "decisions": 5,
    "opportunities": 2500000,
    "risks": 3,
    "time": 45
  },
  "progress": 25,
  "lastUpdate": "2024-12-19",
  "lastEditor": "Jose Daniel Lopez"
}
```

### **Campos que Puedes Modificar:**

#### **Unidades (`units`):**
- `name`: Nombre de la unidad
- `responsible`: Responsable asignado
- `email`: Email del responsable
- `frequency`: Diaria, Semanal, Quincenal, Mensual
- `status`: Pendiente, En Proceso, Activo

#### **Necesidades (`needs`):**
- `critical`: Información crítica del negocio
- `competitors`: Monitoreo de competencia
- `regulations`: Regulaciones y normatividad
- `market`: Tendencias de mercado
- `technology`: Innovación y tecnología

#### **Investigación (`research`):**
- `topic`: Nombre del tópico
- `frequency`: Diaria, Semanal, Quincenal, Mensual, Trimestral
- `nextDate`: Fecha en formato YYYY-MM-DD
- `responsible`: Responsable del tópico
- `priority`: Alta, Media, Baja

#### **Métricas (`metrics`):**
- `decisions`: Número de decisiones informadas
- `opportunities`: Oportunidades en pesos mexicanos
- `risks`: Número de riesgos mitigados
- `time`: Tiempo ahorrado en horas

#### **Progreso:**
- `progress`: Porcentaje de 0 a 100
- `lastUpdate`: Fecha de última actualización
- `lastEditor`: Tu nombre

---

## 🔄 FLUJO DE TRABAJO

### **Para Ti:**
1. Abrir `data.json` en SharePoint
2. Hacer cambios necesarios
3. Guardar archivo
4. **¡Listo!** Los cambios aparecen automáticamente

### **Para el Equipo:**
1. Abrir `index-shared.html`
2. Ver datos actualizados automáticamente
3. Exportar reportes si necesitan
4. **No pueden modificar nada**

---

## ⚡ CARACTERÍSTICAS AUTOMÁTICAS

### **Auto-actualización:**
- Cada 30 segundos verifica cambios
- Indicador de conexión en tiempo real
- Modo offline si hay problemas

### **Indicadores Visuales:**
- 🟢 Verde: Conectado y actualizado
- 🔴 Rojo: Sin conexión o error

### **Datos de Ejemplo:**
- Ya incluye datos realistas de BAFAR
- Necesidades específicas por unidad
- Tópicos de investigación configurados
- Métricas con valores iniciales

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### **Si el equipo no ve actualizaciones:**
1. Verificar permisos en SharePoint
2. Refrescar página (F5)
3. Verificar que `data.json` esté en la misma carpeta

### **Si hay errores de conexión:**
1. Verificar URL del archivo JSON
2. Confirmar permisos de lectura
3. Usar modo local como respaldo

### **Para agregar nuevas unidades:**
1. Copiar estructura de unidad existente
2. Cambiar ID (usar siguiente número)
3. Agregar entradas en `needs` y `research` con el mismo ID

---

## 📞 SOPORTE

Para dudas o problemas:
- Verificar formato JSON en: https://jsonlint.com/
- Contactar equipo de desarrollo interno
- Revisar logs en consola del navegador (F12)

---

## ✨ VENTAJAS DE ESTA SOLUCIÓN

### **Para Ti:**
- ✅ Control total de los datos
- ✅ Edición simple con JSON
- ✅ Sin necesidad de conocer HTML
- ✅ Cambios instantáneos

### **Para el Equipo:**
- ✅ Interfaz profesional
- ✅ Datos siempre actualizados
- ✅ Solo lectura (no pueden romper nada)
- ✅ Exportación de reportes

### **Para BAFAR:**
- ✅ Datos centralizados en SharePoint
- ✅ Control de permisos corporativo
- ✅ Fácil de mantener
- ✅ Escalable a futuro