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
  Waves,
  ArrowLeft,
  ExternalLink,
  Code,
  Play,
  Trash2,
  Edit3,
  Share2,
  Download,
  Globe,
  Zap,
  Monitor,
  Tablet,
  Smartphone,
  Send,
  MessageSquare
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
  generatedSite?: GeneratedSite;
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
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(33, 95, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(33, 95, 246, 0.05) 0%, transparent 50%)',
        }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      {[...Array(4)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 1.5} 
          size="small"
        />
      ))}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-neutral-700/50 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-8 border-b border-neutral-700/50">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-motion-500" />
            Settings
          </h2>
        </div>
        
        <div className="p-8 space-y-8 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
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
                className="w-full p-4 rounded-2xl bg-neutral-800/60 backdrop-blur-xl border border-neutral-600/50 text-white placeholder-neutral-400 focus:border-motion-500/50 focus:outline-none transition-all"
                placeholder="sk-ant-api03-..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
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
                className="w-full p-4 rounded-2xl bg-neutral-800/60 backdrop-blur-xl border border-neutral-600/50 text-white placeholder-neutral-400 focus:border-motion-500/50 focus:outline-none transition-all"
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
                className="w-full p-4 rounded-2xl bg-neutral-800/60 backdrop-blur-xl border border-neutral-600/50 text-white focus:border-motion-500/50 focus:outline-none transition-all"
              >
                <option value="testnet">Testnet</option>
                <option value="mainnet">Mainnet</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
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
                  localSettings.autoSave ? 'bg-motion-500' : 'bg-neutral-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  localSettings.autoSave ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-neutral-700/50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl bg-neutral-800/60 border border-neutral-600/50 text-neutral-300 hover:bg-neutral-700/60 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-2xl bg-motion-500 text-white hover:bg-motion-400 transition-all shadow-lg shadow-motion-500/20"
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
    draft: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50',
    published: 'bg-green-500/20 text-green-300 border-green-500/30',
    deploying: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
  };

  return (
    <motion.div
      className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:bg-neutral-800/60 hover:border-motion-500/50 transition-all cursor-pointer group"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-white group-hover:text-motion-300 transition-colors text-lg line-clamp-1">
          {project.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[project.status]} font-medium`}>
          {project.status}
        </span>
      </div>
      <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{project.lastModified.toLocaleDateString()}</span>
        {project.suinsName && (
          <div className="flex items-center gap-2 text-motion-400 font-medium">
            <Globe className="w-3 h-3" />
            <span>{project.suinsName}.wal.app</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Header component
const Header = ({ onSettingsClick, currentView, currentProject, onBackToProjects }: { 
  onSettingsClick: () => void;
  currentView: string;
  currentProject?: Project | null;
  onBackToProjects?: () => void;
}) => {
  return (
    <motion.header 
      className="relative z-20 flex items-center justify-between p-6 border-b border-neutral-700/50 bg-neutral-950/95 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center space-x-4">
        {currentProject && onBackToProjects && (
          <motion.button
            onClick={onBackToProjects}
            className="p-2 rounded-xl bg-neutral-800/50 border border-neutral-600/50 hover:bg-neutral-700/50 hover:border-motion-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-neutral-300" />
          </motion.button>
        )}
        <motion.div 
          className="relative p-3 rounded-xl bg-motion-500 shadow-lg shadow-motion-500/25"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Atom className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {currentProject ? currentProject.name : 'Flow VCE'}
          </h1>
          <p className="text-sm text-neutral-400">
            {currentProject ? 'AI-Powered Project Management' : 'AI-Powered Walrus Sites'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="px-4 py-2 rounded-xl bg-neutral-800/50 border border-neutral-600/50">
          <span className="text-sm text-neutral-300 uppercase tracking-wide font-medium">{currentView}</span>
        </div>
        <motion.button 
          className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-600/50 hover:bg-neutral-700/50 hover:border-motion-500/50 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSettingsClick}
        >
          <Settings className="w-6 h-6 text-neutral-300 hover:text-motion-400 transition-colors" />
        </motion.button>
      </div>
    </motion.header>
  );
};

// Enhanced Sidebar component
const Sidebar = ({ activeTab, setActiveTab, isProjectView = false }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isProjectView?: boolean;
}) => {
  const mainTabs = [
    { id: 'projects', icon: FolderPlus, label: 'Projects' },
    { id: 'generate', icon: Wand2, label: 'Generate' },
    { id: 'history', icon: History, label: 'History' },
  ];

  const projectTabs = [
    { id: 'generate', icon: Wand2, label: 'Generate' },
    { id: 'code', icon: FileCode, label: 'Code' },
    { id: 'preview', icon: Eye, label: 'Preview' },
    { id: 'deploy', icon: CloudUpload, label: 'Deploy' },
  ];

  const tabs = isProjectView ? projectTabs : mainTabs;

  return (
    <motion.div 
      className="w-20 bg-neutral-950/95 backdrop-blur-xl border-r border-neutral-700/50 flex flex-col items-center py-8 space-y-6"
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
              ? 'bg-motion-500 text-white shadow-lg shadow-motion-500/25' 
              : 'bg-neutral-800/30 text-neutral-400 hover:bg-neutral-700/50 hover:text-white'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title={tab.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <tab.icon className="w-6 h-6" />
          
          {activeTab === tab.id && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-motion-400/20"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          
          {/* Tooltip */}
          <div className="absolute left-full ml-4 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {tab.label}
          </div>
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
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Your Projects</h2>
              <p className="text-neutral-400 text-lg">Create and manage your Walrus Sites with AI precision</p>
            </div>
            <motion.button
              onClick={onNewProject}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-motion-500 text-white hover:bg-motion-400 transition-colors shadow-lg shadow-motion-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Project</span>
            </motion.button>
          </div>

          {projects.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-motion-500/20 border border-motion-500/30 flex items-center justify-center">
                <FolderPlus className="w-12 h-12 text-motion-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No projects yet</h3>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto text-lg">Create your first AI-powered Walrus Site and deploy it to the decentralized web</p>
              <motion.button
                onClick={onNewProject}
                className="px-8 py-4 rounded-2xl bg-motion-500 text-white hover:bg-motion-400 transition-colors shadow-lg shadow-motion-500/25 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Building
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
};

// New Claude-style Generation Interface
const GenerationInterface = ({ onGenerate, isGenerating, currentProject }: {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  currentProject?: Project | null;
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
  ];

  const filteredPrompts = examplePrompts.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Main Prompt Interface - Like Claude */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-motion-500 flex items-center justify-center shadow-lg shadow-motion-500/25"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentProject ? `Generate for ${currentProject.name}` : 'AI Website Generator'}
            </h2>
            <p className="text-neutral-400 text-lg">
              Describe your vision and watch Claude AI create stunning Walrus Sites
            </p>
          </div>

          {/* Main Input Area */}
          <motion.div
            className="relative bg-neutral-900/60 backdrop-blur-xl rounded-3xl border border-neutral-600/50 shadow-2xl overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={currentProject 
                  ? `Describe updates or new features for ${currentProject.name}...`
                  : "Describe the website you want to create... Be specific about features, design style, and functionality!"
                }
                className="w-full p-6 pr-20 bg-transparent text-white placeholder-neutral-400 focus:outline-none resize-none text-lg min-h-[150px] max-h-[400px]"
                rows={6}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSubmit();
                  }
                }}
              />
              
              {/* Send Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!prompt.trim() || isGenerating}
                className={`absolute bottom-4 right-4 p-3 rounded-2xl transition-all ${
                  prompt.trim() && !isGenerating
                    ? 'bg-motion-500 text-white hover:bg-motion-400 shadow-lg shadow-motion-500/25'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
                whileHover={prompt.trim() && !isGenerating ? { scale: 1.05 } : {}}
                whileTap={prompt.trim() && !isGenerating ? { scale: 0.95 } : {}}
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Cpu className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </motion.button>
            </div>

            {/* Footer */}
            <div className="px-6 pb-4 flex items-center justify-between text-sm text-neutral-500">
              <span>{prompt.length} characters • Press ⌘+Enter to generate</span>
              <div className="flex items-center gap-2">
                <span>Powered by</span>
                <span className="text-motion-400 font-medium">Claude AI</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Templates Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Quick Start Templates</h3>
            <span className="text-neutral-400">{filteredPrompts.length} templates</span>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-800/60 backdrop-blur-xl border border-neutral-600/50 text-white placeholder-neutral-400 focus:outline-none focus:border-motion-500/50 transition-all"
              />
              <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-motion-400" />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {Object.entries(promptCategories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-3 rounded-2xl whitespace-nowrap font-medium transition-all ${
                    selectedCategory === key
                      ? 'bg-motion-500 text-white shadow-lg shadow-motion-500/25'
                      : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-700/60 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrompts.map((template, index) => (
              <motion.div
                key={index}
                className="group relative p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-600/50 hover:border-motion-400/50 transition-all cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPrompt(template.prompt)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-bold text-white group-hover:text-motion-300 transition-colors text-lg">
                    {template.title}
                  </h4>
                  <span className="px-3 py-1 rounded-full text-xs bg-motion-500/20 text-motion-300 border border-motion-500/30">
                    {promptCategories[template.category as keyof typeof promptCategories]}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm mb-4">{template.description}</p>
                <div className="text-xs text-neutral-500 line-clamp-2 font-mono bg-neutral-900/60 p-3 rounded-xl border border-neutral-700/50">
                  {template.prompt}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
              <p className="text-neutral-400">Try adjusting your search or category filter</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Project Management Interface
const ProjectDetailView = ({ project, onGenerate, onDeploy, onBack, generatedSite, isGenerating, isDeploying, deployment }: {
  project: Project;
  onGenerate: (prompt: string) => void;
  onDeploy: () => Promise<WalrusDeployment>;
  onBack: () => void;
  generatedSite?: GeneratedSite | null;
  isGenerating?: boolean;
  isDeploying?: boolean;
  deployment?: WalrusDeployment | null;
}) => {
  const [activeTab, setActiveTab] = useState('generate');

  const handleDeploy = async () => {
    try {
      return await onDeploy();
    } catch (error) {
      console.error('Deployment failed:', error);
      throw error;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <GenerationInterface
            onGenerate={onGenerate}
            isGenerating={isGenerating || false}
            currentProject={project}
          />
        );
      case 'preview':
        return (
          <PreviewPanel
            site={generatedSite || null}
            isGenerating={isGenerating || false}
            onDeploy={handleDeploy}
            deployment={deployment || null}
            isDeploying={isDeploying || false}
          />
        );
      case 'deploy':
        return (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">Deploy to Walrus Sites</h2>
              <div className="bg-neutral-800/60 rounded-2xl p-8 border border-neutral-600/50">
                <div className="text-center">
                  <CloudUpload className="w-16 h-16 text-motion-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Deploy</h3>
                  <p className="text-neutral-400 mb-6">Deploy your site to the decentralized web</p>
                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying || !generatedSite}
                    className="px-8 py-4 rounded-2xl bg-motion-500 text-white hover:bg-motion-400 transition-colors shadow-lg shadow-motion-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeploying ? 'Deploying...' : 'Deploy Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-neutral-400">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isProjectView={true} />
        {renderContent()}
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
    <div className="flex-1 overflow-y-auto p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">Generation History</h2>
        <p className="text-neutral-400 mb-8 text-lg">View and regenerate previous generations.</p>

        {history.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-motion-500/20 border border-motion-500/30 flex items-center justify-center">
              <History className="w-10 h-10 text-motion-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No generation history yet</h3>
            <p className="text-neutral-400 mb-6">Generate a site to see your history here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-neutral-600/50 p-6 hover:bg-neutral-700/60 hover:border-motion-500/50 transition-all"
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white text-lg line-clamp-1 flex-1">{item.prompt}</h4>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm text-neutral-500">{item.timestamp.toLocaleDateString()}</span>
                    <motion.button
                      onClick={() => onRegenerate(item)}
                      className="p-3 rounded-xl bg-motion-500 text-white hover:bg-motion-400 transition-colors shadow-lg shadow-motion-500/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Regenerate"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-neutral-400 line-clamp-2">{item.prompt}</p>
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

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    setActiveTab('generate');
    setGeneratedSite(project.generatedSite || null);
    setDeployment(null);
  };

  const handleBackToProjects = () => {
    setCurrentProject(null);
    setActiveTab('projects');
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
    if (currentProject) {
      setActiveTab('preview');
    }
    
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
          status: 'draft' as const,
          generatedSite: site
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
    if (currentProject) {
      return (
        <ProjectDetailView
          project={currentProject}
          onGenerate={handleGenerate}
          onDeploy={handleDeploy}
          onBack={handleBackToProjects}
          generatedSite={generatedSite}
          isGenerating={isGenerating}
          isDeploying={isDeploying}
          deployment={deployment}
        />
      );
    }

    switch (activeTab) {
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            onProjectSelect={handleProjectSelect}
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
              <p className="text-neutral-400">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <MotionQuantumBackground />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Header 
          onSettingsClick={() => setShowSettings(true)}
          currentView={currentProject ? 'project' : activeTab}
          currentProject={currentProject}
          onBackToProjects={currentProject ? handleBackToProjects : undefined}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {!currentProject && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
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