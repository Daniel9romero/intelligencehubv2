# Configuración de SharePoint para BAFAR Intelligence Hub

## Pasos para configurar SharePoint:

### 1. Crear la Biblioteca de Documentos en SharePoint

1. **Accede a tu sitio de SharePoint**
   - Ve a: `https://grupobafar.sharepoint.com/sites/[TuSitio]`
   - O crea un nuevo sitio llamado "Intelligence"

2. **Crea una nueva biblioteca de documentos:**
   - Click en el engranaje ⚙️ (Configuración)
   - Selecciona "Contenido del sitio"
   - Click en "+ Nuevo" → "Biblioteca de documentos"
   - Nombre: `BafarIntelligenceData`
   - Descripción: "Datos del Intelligence Hub"
   - Click en "Crear"

3. **Sube el archivo data.json inicial:**
   - Abre la biblioteca `BafarIntelligenceData`
   - Click en "Cargar" → "Archivos"
   - Selecciona el archivo `data.json` de tu proyecto
   - Click en "Abrir"

### 2. Configurar Permisos

1. **En la biblioteca de documentos:**
   - Click en el engranaje ⚙️ → "Configuración de la biblioteca"
   - Click en "Permisos para esta biblioteca"
   - Asegúrate de que:
     - Los editores tengan permisos de "Edición"
     - Los lectores tengan permisos de "Lectura"

### 3. Obtener la URL de tu sitio

1. **Copia la URL de tu sitio de SharePoint:**
   - Ejemplo: `https://grupobafar.sharepoint.com/sites/Intelligence`
   - Guarda esta URL, la necesitarás para configurar el código

### 4. Actualizar el Código

1. **Edita el archivo `sharepoint-connector.js`:**
   ```javascript
   // Línea 5 - Cambia esta URL por la de tu sitio
   this.siteUrl = 'https://grupobafar.sharepoint.com/sites/Intelligence';
   ```

2. **Si tu biblioteca tiene otro nombre:**
   ```javascript
   // Línea 6 - Cambia el nombre de la biblioteca si es diferente
   this.libraryName = 'BafarIntelligenceData';
   ```

### 5. Opciones de Implementación

#### Opción A: Hospedar en SharePoint (Recomendado)
1. Sube todos los archivos HTML, JS y CSS a SharePoint
2. Crea una página de SharePoint y embebe el HTML
3. Los permisos se manejarán automáticamente

#### Opción B: Usar desde GitHub Pages con CORS
1. Necesitarás configurar CORS en SharePoint:
   - Ve a SharePoint Admin Center
   - Configuración → CORS
   - Agrega: `https://daniel9romero.github.io`

#### Opción C: Usar Microsoft Graph API (Más complejo)
1. Registra una aplicación en Azure AD
2. Obtén permisos para SharePoint
3. Usa el token para autenticación

### 6. Probar la Conexión

1. **Abre la consola del navegador** (F12)
2. **Navega a tu aplicación**
3. **Busca mensajes como:**
   - "SharePoint connector initialized"
   - "Data loaded from SharePoint"
   - "Data saved to SharePoint successfully"

### 7. Solución de Problemas

#### Error: "Access Denied"
- Verifica que tienes permisos en la biblioteca
- Asegúrate de estar autenticado en SharePoint

#### Error: "CORS blocked"
- La aplicación debe estar hospedada en SharePoint
- O configurar CORS en SharePoint Admin

#### Error: "File not found"
- Verifica que el archivo data.json existe en la biblioteca
- Confirma el nombre de la biblioteca es correcto

### 8. URL de SharePoint Comunes

Dependiendo de tu configuración, tu URL podría ser:
- `https://grupobafar.sharepoint.com/sites/Intelligence`
- `https://grupobafar.sharepoint.com/sites/IT/Intelligence`
- `https://grupobafar.sharepoint.com/teams/Intelligence`
- `https://grupobafar-my.sharepoint.com/personal/tu_usuario/`

### 9. Verificar Funcionamiento

1. **Edita una unidad de negocio**
2. **Click en "💾 Sincronizar Cambios"**
3. **Verifica en SharePoint** que el archivo data.json se actualizó
4. **Abre en otro navegador** y confirma que ve los mismos datos

## Notas Importantes:

- **Seguridad:** SharePoint maneja la autenticación automáticamente
- **Permisos:** Los usuarios necesitan al menos permisos de lectura
- **Backup:** SharePoint guarda versiones automáticamente
- **Límites:** El archivo JSON no debe exceder 15MB

## Contacto para Soporte:

Si necesitas ayuda con la configuración de SharePoint:
1. Contacta al equipo de IT de Grupo BAFAR
2. Solicita:
   - Creación del sitio "Intelligence" si no existe
   - Permisos de propietario en el sitio
   - Ayuda con CORS si es necesario