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

// Physics-inspired floating particles
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
      className={`absolute rounded-full bg-plasma-400/20 ${sizeClasses[size]}`}
      style={position}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, -20, 0],
        opacity: [0.2, 0.8, 0.3, 0.2],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Quantum grid background
const QuantumBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-quantum-grid opacity-30" />
      <div className="absolute inset-0 bg-noise-subtle" />
      
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.8} 
          size={(['small', 'medium', 'large'] as const)[i % 3]}
        />
      ))}
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-quantum-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-plasma-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-void-900/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl bg-void-800 rounded-2xl border border-void-700 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6 border-b border-void-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-quantum-400" />
            Settings
          </h2>
        </div>
        
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* API Keys */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-plasma-400" />
              API Configuration
            </h3>
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
                Claude API Key
              </label>
              <input
                type="password"
                value={localSettings.claudeApiKey}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  claudeApiKey: e.target.value
                })}
                className="w-full p-3 rounded-lg bg-void-700 border border-void-600 text-white placeholder-void-400 focus:border-quantum-500 focus:outline-none"
                placeholder="sk-ant-api03-..."
              />
            </div>
          </div>

          {/* Walrus Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-plasma-400" />
              Walrus Configuration
            </h3>
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
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
                className="w-full p-3 rounded-lg bg-void-700 border border-void-600 text-white placeholder-void-400 focus:border-quantum-500 focus:outline-none"
                placeholder="Your Sui private key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-void-300 mb-2">
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
                className="w-full p-3 rounded-lg bg-void-700 border border-void-600 text-white focus:border-quantum-500 focus:outline-none"
              >
                <option value="testnet">Testnet</option>
                <option value="mainnet">Mainnet</option>
              </select>
            </div>
          </div>

          {/* UI Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-plasma-400" />
              Preferences
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-void-300">Auto-save projects</span>
              <button
                onClick={() => setLocalSettings({
                  ...localSettings,
                  autoSave: !localSettings.autoSave
                })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  localSettings.autoSave ? 'bg-quantum-500' : 'bg-void-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  localSettings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-void-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-void-700 text-void-300 hover:bg-void-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-quantum-500 text-white hover:bg-quantum-400 transition-colors"
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
      className="relative z-10 flex items-center justify-between p-6 border-b border-void-700/50 bg-void-900/80 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center space-x-3">
        <motion.div 
          className="p-2 rounded-lg bg-gradient-to-br from-quantum-500 to-plasma-500"
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Atom className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white">Flow</h1>
          <p className="text-sm text-void-400">AI-Powered Walrus Sites Generator</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <motion.div className="px-3 py-1 rounded-lg bg-void-800/50 border border-void-700">
          <span className="text-xs text-void-300 uppercase tracking-wide">{currentView}</span>
        </motion.div>
        <motion.button 
          className="p-2 rounded-lg bg-void-800/50 border border-void-700 hover:bg-void-700/50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSettingsClick}
        >
          <Settings className="w-5 h-5 text-void-300" />
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
      className="w-16 bg-void-900/60 backdrop-blur-xl border-r border-void-700/50 flex flex-col items-center py-6 space-y-4"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`p-3 rounded-lg transition-all ${
            activeTab === tab.id 
              ? 'bg-quantum-500 text-white shadow-lg shadow-quantum-500/25' 
              : 'bg-void-800/30 text-void-400 hover:bg-void-700/50 hover:text-void-200'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={tab.label}
        >
          <tab.icon className="w-5 h-5" />
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

  const examplePrompts = [
    "Build a modern portfolio site for a blockchain developer with dark theme, 3D animations, and a skills showcase",
    "Create a DeFi protocol landing page with glassmorphism design, animated charts, and wallet integration",
    "Design an NFT collection showcase with particle effects, rarity filters, and minting interface",
    "Generate a documentation site with interactive code examples, search functionality, and dark/light themes",
    "Build a DAO governance dashboard with voting interfaces, proposal cards, and member profiles",
    "Create a GameFi landing page with animated game assets, tokenomics visualization, and play-to-earn mechanics"
  ];

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div 
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Hero Section */}
          <div className="text-center py-12">
            <motion.div
              className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-quantum-500 to-plasma-500 flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(14, 165, 233, 0.3)',
                  '0 0 40px rgba(14, 165, 233, 0.5)',
                  '0 0 20px rgba(14, 165, 233, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">AI Website Generator</h2>
            <p className="text-void-300 text-xl max-w-2xl mx-auto">
              Describe your vision and watch Claude AI create a stunning Walrus Site in seconds
            </p>
          </div>

          {/* Example Prompts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">✨ Try these magical prompts:</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {examplePrompts.map((examplePrompt, index) => (
                <motion.button
                  key={index}
                  className="p-4 rounded-xl bg-void-800/30 border border-void-700/50 text-left hover:bg-void-700/30 hover:border-quantum-500/50 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPrompt(examplePrompt)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Sparkles className="w-5 h-5 text-quantum-400 mb-2 group-hover:text-quantum-300 transition-colors" />
                  <p className="text-void-200 text-sm leading-relaxed">{examplePrompt}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Input Area */}
      <motion.div 
        className="p-6 border-t border-void-700/50 bg-void-900/60 backdrop-blur-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to create... Be specific about features, design style, and functionality!"
              className="w-full p-6 pr-16 rounded-2xl bg-void-800/50 border border-void-700/50 text-white placeholder-void-400 focus:outline-none focus:border-quantum-500 focus:bg-void-800/70 transition-all resize-none text-lg"
              rows={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            <motion.button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className="absolute bottom-4 right-4 p-3 rounded-xl bg-quantum-500 text-white disabled:bg-void-600 disabled:text-void-400 hover:bg-quantum-400 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu className="w-6 h-6" />
                </motion.div>
              ) : (
                <Wand2 className="w-6 h-6" />
              )}
            </motion.button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-void-500">
              Press ⌘+Enter to generate • Powered by Claude AI
            </p>
            <div className="flex items-center gap-2 text-xs text-void-500">
              <span>Deploy to</span>
              <Waves className="w-4 h-4 text-quantum-400" />
              <span className="text-quantum-400">Walrus Sites</span>
            </div>
          </div>
        </div>
      </motion.div>
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
    <div className="min-h-screen bg-void-900 text-white overflow-hidden">
      <QuantumBackground />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Header 
          onSettingsClick={() => setShowSettings(true)}
          currentView={activeTab}
        />
        
        <div className="flex-1 flex">
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