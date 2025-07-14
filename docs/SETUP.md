# Flow VCE Setup Guide

## Overview

Flow VCE is an AI-powered development platform for creating and deploying Walrus Sites with advanced project management, GitHub integration, and professional code editing capabilities.

## Features

### 🚀 Core Features
- **AI Website Generation**: Claude-powered site creation with natural language prompts
- **Code Editor**: Monaco Editor with syntax highlighting, auto-completion, and Git integration
- **Project Management**: Comprehensive project lifecycle management with collaboration features
- **GitHub Integration**: Full repository management, commits, branches, and deployments
- **Authentication**: Privy-powered authentication with GitHub, Twitter, and wallet connections
- **Deployment**: Direct deployment to Walrus Sites with custom domains and analytics

### 🔧 Technical Features
- **Real-time Collaboration**: Multi-user project editing and management
- **Version Control**: Git integration with branch management and pull requests
- **File Management**: Complete file tree with CRUD operations
- **Analytics**: Project analytics and performance monitoring
- **Responsive Design**: Mobile-first design with adaptive layouts
- **Dark Mode**: Professional dark theme optimized for development

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- A Privy account for authentication
- Anthropic Claude API key
- Sui wallet for Walrus deployment

### 1. Clone and Install

```bash
git clone https://github.com/your-org/flow-vce.git
cd flow-vce
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Claude API Configuration
NEXT_PUBLIC_CLAUDE_API_URL=https://api.anthropic.com/v1/messages

# Walrus Configuration
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space

# GitHub Integration (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Development Settings
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
```

### 3. Privy Setup

1. Sign up at [Privy Dashboard](https://dashboard.privy.io/)
2. Create a new app
3. Configure login methods:
   - Enable GitHub OAuth
   - Enable Twitter OAuth  
   - Enable Wallet connections
4. Copy your App ID to `NEXT_PUBLIC_PRIVY_APP_ID`

### 4. Claude API Setup

1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Users will input their API keys in the app settings

### 5. GitHub OAuth (Optional)

For enhanced GitHub integration:

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set callback URL to `http://localhost:3000/auth/github/callback`
4. Copy Client ID and Secret to environment variables

### 6. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` to access the application.

## Usage Guide

### 1. Authentication

- Click "Get Started" on the landing page
- Choose authentication method:
  - GitHub account
  - Twitter account
  - Sui wallet connection
- Complete the Privy authentication flow

### 2. Project Management

#### Creating Projects
1. Click "New Project" on the dashboard
2. Choose from templates or start from scratch
3. Configure project settings:
   - Name and description
   - Visibility (private/public/unlisted)
   - Category and tags
   - GitHub repository (optional)

#### Project Operations
- **Edit**: Modify project details and settings
- **Duplicate**: Create a copy of existing project
- **Archive**: Move to archived state
- **Delete**: Permanently remove project
- **Share**: Generate sharing links and collaborate

### 3. Code Editor

#### File Management
- **File Tree**: Navigate project structure
- **Create Files**: Add new files and folders
- **Edit**: Real-time code editing with syntax highlighting
- **Delete**: Remove files with confirmation
- **Rename**: Update file and folder names

#### Editor Features
- **Monaco Editor**: Professional code editor
- **Syntax Highlighting**: Support for 20+ languages
- **Auto-completion**: Intelligent code suggestions
- **Minimap**: Code overview and navigation
- **Search/Replace**: Advanced find and replace
- **Multiple Tabs**: Work with multiple files

#### Git Integration
- **Repository Connection**: Link GitHub repositories
- **Commit Changes**: Create commits with messages
- **Branch Management**: Create, switch, and delete branches
- **Push Changes**: Push to remote repository
- **Pull Requests**: Create and manage PRs
- **History**: View commit history and changes

### 4. AI Generation

#### Using Claude AI
1. Navigate to Generate tab
2. Write detailed prompts describing your site
3. Choose from templates or create custom prompts
4. Review generated code and preview
5. Edit and customize as needed

#### Best Practices
- Be specific about design requirements
- Mention desired features and functionality
- Specify target audience and use case
- Include branding and color preferences
- Request responsive design elements

### 5. Deployment

#### Walrus Sites Deployment
1. Configure Walrus credentials in settings
2. Navigate to Deploy tab in project
3. Review deployment settings
4. Click "Deploy Now"
5. Monitor deployment progress
6. Access deployed site via generated URL

#### Custom Domains
- Configure SuiNS names for custom URLs
- Set up redirects and headers
- Configure SSL certificates
- Monitor site analytics and performance

### 6. Collaboration

#### Team Management
- **Invite Collaborators**: Add team members to projects
- **Role Management**: Assign owner, admin, editor, viewer roles
- **Permissions**: Control access to different features
- **Activity Tracking**: Monitor team member contributions

#### Real-time Features
- **Live Editing**: See changes in real-time
- **Comments**: Add comments to code and files
- **Notifications**: Stay updated on project activity
- **Version History**: Track all changes and versions

## API Integration

### Claude API

The application integrates with Claude 3.5 Sonnet for:
- Website generation from natural language
- Code explanations and documentation
- Bug fixes and optimization suggestions
- Feature implementation assistance

### GitHub API

Full GitHub integration includes:
- Repository management
- File operations (CRUD)
- Commit and branch operations
- Pull request management
- Deployment to GitHub Pages

### Walrus API

Direct integration with Walrus Sites:
- File upload and management
- Site deployment and hosting
- Analytics and monitoring
- Custom domain configuration

## Troubleshooting

### Common Issues

#### Authentication Problems
- Verify Privy App ID is correct
- Check that login methods are enabled
- Clear browser cache and cookies
- Try different authentication method

#### API Errors
- Verify API keys are correctly configured
- Check API rate limits and quotas
- Ensure network connectivity
- Review API documentation for changes

#### Deployment Issues
- Verify Walrus credentials
- Check file size limits
- Ensure proper network configuration
- Review deployment logs

#### GitHub Integration
- Verify OAuth app configuration
- Check repository permissions
- Ensure access tokens are valid
- Review API rate limits

### Performance Optimization

#### Client-side
- Enable Monaco Editor minimap for large files
- Use code splitting for better loading
- Optimize image and asset sizes
- Enable browser caching

#### Server-side
- Implement API response caching
- Use CDN for static assets
- Optimize database queries
- Enable compression

## Development

### Architecture

```
src/
├── app/                  # Next.js app directory
├── components/           # React components
│   ├── CodeEditor.tsx   # Monaco Editor integration
│   ├── EnhancedFlowVCE.tsx # Main application
│   └── PreviewPanel.tsx # Site preview
├── lib/                 # Utility libraries
│   ├── api.ts          # API integrations
│   └── github.ts       # GitHub service
├── providers/           # React context providers
│   └── AuthProvider.tsx # Authentication context
├── types/              # TypeScript definitions
│   └── enhanced.ts     # Enhanced type definitions
└── styles/             # CSS and styling
```

### Key Technologies
- **Next.js 14**: React framework with app directory
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Monaco Editor**: Professional code editor
- **Privy**: Authentication infrastructure
- **Anthropic Claude**: AI language model
- **GitHub API**: Version control integration

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Security

### Best Practices
- Never commit API keys or secrets
- Use environment variables for configuration
- Implement proper input validation
- Follow OWASP security guidelines
- Regular dependency updates

### Data Protection
- User data is stored securely
- API keys are encrypted
- Session management via Privy
- HTTPS enforced in production

## Support

### Documentation
- [API Reference](./API.md)
- [Component Library](./COMPONENTS.md)
- [Deployment Guide](./DEPLOYMENT.md)

### Community
- [GitHub Issues](https://github.com/your-org/flow-vce/issues)
- [Discussions](https://github.com/your-org/flow-vce/discussions)
- [Discord Server](https://discord.gg/motion-labs)

### Professional Support
Contact Motion Labs for enterprise support and custom features.

---

Built with ❤️ by Motion Labs 