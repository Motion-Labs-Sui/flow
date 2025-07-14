'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Settings,
  FileCode,
  Eye,
  Atom,
  Plus,
  Wallet,
  Key,
  Palette,
  RefreshCw,
  FolderPlus,
  History,
  Wand2,
  Brain,
  Cpu,
  CloudUpload,
  Waves
} from 'lucide-react';
import PreviewPanel from './PreviewPanel';
import { ClaudeAPI, WalrusAPI, type GeneratedSite, type WalrusDeployment, generateSiteName, validateClaudeAPIKey, validatePrivateKey } from '../lib/api';

// Types
interface Project {
  id: string;
  name: string;
  description: string;
  walrusObjectId?: string;
  suinsName?: string;
  lastModified: Date;
  thumbnail?: string;
  status: 'draft' | 'published' | 'deploying';
}

interface GenerationHistory {
  id: string;
  prompt: string;
  timestamp: Date;
  projectId?: string;
}

interface AppSettings {
  claudeApiKey: string;
  walrusCredentials: {
    privateKey: string;
    network: 'mainnet' | 'testnet';
  };
  defaultTheme: string;
  autoSave: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

// Physics-inspired floating particles with Motion Labs style
const FloatingParticle = ({ delay = 0, size = 'small' }: { delay?: number, size?: 'small' | 'medium' | 'large' }) => {
  const [position, setPosition] = useState({ left: '50%', top: '50%' });
  
  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2', 
    large: 'w-3 h-3'
  };

  useEffect(() => {
    // Set random position only on client side to avoid hydration mismatch
    setPosition({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    });
  }, []);

  return (
    <motion.div
      className={`absolute rounded-full bg-motion-500/20 ${sizeClasses[size]}`}
      style={position}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, -20, 0],
        opacity: [0.2, 0.6, 0.3, 0.2],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Motion Labs Modern Background
const MotionQuantumBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient with motion blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40" style={{ backgroundSize: '32px 32px' }} />
      
      {/* Modern noise texture */}
      <div className="absolute inset-0 bg-noise" />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.8} 
          size={(['small', 'medium'] as const)[i % 2]}
        />
      ))}
      
      {/* Ambient glow */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-motion-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-motion-500/3 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

// Settings Modal
const SettingsModal = ({ isOpen, onClose, settings, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl bg-glass-dark-heavy backdrop-blur-2xl rounded-3xl border border-neutral-800/50 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-8 border-b border-neutral-800/50">
          <h2 className="text-3xl font-bold text-neutral-0 flex items-center gap-3">
            <Settings className="w-8 h-8 text-motion-500" />
            Settings
          </h2>
        </div>
        
        <div className="p-8 space-y-8 max-h-96 overflow-y-auto">
          {/* API Keys */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-0 flex items-center gap-3">
              <Key className="w-6 h-6 text-motion-400" />
              API Configuration
            </h3>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Claude API Key
              </label>
              <input
                type="password"
                value={localSettings.claudeApiKey}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  claudeApiKey: e.target.value
                })}
                className="w-full p-4 rounded-2xl bg-glass-dark backdrop-blur-xl border border-neutral-700/50 text-neutral-0 placeholder-neutral-400 focus:border-motion-500/50 focus:outline-none transition-all"
                placeholder="sk-ant-api03-..."
              />
            </div>
          </div>

          {/* Walrus Configuration */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-0 flex items-center gap-3">
              <Wallet className="w-6 h-6 text-motion-400" />
              Walrus Configuration
            </h3>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Private Key
              </label>
              <input
                type="password"
                value={localSettings.walrusCredentials.privateKey}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  walrusCredentials: {
                    ...localSettings.walrusCredentials,
                    privateKey: e.target.value
                  }
                })}
                className="w-full p-4 rounded-2xl bg-glass-dark backdrop-blur-xl border border-neutral-700/50 text-neutral-0 placeholder-neutral-400 focus:border-motion-500/50 focus:outline-none transition-all"
                placeholder="Your Sui private key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Network
              </label>
              <select
                value={localSettings.walrusCredentials.network}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  walrusCredentials: {
                    ...localSettings.walrusCredentials,
                    network: e.target.value as 'mainnet' | 'testnet'
                  }
                })}
                className="w-full p-4 rounded-2xl bg-glass-dark backdrop-blur-xl border border-neutral-700/50 text-neutral-0 focus:border-motion-500/50 focus:outline-none transition-all"
              >
                <option value="testnet">Testnet</option>
                <option value="mainnet">Mainnet</option>
              </select>
            </div>
          </div>

          {/* UI Preferences */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-0 flex items-center gap-3">
              <Palette className="w-6 h-6 text-motion-400" />
              Preferences
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Auto-save projects</span>
              <button
                onClick={() => setLocalSettings({
                  ...localSettings,
                  autoSave: !localSettings.autoSave
                })}
                className={`w-14 h-7 rounded-full transition-all ${
                  localSettings.autoSave ? 'bg-motion-500' : 'bg-neutral-700'
                }`}
              >
                <div className={`w-5 h-5 bg-neutral-0 rounded-full transition-transform ${
                  localSettings.autoSave ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-neutral-800/50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl bg-glass-dark backdrop-blur-xl border border-neutral-700/50 text-neutral-300 hover:bg-glass-dark-medium hover:text-neutral-0 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-2xl bg-motion-500 text-neutral-0 hover:bg-motion-400 transition-all shadow-lg shadow-motion-500/20"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
  const statusColors = {
    draft: 'bg-void-600 text-void-300',
    published: 'bg-quantum-500 text-white',
    deploying: 'bg-plasma-500 text-white'
  };

  return (
    <motion.div
      className="bg-void-800/50 rounded-xl border border-void-700/50 p-4 hover:bg-void-700/50 hover:border-quantum-500/50 transition-all cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white group-hover:text-quantum-300 transition-colors">
          {project.name}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>
      <p className="text-void-300 text-sm mb-3 line-clamp-2">{project.description}</p>
      <div className="flex items-center justify-between text-xs text-void-400">
        <span>{project.lastModified.toLocaleDateString()}</span>
        {project.suinsName && (
          <span className="text-quantum-400">{project.suinsName}.wal.app</span>
        )}
      </div>
    </motion.div>
  );
};

// Header component
const Header = ({ onSettingsClick, currentView }: { 
  onSettingsClick: () => void;
  currentView: string;
}) => {
  return (
    <motion.header 
      className="relative z-10 flex items-center justify-between p-6 border-b border-neutral-800/30 bg-glass-dark-medium backdrop-blur-2xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center space-x-4">
        <motion.div 
          className="relative p-3 rounded-2xl bg-motion-500 shadow-xl shadow-motion-500/20"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Atom className="w-7 h-7 text-neutral-0" />
          <motion.div
            className="absolute inset-0 rounded-2xl bg-motion-400/30"
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-0">Flow</h1>
          <p className="text-sm text-neutral-400">AI-Powered Walrus Sites Generator</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <motion.div 
          className="px-4 py-2 rounded-xl bg-glass-light backdrop-blur-xl border border-neutral-700/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-neutral-300 uppercase tracking-wide font-medium">{currentView}</span>
        </motion.div>
        <motion.button 
          className="p-3 rounded-xl bg-glass-dark backdrop-blur-xl border border-neutral-700/30 hover:bg-glass-dark-medium hover:border-motion-500/30 transition-all"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(33, 95, 246, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onSettingsClick}
        >
          <Settings className="w-6 h-6 text-neutral-300 hover:text-motion-400 transition-colors" />
        </motion.button>
      </div>
    </motion.header>
  );
};

// Sidebar component
const Sidebar = ({ activeTab, setActiveTab }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    { id: 'projects', icon: FolderPlus, label: 'Projects' },
    { id: 'generate', icon: Wand2, label: 'Generate' },
    { id: 'code', icon: FileCode, label: 'Code' },
    { id: 'preview', icon: Eye, label: 'Preview' },
    { id: 'deploy', icon: CloudUpload, label: 'Deploy' },
    { id: 'history', icon: History, label: 'History' },
  ];

  return (
    <motion.div 
      className="w-20 bg-glass-dark-medium backdrop-blur-2xl border-r border-neutral-800/30 flex flex-col items-center py-8 space-y-6"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative p-4 rounded-2xl transition-all group ${
            activeTab === tab.id 
              ? 'bg-motion-500 text-neutral-0 shadow-xl shadow-motion-500/30' 
              : 'bg-glass-dark text-neutral-400 hover:bg-glass-dark-medium hover:text-neutral-200'
          }`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          title={tab.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <tab.icon className="w-6 h-6" />
          
          {/* Active indicator */}
          {activeTab === tab.id && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-motion-400/20"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          
          {/* Hover glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-motion-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
        </motion.button>
      ))}
    </motion.div>
  );
};

// Projects View
const ProjectsView = ({ projects, onProjectSelect, onNewProject }: {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  onNewProject: () => void;
}) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
            <p className="text-void-300">Create and manage your Walrus Sites</p>
          </div>
          <motion.button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quantum-500 text-white hover:bg-quantum-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            New Project
          </motion.button>
        </div>

        {projects.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-quantum-500 to-plasma-500 flex items-center justify-center">
              <FolderPlus className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No projects yet</h3>
            <p className="text-void-300 mb-6">Create your first AI-powered Walrus Site</p>
            <motion.button
              onClick={onNewProject}
              className="px-6 py-3 rounded-lg bg-quantum-500 text-white hover:bg-quantum-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Building
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onProjectSelect(project)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Generation Interface
const GenerationInterface = ({ onGenerate, isGenerating }: {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>([]);

  const promptCategories = {
    all: 'All Templates',
    portfolio: 'Portfolio & Personal',
    defi: 'DeFi & Trading',
    nft: 'NFT & Gaming', 
    docs: 'Documentation',
    landing: 'Landing Pages',
    dashboard: 'Dashboards & Apps'
  };

  const examplePrompts = [
    {
      category: 'portfolio',
      title: 'Blockchain Developer Portfolio',
      description: 'Modern portfolio with 3D animations and skills showcase',
      prompt: "Build a modern portfolio site for a blockchain developer with dark theme, 3D animations, and a skills showcase section. Include project cards, animated background, contact form, and social links."
    },
    {
      category: 'defi',
      title: 'DeFi Protocol Landing',
      description: 'Glassmorphism design with animated charts',
      prompt: "Create a DeFi protocol landing page with glassmorphism design, animated charts showing TVL and APY, wallet integration buttons, and tokenomics section with particle effects."
    },
    {
      category: 'nft',
      title: 'NFT Collection Showcase',
      description: 'Interactive gallery with rarity filters',
      prompt: "Design an NFT collection showcase with particle effects, rarity filters, grid/list view toggle, minting interface with wallet connect, and animated trait displays."
    },
    {
      category: 'docs',
      title: 'Technical Documentation',
      description: 'Interactive docs with code examples',
      prompt: "Generate a documentation site with interactive code examples, syntax highlighting, search functionality, dark/light theme toggle, and navigation sidebar with smooth scrolling."
    },
    {
      category: 'landing',
      title: 'DAO Governance Platform',
      description: 'Voting interfaces and member profiles',
      prompt: "Build a DAO governance dashboard with voting interfaces, proposal cards with progress bars, member profile sections, treasury overview, and real-time voting animations."
    },
    {
      category: 'dashboard',
      title: 'GameFi Analytics Dashboard',
      description: 'Game assets and tokenomics visualization',
      prompt: "Create a GameFi landing page with animated game assets, tokenomics visualization charts, play-to-earn mechanics explanation, leaderboards, and reward claiming interface."
    },
    {
      category: 'defi',
      title: 'Yield Farming Platform',
      description: 'Pool management and rewards tracking',
      prompt: "Build a yield farming platform with pool cards showing APY, stake/unstake modals, rewards tracking, harvest buttons, and animated liquidity charts with glassmorphism effects."
    },
    {
      category: 'nft',
      title: 'NFT Marketplace',
      description: 'Trading platform with advanced filters',
      prompt: "Design an NFT marketplace with advanced filtering, price charts, bidding interface, collection analytics, trending sections, and smooth hover animations on NFT cards."
    },
    {
      category: 'portfolio',
      title: 'Creative Agency Portfolio',
      description: 'Interactive showcase with case studies',
      prompt: "Create a creative agency portfolio with hero video background, interactive case study cards, team member profiles, service offerings, and smooth parallax scrolling effects."
    },
    {
      category: 'landing',
      title: 'SaaS Product Landing',
      description: 'Feature showcase and pricing tiers',
      prompt: "Build a SaaS product landing page with animated feature cards, pricing tier comparison, customer testimonials carousel, integration logos, and conversion-focused CTA buttons."
    },
    {
      category: 'dashboard',
      title: 'Trading Analytics Dashboard',
      description: 'Real-time charts and portfolio tracking',
      prompt: "Generate a trading analytics dashboard with real-time price charts, portfolio balance cards, trade history table, P&L indicators, and responsive mobile layout."
    },
    {
      category: 'docs',
      title: 'API Documentation Hub',
      description: 'Interactive API explorer with examples',
      prompt: "Create an API documentation hub with interactive endpoint explorer, request/response examples, authentication guides, SDK downloads, and real-time API status indicators."
    }
  ];

  const filteredPrompts = examplePrompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (promptText: string) => {
    setFavoritePrompts(prev => 
      prev.includes(promptText) 
        ? prev.filter(p => p !== promptText)
        : [...prev, promptText]
    );
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt);
  };

  return (
    <div className="flex-1 relative overflow-y-auto">
      {/* Quantum Background */}
      <MotionQuantumBackground />
      
      {/* Scrollable Content */}
      <div className="relative z-10 min-h-full">
        <div className="p-6 space-y-12 pb-6">
          <motion.div 
            className="max-w-6xl mx-auto space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hero Section */}
            <div className="text-center py-12">
              <motion.div
                className="relative w-24 h-24 mx-auto mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="w-full h-full rounded-3xl bg-gradient-to-br from-motion-500 to-motion-700 flex items-center justify-center shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      '0 0 30px rgba(33, 95, 246, 0.4)',
                      '0 0 60px rgba(33, 95, 246, 0.6)',
                      '0 0 30px rgba(33, 95, 246, 0.4)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>
                
                {/* Orbital rings */}
                <motion.div
                  className="absolute inset-0 border-2 border-motion-300/30 rounded-full"
                  style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 border border-motion-400/20 rounded-full"
                  style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                AI Website Generator
              </motion.h2>
              <motion.p 
                className="text-quantum-300 text-xl max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Describe your vision and watch Claude AI create stunning Walrus Sites with Motion Labs precision
              </motion.p>
            </div>

            {/* Search and Filters */}
            <motion.div 
              className="flex flex-col lg:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-void-800/60 backdrop-blur-xl border border-motion-500/20 text-white placeholder-quantum-400 focus:outline-none focus:border-motion-500/60 focus:bg-void-800/80 transition-all text-lg shadow-xl"
                />
                <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-motion-400" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-motion-500/5 opacity-0 pointer-events-none"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Object.entries(promptCategories).map(([key, label]) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-6 py-4 rounded-2xl whitespace-nowrap font-medium transition-all shadow-lg ${
                      selectedCategory === key
                        ? 'bg-motion-500 text-white shadow-motion-500/30'
                        : 'bg-void-800/60 text-quantum-300 hover:bg-void-700/60 hover:text-white backdrop-blur-xl'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Template Grid */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, staggerChildren: 0.1 }}
            >
              {filteredPrompts.map((template, index) => (
                <motion.div
                  key={index}
                  className="group relative p-8 rounded-3xl bg-void-800/40 backdrop-blur-xl border border-motion-500/20 hover:border-motion-400/50 transition-all cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.02, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPrompt(template.prompt)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-motion-500/10 via-transparent to-motion-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />
                  
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <span className="px-4 py-2 rounded-full text-sm bg-motion-500/20 text-motion-300 border border-motion-500/30 backdrop-blur-sm font-medium">
                      {promptCategories[template.category as keyof typeof promptCategories]}
                    </span>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(template.prompt);
                      }}
                      className={`p-3 rounded-full transition-all ${
                        favoritePrompts.includes(template.prompt)
                          ? 'text-plasma-400 bg-plasma-500/20 shadow-lg shadow-plasma-500/20'
                          : 'text-quantum-400 hover:text-plasma-400 hover:bg-plasma-500/10'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-motion-300 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-quantum-300 text-sm mb-6 leading-relaxed">
                      {template.description}
                    </p>
                    
                    {/* Preview */}
                    <div className="text-xs text-quantum-500 line-clamp-3 font-mono bg-void-900/60 p-4 rounded-xl border border-void-700/50 backdrop-blur-sm">
                      {template.prompt}
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-motion-400/40 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 0.8, 0.4] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.5 
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredPrompts.length === 0 && (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-void-800/60 backdrop-blur-xl flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-quantum-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No templates found</h3>
                <p className="text-quantum-300 text-lg">Try adjusting your search or category filter</p>
              </motion.div>
            )}

            {/* Custom Prompt Section */}
            <motion.div
              className="relative p-8 rounded-3xl bg-gradient-to-br from-motion-500/10 via-motion-600/5 to-transparent border border-motion-500/30 backdrop-blur-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-motion-500/5 to-motion-600/5"
                animate={{ 
                  background: [
                    'linear-gradient(45deg, rgba(33, 95, 246, 0.05), rgba(33, 95, 246, 0.02))',
                    'linear-gradient(225deg, rgba(33, 95, 246, 0.08), rgba(33, 95, 246, 0.03))',
                    'linear-gradient(45deg, rgba(33, 95, 246, 0.05), rgba(33, 95, 246, 0.02))'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Wand2 className="w-7 h-7 text-motion-400" />
                  </motion.div>
                  Create Something Unique
                </h3>
                <p className="text-quantum-300 text-lg mb-6 leading-relaxed">
                  Don&apos;t see what you&apos;re looking for? Describe your ideal website and let Claude&apos;s creativity shine with Motion Labs precision!
                </p>
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => setPrompt('')}
                    className="px-6 py-3 rounded-xl bg-motion-500/20 text-motion-300 hover:bg-motion-500/30 transition-colors font-medium backdrop-blur-sm border border-motion-500/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Fresh
                  </motion.button>
                  <motion.button
                    onClick={() => window.open('https://docs.anthropic.com/claude/docs/guide-to-anthropics-prompt-engineering-resources', '_blank')}
                    className="px-6 py-3 rounded-xl bg-void-700/60 text-quantum-300 hover:bg-void-600/60 transition-colors font-medium backdrop-blur-sm border border-void-600/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Prompt Tips
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Prompt Input Section - NOW PROPERLY PLACED */}
            <motion.div
              className="relative p-8 rounded-3xl bg-void-900/80 backdrop-blur-2xl border border-motion-500/30 shadow-2xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <div className="relative">
                <motion.textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the website you want to create... Be specific about features, design style, and functionality!"
                  className="w-full p-6 pr-32 rounded-2xl bg-void-800/60 backdrop-blur-xl border border-motion-500/20 text-white placeholder-quantum-400 focus:outline-none focus:border-motion-500/60 focus:bg-void-800/80 transition-all resize-none text-lg min-h-[120px] shadow-2xl"
                  rows={4}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSubmit();
                    }
                  }}
                />
                
                {/* Character Count */}
                <div className="absolute bottom-3 left-6 text-sm text-quantum-500">
                  {prompt.length} characters
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-3">
                  {prompt && (
                    <motion.button
                      onClick={() => setPrompt('')}
                      className="p-3 rounded-xl bg-void-700/60 text-quantum-400 hover:bg-void-600/60 hover:text-white transition-colors backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || isGenerating}
                    className="px-6 py-3 rounded-xl bg-motion-500 text-white disabled:bg-void-600 disabled:text-void-400 hover:bg-motion-400 transition-colors shadow-lg shadow-motion-500/30 font-medium"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(33, 95, 246, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isGenerating ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Cpu className="w-6 h-6" />
                        <span>Generating...</span>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-6 h-6" />
                        <span>Generate</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-6">
                  <p className="text-sm text-quantum-500">
                    Press ⌘+Enter to generate • Powered by Claude AI
                  </p>
                  {favoritePrompts.length > 0 && (
                    <span className="text-sm text-plasma-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {favoritePrompts.length} favorites saved
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-quantum-500">
                  <span>Deploy to</span>
                  <Waves className="w-5 h-5 text-motion-400" />
                  <span className="text-motion-400 font-medium">Walrus Sites</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// History View
const HistoryView = ({ history, onRegenerate }: {
  history: GenerationHistory[];
  onRegenerate: (historyItem: GenerationHistory) => void;
}) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">Generation History</h2>
        <p className="text-void-300 mb-6">View and regenerate previous generations.</p>

        {history.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-quantum-500 to-plasma-500 flex items-center justify-center">
              <History className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No generation history yet</h3>
            <p className="text-void-300 mb-6">Generate a site to see your history here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                className="bg-void-800/50 rounded-xl border border-void-700/50 p-4"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{item.prompt}</h4>
                  <span className="text-xs text-void-400">{item.timestamp.toLocaleDateString()}</span>
                </div>
                <p className="text-void-300 text-sm mb-3 line-clamp-2">{item.prompt}</p>
                <div className="flex items-center justify-end text-xs text-void-400">
                  <motion.button
                    onClick={() => onRegenerate(item)}
                    className="p-2 rounded-lg bg-quantum-500 text-white hover:bg-quantum-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Main App component
export default function FlowVCE() {
  const [activeTab, setActiveTab] = useState('projects');
  const [showSettings, setShowSettings] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [generatedSite, setGeneratedSite] = useState<GeneratedSite | null>(null);
  const [deployment, setDeployment] = useState<WalrusDeployment | null>(null);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistory[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    claudeApiKey: '',
    walrusCredentials: {
      privateKey: '',
      network: 'testnet'
    },
    defaultTheme: 'dark',
    autoSave: true,
    previewMode: 'desktop'
  });

  // Save settings to localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('flow-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flow-settings', JSON.stringify(settings));
  }, [settings]);

  // Save projects to localStorage
  useEffect(() => {
    localStorage.setItem('flow-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('flow-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects).map((p: Project) => ({
        ...p,
        lastModified: new Date(p.lastModified)
      })));
    }
  }, []);

  const handleNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'Untitled Project',
      description: 'A new Walrus Site project',
      lastModified: new Date(),
      status: 'draft'
    };
    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setActiveTab('generate');
    setGeneratedSite(null);
    setDeployment(null);
  };

  const handleGenerate = async (prompt: string) => {
    if (!settings.claudeApiKey) {
      alert('Please configure your Claude API key in settings first!');
      setShowSettings(true);
      return;
    }

    if (!validateClaudeAPIKey(settings.claudeApiKey)) {
      alert('Invalid Claude API key format. Please check your settings.');
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);
    setActiveTab('preview');
    
    try {
      const claudeAPI = new ClaudeAPI(settings.claudeApiKey);
      const site = await claudeAPI.generateWebsite(prompt);
      
      setGeneratedSite(site);
      
      // Add to generation history
      const historyEntry: GenerationHistory = {
        id: Date.now().toString(),
        prompt,
        timestamp: new Date(),
        projectId: currentProject?.id
      };
      setGenerationHistory([historyEntry, ...generationHistory]);
      
      // Update current project
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          name: site.metadata.title || currentProject.name,
          description: site.metadata.description || currentProject.description,
          lastModified: new Date(),
          status: 'draft' as const
        };
        setCurrentProject(updatedProject);
        setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
      }
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate website. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async (): Promise<WalrusDeployment> => {
    if (!generatedSite) {
      throw new Error('No site to deploy');
    }

    if (!settings.walrusCredentials.privateKey) {
      alert('Please configure your Walrus credentials in settings first!');
      setShowSettings(true);
      throw new Error('Missing Walrus credentials');
    }

    if (!validatePrivateKey(settings.walrusCredentials.privateKey)) {
      alert('Invalid private key format. Please check your settings.');
      setShowSettings(true);
      throw new Error('Invalid private key');
    }

    setIsDeploying(true);
    
    try {
      const walrusAPI = new WalrusAPI(
        settings.walrusCredentials.privateKey,
        settings.walrusCredentials.network
      );
      
      const siteName = currentProject?.name ? 
        generateSiteName(currentProject.name) : 
        generateSiteName(generatedSite.metadata.title);
      
      const deploymentResult = await walrusAPI.deployWebsite(generatedSite, siteName);
      
      setDeployment(deploymentResult);
      
      // Update project with deployment info
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          walrusObjectId: deploymentResult.objectId,
          suinsName: siteName,
          status: 'published' as const,
          lastModified: new Date()
        };
        setCurrentProject(updatedProject);
        setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
      }
      
      return deploymentResult;
    } catch (error) {
      console.error('Deployment failed:', error);
      alert('Failed to deploy to Walrus Sites. Please try again.');
      throw error;
    } finally {
      setIsDeploying(false);
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            onProjectSelect={(project) => {
              setCurrentProject(project);
              setActiveTab('generate');
              setGeneratedSite(null);
              setDeployment(null);
            }}
            onNewProject={handleNewProject}
          />
        );
      case 'generate':
        return (
          <GenerationInterface
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );
      case 'preview':
        return (
          <PreviewPanel
            site={generatedSite}
            isGenerating={isGenerating}
            onDeploy={handleDeploy}
            deployment={deployment}
            isDeploying={isDeploying}
          />
        );
      case 'history':
        return (
          <HistoryView
            history={generationHistory}
            onRegenerate={(historyItem) => {
              setActiveTab('generate');
              handleGenerate(historyItem.prompt);
            }}
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-void-300">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-0">
      <MotionQuantumBackground />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Header 
          onSettingsClick={() => setShowSettings(true)}
          currentView={activeTab}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderMainContent()}
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSave={setSettings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}