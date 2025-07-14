'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Sparkles, 
  FileCode,
  Eye,
  Atom,
  Plus,
  Wallet,
  Key,
  ArrowLeft,
  Github,
  Users,
  Bell,
  User,
  CreditCard,
  LogOut,
  X,
  MoreHorizontal,
  Copy,
  Archive,
  Search,
  Calendar,
  Globe,
  ExternalLink,
  Edit3,
  Share2,
  Trash2,
  Brain
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { 
  type EnhancedProject
} from '../types/enhanced';
import CodeEditor from './CodeEditor';

// Enhanced Project Card Component
const EnhancedProjectCard = ({ 
  project, 
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onShare
}: { 
  project: EnhancedProject;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onShare: () => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    draft: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50',
    published: 'bg-green-500/20 text-green-300 border-green-500/30',
    deploying: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    failed: 'bg-red-500/20 text-red-300 border-red-500/30',
    archived: 'bg-neutral-600/20 text-neutral-400 border-neutral-500/30'
  };

  const visibilityIcons = {
    private: <Key className="w-3 h-3" />,
    public: <Globe className="w-3 h-3" />,
    unlisted: <Eye className="w-3 h-3" />
  };

  return (
    <motion.div
      className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 hover:bg-neutral-800/60 hover:border-motion-500/50 transition-all cursor-pointer group relative"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      {/* Project Menu */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-lg bg-neutral-800/50 opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-700/50"
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-400" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-600 rounded-xl shadow-xl z-50"
              >
                <div className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Project
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <hr className="my-2 border-neutral-600" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Content */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-white group-hover:text-motion-300 transition-colors text-lg line-clamp-1">
                {project.name}
              </h3>
              {visibilityIcons[project.visibility]}
            </div>
            <p className="text-neutral-400 text-sm line-clamp-2 mb-3">{project.description}</p>
          </div>
        </div>

        {/* Project Stats */}
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            <span>{project.sourceFiles.length} files</span>
          </div>
          {project.collaborators.length > 1 && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{project.collaborators.length} collaborators</span>
            </div>
          )}
          {project.repository && (
            <div className="flex items-center gap-1">
              <Github className="w-3 h-3" />
              <span>Connected</span>
            </div>
          )}
        </div>

        {/* Project Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[project.status]} font-medium`}>
              {project.status}
            </span>
            {project.category && (
              <span className="px-2 py-1 rounded-md text-xs bg-motion-500/20 text-motion-300 border border-motion-500/30">
                {project.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Calendar className="w-3 h-3" />
            <span>{project.lastModified.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Deployment URL */}
        {project.suinsName && (
          <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
            <Globe className="w-3 h-3 text-motion-400" />
            <span className="text-motion-400 font-medium text-sm">{project.suinsName}.wal.app</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://${project.suinsName}.wal.app`, '_blank');
              }}
              className="p-1 rounded hover:bg-neutral-700/50"
            >
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// User Profile Component
const UserProfile = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { user, subscription, notifications, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'notifications'>('profile');

  if (!isOpen || !user) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-4xl bg-neutral-900/95 backdrop-blur-2xl rounded-3xl border border-neutral-700/50 shadow-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.name || 'User'} 
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-2 border-motion-500"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name || 'Anonymous User'}</h2>
                <p className="text-neutral-400">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  {user.githubUsername && (
                    <div className="flex items-center gap-1 text-sm text-neutral-400">
                      <Github className="w-4 h-4" />
                      <span>{user.githubUsername}</span>
                    </div>
                  )}
                  {user.walletAddress && (
                    <div className="flex items-center gap-1 text-sm text-neutral-400">
                      <Wallet className="w-4 h-4" />
                      <span>{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/50 border border-neutral-600/50 hover:bg-neutral-700/50 transition-all"
            >
              <X className="w-5 h-5 text-neutral-300" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-700/50">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'subscription', label: 'Subscription', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'subscription' | 'notifications')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-motion-300 border-b-2 border-motion-500 bg-neutral-800/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={user.name || ''}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:border-motion-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full p-3 rounded-xl bg-neutral-800/50 border border-neutral-600/50 text-neutral-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/50 border border-neutral-600/50">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="text-white font-medium">GitHub</p>
                        <p className="text-sm text-neutral-400">
                          {user.githubUsername ? `Connected as ${user.githubUsername}` : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-motion-500 text-white hover:bg-motion-400 transition-colors">
                      {user.githubUsername ? 'Reconnect' : 'Connect'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/50 border border-neutral-600/50">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="text-white font-medium">Sui Wallet</p>
                        <p className="text-sm text-neutral-400">
                          {user.walletAddress ? `Connected: ${user.walletAddress.slice(0, 10)}...` : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-motion-500 text-white hover:bg-motion-400 transition-colors">
                      {user.walletAddress ? 'Change' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && subscription && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
                <div className="p-6 rounded-xl bg-gradient-to-r from-motion-500/20 to-motion-400/20 border border-motion-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white capitalize">{subscription.plan} Plan</h4>
                      <p className="text-motion-300">
                        {subscription.status === 'active' ? 'Active' : 'Inactive'} • 
                        Renews {subscription.currentPeriodEnd.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {subscription.plan === 'free' ? 'Free' : subscription.plan === 'pro' ? '$9/month' : '$29/month'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-600/50">
                    <h4 className="text-white font-medium mb-2">Projects</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-400">{subscription.usage.projects} / {subscription.limits.projects}</span>
                      <span className="text-xs text-neutral-500">
                        {Math.round((subscription.usage.projects / subscription.limits.projects) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-motion-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((subscription.usage.projects / subscription.limits.projects) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-600/50">
                    <h4 className="text-white font-medium mb-2">Storage</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-400">{subscription.usage.storage}MB / {subscription.limits.storage}MB</span>
                      <span className="text-xs text-neutral-500">
                        {Math.round((subscription.usage.storage / subscription.limits.storage) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-motion-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((subscription.usage.storage / subscription.limits.storage) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Notifications</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-400">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-4 rounded-xl border transition-all ${
                          notification.read 
                            ? 'bg-neutral-800/30 border-neutral-600/30' 
                            : 'bg-motion-500/10 border-motion-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.read ? 'bg-neutral-400' : 'bg-motion-400'
                          }`} />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{notification.title}</h4>
                            <p className="text-neutral-400 text-sm mt-1">{notification.message}</p>
                            <p className="text-xs text-neutral-500 mt-2">
                              {notification.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-neutral-700/50 flex justify-between">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-motion-500 text-white hover:bg-motion-400 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Main Component
export default function EnhancedFlowVCE() {
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [currentProject, setCurrentProject] = useState<EnhancedProject | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-motion-500 flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Atom className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-white mb-2">Loading Flow VCE</h2>
          <p className="text-neutral-400">Preparing your AI development environment...</p>
        </div>
      </div>
    );
  }

  // Authentication required
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-24 h-24 rounded-3xl bg-motion-500 flex items-center justify-center mx-auto mb-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Atom className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to Flow VCE</h1>
            <p className="text-neutral-400 text-lg mb-8">
              AI-powered Walrus Sites development platform with advanced project management and GitHub integration
            </p>
            
            <motion.button
              onClick={login}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-motion-500 text-white hover:bg-motion-400 transition-colors shadow-lg shadow-motion-500/25 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Get Started
            </motion.button>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-neutral-400">
              <div className="text-center">
                <Github className="w-6 h-6 mx-auto mb-2" />
                <p>GitHub Integration</p>
              </div>
              <div className="text-center">
                <Wallet className="w-6 h-6 mx-auto mb-2" />
                <p>Wallet Connect</p>
              </div>
              <div className="text-center">
                <Brain className="w-6 h-6 mx-auto mb-2" />
                <p>AI Generation</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main authenticated interface
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Background */}
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
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between p-6 border-b border-neutral-700/50 bg-neutral-950/95 backdrop-blur-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4">
            {currentProject && (
              <motion.button
                onClick={() => setCurrentProject(null)}
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
                {currentProject ? 'Enhanced Project Management' : 'AI-Powered Walrus Sites'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 rounded-xl bg-neutral-800/50 border border-neutral-600/50">
              <span className="text-sm text-neutral-300 uppercase tracking-wide font-medium">
                {currentProject ? 'project' : 'projects'}
              </span>
            </div>
            
            <button
              onClick={() => setShowUserProfile(true)}
              className="flex items-center gap-3 p-2 rounded-xl bg-neutral-800/50 border border-neutral-600/50 hover:bg-neutral-700/50 hover:border-motion-500/50 transition-all"
            >
              <Image 
                src={user?.avatar || '/default-avatar.png'} 
                alt={user?.name || 'User'} 
                width={32}
                height={32}
                className="w-8 h-8 rounded-full" 
              />
              <span className="text-sm text-neutral-300">{user?.name || 'User'}</span>
            </button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {currentProject ? (
            // Project View with Code Editor
            <CodeEditor
              projectId={currentProject.id}
              files={currentProject.sourceFiles}
              onFilesChange={(files) => {
                const updatedProject = { ...currentProject, sourceFiles: files };
                setCurrentProject(updatedProject);
                setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
              }}
              repository={currentProject.repository}
              onRepositoryChange={(repository) => {
                const updatedProject = { ...currentProject, repository };
                setCurrentProject(updatedProject);
                setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
              }}
            />
          ) : (
            // Projects Overview
            <div className="flex-1 overflow-y-auto p-8">
              <motion.div 
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">Your Projects</h2>
                    <p className="text-neutral-400 text-lg">Build, manage, and deploy your Walrus Sites with AI precision</p>
                  </div>
                  <motion.button
                    onClick={() => {/* Create new project */}}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-motion-500 text-white hover:bg-motion-400 transition-colors shadow-lg shadow-motion-500/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">New Project</span>
                  </motion.button>
                </div>

                {/* Filters and Search */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-800/60 backdrop-blur-xl border border-neutral-600/50 text-white placeholder-neutral-400 focus:outline-none focus:border-motion-500/50 transition-all"
                    />
                  </div>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-neutral-800/60 backdrop-blur-xl border border-neutral-600/50 text-white focus:outline-none focus:border-motion-500/50 transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="defi">DeFi</option>
                    <option value="nft">NFT</option>
                    <option value="docs">Documentation</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'status')}
                    className="px-4 py-3 rounded-2xl bg-neutral-800/60 backdrop-blur-xl border border-neutral-600/50 text-white focus:outline-none focus:border-motion-500/50 transition-all"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                  <motion.div 
                    className="text-center py-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-motion-500/20 border border-motion-500/30 flex items-center justify-center">
                      <FileCode className="w-12 h-12 text-motion-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">No projects yet</h3>
                    <p className="text-neutral-400 mb-8 max-w-md mx-auto text-lg">Create your first AI-powered Walrus Site and deploy it to the decentralized web</p>
                    <motion.button
                      onClick={() => {/* Create new project */}}
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
                      <EnhancedProjectCard
                        key={project.id}
                        project={project}
                        onSelect={() => setCurrentProject(project)}
                        onEdit={() => {/* Edit project */}}
                        onDelete={() => {/* Delete project */}}
                        onDuplicate={() => {/* Duplicate project */}}
                        onArchive={() => {/* Archive project */}}
                        onShare={() => {/* Share project */}}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showUserProfile && (
          <UserProfile
            isOpen={showUserProfile}
            onClose={() => setShowUserProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 