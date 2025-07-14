// API utilities for Claude and Walrus integration

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeneratedSite {
  html: string;
  css: string;
  js: string;
  assets: Record<string, string>;
  metadata: {
    title: string;
    description: string;
    theme: string;
    responsive: boolean;
  };
}

export interface WalrusDeployment {
  objectId: string;
  blobId: string;
  url: string;
  transactionDigest: string;
}

// Claude API integration
export class ClaudeAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateWebsite(prompt: string): Promise<GeneratedSite> {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          apiKey: this.apiKey
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const siteData = await response.json();
      return siteData;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to generate website with Claude AI');
    }
  }

  async refineWebsite(currentSite: GeneratedSite, refinementPrompt: string): Promise<GeneratedSite> {
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentSite,
          refinementPrompt,
          apiKey: this.apiKey
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const siteData = await response.json();
      return siteData;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to refine website with Claude AI');
    }
  }
}

// Walrus Sites deployment
export class WalrusAPI {
  private network: 'mainnet' | 'testnet';
  private privateKey: string;

  constructor(privateKey: string, network: 'mainnet' | 'testnet' = 'testnet') {
    this.privateKey = privateKey;
    this.network = network;
  }

  async deployWebsite(site: GeneratedSite, siteName: string): Promise<WalrusDeployment> {
    // This would integrate with the actual Walrus CLI or SDK
    // For now, we'll simulate the deployment process
    try {
      // In a real implementation, this would:
      // 1. Bundle the website files
      // 2. Upload to Walrus using the site-builder tool
      // 3. Create a Sui object for the site
      // 4. Return the deployment details
      
      const mockDeployment: WalrusDeployment = {
        objectId: '0x' + Math.random().toString(16).substr(2, 40),
        blobId: '0x' + Math.random().toString(16).substr(2, 40),
        url: `https://${siteName}.wal.app`,
        transactionDigest: '0x' + Math.random().toString(16).substr(2, 40)
      };

      // Simulate deployment time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return mockDeployment;
    } catch (error) {
      console.error('Walrus deployment error:', error);
      throw new Error('Failed to deploy to Walrus Sites');
    }
  }

  private createSiteBundle(site: GeneratedSite): Blob {
    // Create a complete website bundle
    // In a real implementation, this would create a proper bundle
    // with all assets organized correctly
    const bundle = new Blob([site.html], { type: 'text/html' });
    return bundle;
  }

  async getSiteStatus(objectId: string): Promise<{ status: string; url?: string }> {
    // This would check the status of a deployed site
    // For now, return a mock status
    return {
      status: 'published',
      url: `https://wal.app/${objectId}`
    };
  }
}

// Utility functions
export const validatePrivateKey = (key: string): boolean => {
  // Basic validation for Sui private key format
  return key.length === 64 && /^[0-9a-fA-F]+$/.test(key);
};

export const validateClaudeAPIKey = (key: string): boolean => {
  // Basic validation for Claude API key format
  return key.startsWith('sk-ant-api') && key.length > 20;
};

export const generateSiteName = (prompt: string): string => {
  // Generate a site name from the prompt
  const words = prompt.toLowerCase().split(' ').filter(word => 
    word.length > 2 && !['the', 'and', 'for', 'with'].includes(word)
  );
  
  const name = words.slice(0, 3).join('-').replace(/[^a-z0-9-]/g, '');
  return name || 'my-site';
};

export const estimateGenerationTime = (prompt: string): number => {
  // Estimate generation time based on prompt complexity
  const baseTime = 5000; // 5 seconds base
  const complexityFactors = {
    'animation': 2000,
    '3d': 3000,
    'interactive': 2000,
    'dashboard': 3000,
    'ecommerce': 4000
  };
  
  let additionalTime = 0;
  Object.entries(complexityFactors).forEach(([keyword, time]) => {
    if (prompt.toLowerCase().includes(keyword)) {
      additionalTime += time;
    }
  });
  
  return baseTime + additionalTime;
}; 