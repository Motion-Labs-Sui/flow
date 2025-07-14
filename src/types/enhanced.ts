// Enhanced types for Flow VCE with comprehensive project management and user features

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  walletAddress?: string;
  githubUsername?: string;
  twitterHandle?: string;
  createdAt: Date;
  lastLogin: Date;
  subscription: 'free' | 'pro' | 'enterprise';
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: string;
  notifications: {
    deployment: boolean;
    updates: boolean;
    collaboration: boolean;
  };
  editor: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
    autoSave: boolean;
  };
}

export interface EnhancedProject {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  collaborators: ProjectCollaborator[];
  repository?: GitRepository;
  walrusObjectId?: string;
  suinsName?: string;
  customDomain?: string;
  status: 'draft' | 'published' | 'deploying' | 'failed' | 'archived';
  visibility: 'private' | 'public' | 'unlisted';
  tags: string[];
  category: string;
  createdAt: Date;
  lastModified: Date;
  lastDeployment?: Date;
  deploymentHistory: DeploymentRecord[];
  analytics?: ProjectAnalytics;
  generatedSite?: GeneratedSite;
  sourceFiles: SourceFile[];
  settings: ProjectSettings;
}

export interface ProjectCollaborator {
  userId: string;
  username: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  addedAt: Date;
  addedBy: string;
}

export interface GitRepository {
  provider: 'github' | 'gitlab' | 'custom';
  url: string;
  owner: string;
  name: string;
  branch: string;
  accessToken?: string;
  lastSync?: Date;
  autoSync: boolean;
  webhookUrl?: string;
}

export interface SourceFile {
  id: string;
  path: string;
  content: string;
  language: string;
  size: number;
  lastModified: Date;
  modifiedBy: string;
  isGenerated: boolean;
  isEditable: boolean;
}

export interface ProjectSettings {
  buildCommand?: string;
  outputDirectory: string;
  environmentVariables: Record<string, string>;
  redirects: RedirectRule[];
  headers: HeaderRule[];
  seo: SEOSettings;
}

export interface RedirectRule {
  from: string;
  to: string;
  status: number;
  condition?: string;
}

export interface HeaderRule {
  path: string;
  headers: Record<string, string>;
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords: string[];
  ogImage?: string;
  twitterCard: 'summary' | 'summary_large_image';
  robots: string;
}

export interface DeploymentRecord {
  id: string;
  projectId: string;
  version: string;
  status: 'pending' | 'building' | 'deployed' | 'failed' | 'cancelled';
  walrusObjectId?: string;
  deploymentUrl?: string;
  logs: DeploymentLog[];
  startedAt: Date;
  completedAt?: Date;
  triggeredBy: string;
  commit?: {
    hash: string;
    message: string;
    author: string;
    timestamp: Date;
  };
  metrics?: DeploymentMetrics;
}

export interface DeploymentLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  details?: Record<string, unknown>;
}

export interface DeploymentMetrics {
  buildTime: number;
  deployTime: number;
  totalSize: number;
  fileCount: number;
  compressionRatio: number;
}

export interface ProjectAnalytics {
  views: AnalyticsData[];
  visitors: AnalyticsData[];
  countries: CountryData[];
  devices: DeviceData[];
  referrers: ReferrerData[];
  performance: PerformanceData;
  lastUpdated: Date;
}

export interface AnalyticsData {
  date: string;
  value: number;
}

export interface CountryData {
  country: string;
  code: string;
  visitors: number;
  percentage: number;
}

export interface DeviceData {
  type: 'desktop' | 'mobile' | 'tablet';
  visitors: number;
  percentage: number;
}

export interface ReferrerData {
  domain: string;
  visitors: number;
  percentage: number;
}

export interface PerformanceData {
  averageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface GeneratedSite {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author?: string;
  };
  files: {
    [path: string]: {
      content: string;
      type: 'html' | 'css' | 'js' | 'json' | 'md' | 'image' | 'other';
      size: number;
      dependencies?: string[];
    };
  };
  structure: FileTreeNode[];
  dependencies: ProjectDependency[];
  buildInfo: {
    framework?: string;
    bundler?: string;
    plugins: string[];
    optimization: OptimizationSettings;
  };
}

export interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileTreeNode[];
  size?: number;
  language?: string;
}

export interface ProjectDependency {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency' | 'peerDependency';
  description?: string;
  license?: string;
}

export interface OptimizationSettings {
  minifyHTML: boolean;
  minifyCSS: boolean;
  minifyJS: boolean;
  compressImages: boolean;
  generateSourceMaps: boolean;
  treeshaking: boolean;
  codesplitting: boolean;
}

export interface CodeEditorState {
  activeFile: string | null;
  openFiles: string[];
  unsavedChanges: Set<string>;
  searchQuery: string;
  searchResults: SearchResult[];
  breakpoints: Record<string, number[]>;
  cursor: CursorPosition;
  selection: EditorSelection;
}

export interface SearchResult {
  file: string;
  line: number;
  column: number;
  match: string;
  context: string;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface EditorSelection {
  start: CursorPosition;
  end: CursorPosition;
}

export interface GitCommit {
  hash: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  timestamp: Date;
  changes: FileChange[];
  branch: string;
  tags: string[];
}

export interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  oldPath?: string;
}

export interface GitBranch {
  name: string;
  commit: string;
  isDefault: boolean;
  isProtected: boolean;
  ahead: number;
  behind: number;
  lastCommit: Date;
}

export interface PullRequest {
  id: number;
  title: string;
  description: string;
  author: {
    username: string;
    avatar?: string;
  };
  source: string;
  target: string;
  status: 'open' | 'closed' | 'merged';
  createdAt: Date;
  updatedAt: Date;
  comments: number;
  changes: number;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  preview: string;
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  framework?: string;
  files: TemplateFile[];
  dependencies: ProjectDependency[];
  instructions: string;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  downloads: number;
  rating: number;
  reviews: number;
  lastUpdated: Date;
}

export interface TemplateFile {
  path: string;
  content: string;
  isRequired: boolean;
  description?: string;
}

export interface WalrusDeployment {
  objectId: string;
  suinsName?: string;
  customDomain?: string;
  url: string;
  status: 'pending' | 'active' | 'failed' | 'updating';
  size: number;
  files: number;
  deployedAt: Date;
  lastUpdate?: Date;
  metrics?: {
    totalRequests: number;
    bandwidth: number;
    averageResponseTime: number;
    uptime: number;
  };
  ssl?: {
    enabled: boolean;
    issuer: string;
    expiresAt: Date;
    autoRenew: boolean;
  };
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityLog {
  id: string;
  userId: string;
  projectId?: string;
  action: string;
  description: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  features: string[];
  limits: {
    projects: number;
    storage: number; // in MB
    bandwidth: number; // in GB
    collaborators: number;
    deployments: number; // per month
  };
  usage: {
    projects: number;
    storage: number;
    bandwidth: number;
    collaborators: number;
    deployments: number;
  };
} 