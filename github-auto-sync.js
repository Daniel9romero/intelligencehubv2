// GitHub Auto-Sync Module for BAFAR Intelligence Hub
// Automatically commits and pushes data.json changes to GitHub

class GitHubAutoSync {
    constructor() {
        // IMPORTANTE: Ahora usamos un repositorio PRIVADO para los datos
        this.repo = 'Daniel9romero/BafarIntelligence-Data'; // Repo PRIVADO
        this.publicRepo = 'Daniel9romero/BafarIntelligence'; // Repo PÚBLICO (solo código)
        this.branch = 'main';
        this.filePath = 'data.json';
        
        // Try to load token from localStorage first
        // NOTA: Este token DEBE tener permisos para el repo privado
        this.token = localStorage.getItem('github_private_token') || localStorage.getItem('github_token') || '';
        
        this.apiUrl = 'https://api.github.com';
        this.currentSHA = null;
        
        // Mode: 'private' or 'public'
        this.mode = 'private'; // Cambiar a 'public' para usar el repo público
        
        // Log token status (without showing the actual token)
        if (this.token && this.token !== '') {
            console.log('🔐 GitHub token loaded for private repository');
        } else {
            console.log('⚠️ GitHub token not configured - will prompt user');
        }
    }

    // Set GitHub token (para configuración dinámica)
    setToken(token) {
        this.token = token;
    }

    // Get current file SHA (needed for updates)
    async getCurrentSHA() {
        try {
            const response = await fetch(`${this.apiUrl}/repos/${this.repo}/contents/${this.filePath}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentSHA = data.sha;
                return data.sha;
            } else if (response.status === 404) {
                console.log('File does not exist yet, will create it');
                return null;
            } else {
                throw new Error(`Failed to get file SHA: ${response.status}`);
            }
        } catch (error) {
            console.error('Error getting file SHA:', error);
            return null;
        }
    }

    // Commit and push data to GitHub
    async saveToGitHub(data, commitMessage = null) {
        try {
            if (!this.token || this.token === 'GITHUB_TOKEN_AQUI') {
                throw new Error('GitHub token not configured');
            }

            // Update metadata
            data.lastUpdate = new Date().toISOString();
            data.lastEditor = window.bafarHub?.user?.username || 'Usuario';

            // Get current file SHA
            await this.getCurrentSHA();

            // Prepare commit message
            const defaultMessage = `Actualizar datos Intelligence Hub - ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`;
            const message = commitMessage || defaultMessage;

            // Convert data to base64
            const jsonString = JSON.stringify(data, null, 2);
            const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

            // Prepare request body
            const requestBody = {
                message: message,
                content: base64Content,
                branch: this.branch
            };

            // Add SHA if file exists (for update)
            if (this.currentSHA) {
                requestBody.sha = this.currentSHA;
            }

            // Make the commit
            const response = await fetch(`${this.apiUrl}/repos/${this.repo}/contents/${this.filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Successfully saved to GitHub:', result);
                
                // Update current SHA for next operation
                this.currentSHA = result.content.sha;
                
                return {
                    success: true,
                    sha: result.content.sha,
                    url: result.content.html_url,
                    message: message
                };
            } else {
                const error = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${error.message}`);
            }
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get commit history
    async getCommitHistory(limit = 10) {
        try {
            const response = await fetch(`${this.apiUrl}/repos/${this.repo}/commits?path=${this.filePath}&per_page=${limit}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const commits = await response.json();
                return commits.map(commit => ({
                    sha: commit.sha.substring(0, 7),
                    message: commit.commit.message,
                    author: commit.commit.author.name,
                    date: new Date(commit.commit.author.date).toLocaleString('es-ES'),
                    url: commit.html_url
                }));
            }
        } catch (error) {
            console.error('Error getting commit history:', error);
        }
        return [];
    }

    // Check if token is valid
    async validateToken() {
        try {
            const response = await fetch(`${this.apiUrl}/repos/${this.repo}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    }

    // Create GitHub token instructions
    getTokenInstructions() {
        return `
## Cómo crear un GitHub Token:

1. Ve a GitHub.com y haz login
2. Click en tu foto de perfil → Settings
3. En el menú izquierdo: Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token → Generate new token (classic)
6. Nombre: "BAFAR Intelligence Hub"
7. Selecciona scopes:
   ✅ repo (Full control of private repositories)
   ✅ workflow (Update GitHub Action workflows)
8. Click "Generate token"
9. COPIA EL TOKEN (solo se muestra una vez)
10. Pégalo en github-auto-sync.js línea 10

Ejemplo de token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        `;
    }
}

// Global instance
window.GitHubAutoSync = GitHubAutoSync;