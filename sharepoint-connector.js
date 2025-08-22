// SharePoint Connector for BAFAR Intelligence Hub
// Handles data synchronization with SharePoint

class SharePointConnector {
    constructor() {
        // Configure your SharePoint site URL here
        this.siteUrl = 'https://grupobafar.sharepoint.com/sites/Intelligence'; // CAMBIAR POR TU URL
        this.libraryName = 'BafarIntelligenceData'; // Nombre de la biblioteca
        this.fileName = 'data.json';
        this.accessToken = null;
        this.digest = null;
    }

    // Initialize SharePoint connection
    async init() {
        try {
            // Get the request digest for authentication
            await this.getRequestDigest();
            console.log('SharePoint connector initialized');
            return true;
        } catch (error) {
            console.error('Error initializing SharePoint:', error);
            return false;
        }
    }

    // Get request digest for SharePoint API calls
    async getRequestDigest() {
        try {
            const response = await fetch(`${this.siteUrl}/_api/contextinfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose'
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                this.digest = data.d.GetContextWebInformation.FormDigestValue;
                return this.digest;
            } else {
                throw new Error('Failed to get request digest');
            }
        } catch (error) {
            console.error('Error getting digest:', error);
            // For cross-origin, we might need to use a different approach
            return null;
        }
    }

    // Read data from SharePoint
    async readData() {
        try {
            const fileUrl = `${this.siteUrl}/_api/web/GetFolderByServerRelativeUrl('/sites/Intelligence/${this.libraryName}')/Files('${this.fileName}')/$value`;
            
            const response = await fetch(fileUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Data loaded from SharePoint:', data);
                return data;
            } else if (response.status === 404) {
                console.log('File not found in SharePoint, will create on first save');
                return null;
            } else {
                throw new Error(`SharePoint read failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Error reading from SharePoint:', error);
            
            // Alternative approach using direct URL
            try {
                const directUrl = `${this.siteUrl}/${this.libraryName}/${this.fileName}`;
                const response = await fetch(directUrl, {
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    return await response.json();
                }
            } catch (altError) {
                console.error('Alternative read also failed:', altError);
            }
            
            return null;
        }
    }

    // Write data to SharePoint
    async writeData(data) {
        try {
            // Ensure we have a fresh digest
            if (!this.digest) {
                await this.getRequestDigest();
            }

            const jsonString = JSON.stringify(data, null, 2);
            const fileContent = new Blob([jsonString], { type: 'application/json' });

            // Try to update existing file first
            const updateUrl = `${this.siteUrl}/_api/web/GetFolderByServerRelativeUrl('/sites/Intelligence/${this.libraryName}')/Files('${this.fileName}')/$value`;
            
            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'X-RequestDigest': this.digest,
                    'X-HTTP-Method': 'PUT',
                    'Content-Type': 'application/json'
                },
                body: fileContent,
                credentials: 'same-origin'
            });

            if (response.ok) {
                console.log('Data saved to SharePoint successfully');
                return true;
            } else if (response.status === 404) {
                // File doesn't exist, create it
                return await this.createFile(data);
            } else {
                throw new Error(`SharePoint write failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Error writing to SharePoint:', error);
            return false;
        }
    }

    // Create new file in SharePoint
    async createFile(data) {
        try {
            if (!this.digest) {
                await this.getRequestDigest();
            }

            const jsonString = JSON.stringify(data, null, 2);
            const createUrl = `${this.siteUrl}/_api/web/GetFolderByServerRelativeUrl('/sites/Intelligence/${this.libraryName}')/Files/add(url='${this.fileName}',overwrite=true)`;
            
            const response = await fetch(createUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'X-RequestDigest': this.digest,
                    'Content-Type': 'application/json'
                },
                body: jsonString,
                credentials: 'same-origin'
            });

            if (response.ok) {
                console.log('File created in SharePoint successfully');
                return true;
            } else {
                throw new Error(`Failed to create file: ${response.status}`);
            }
        } catch (error) {
            console.error('Error creating file in SharePoint:', error);
            return false;
        }
    }

    // Check if we're in SharePoint context
    isInSharePointContext() {
        // Check if we're running inside SharePoint
        return window.location.hostname.includes('sharepoint.com') || 
               window.location.hostname.includes('.sharepoint.') ||
               typeof _spPageContextInfo !== 'undefined';
    }

    // Get current user info
    async getCurrentUser() {
        try {
            const response = await fetch(`${this.siteUrl}/_api/web/currentuser`, {
                headers: {
                    'Accept': 'application/json;odata=verbose'
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    name: data.d.Title,
                    email: data.d.Email,
                    id: data.d.Id
                };
            }
        } catch (error) {
            console.error('Error getting user info:', error);
        }
        return null;
    }

    // Alternative: Use Microsoft Graph API (requires app registration)
    async useGraphAPI(accessToken) {
        this.accessToken = accessToken;
        
        try {
            // Read file using Graph API
            const siteId = await this.getSiteId();
            const driveId = await this.getDriveId(siteId);
            
            const response = await fetch(
                `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${this.fileName}:/content`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Graph API error:', error);
        }
        return null;
    }

    // Helper: Get Site ID for Graph API
    async getSiteId() {
        const hostname = 'grupobafar.sharepoint.com';
        const sitePath = '/sites/Intelligence';
        
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${hostname}:${sitePath}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            return data.id;
        }
        return null;
    }

    // Helper: Get Drive ID for Graph API
    async getDriveId(siteId) {
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            // Find the document library
            const library = data.value.find(drive => 
                drive.name === this.libraryName
            );
            return library ? library.id : null;
        }
        return null;
    }
}

// Export for use in main application
window.SharePointConnector = SharePointConnector;