'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { User, UserPreferences, Subscription, NotificationData } from '../types/enhanced';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  subscription: Subscription | null;
  notifications: NotificationData[];
  markNotificationRead: (id: string) => void;
  connectGitHub: () => Promise<void>;
  disconnectGitHub: () => Promise<void>;
  connectWallet: () => Promise<void>;
  privyUser: unknown;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Inner component that uses Privy hooks
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    ready, 
    authenticated, 
    user: privyUser, 
    login, 
    logout: privyLogout,
    linkGithub,
    unlinkGithub,
    linkWallet
  } = usePrivy();
  
  const { wallets } = useWallets();
  
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data when Privy user is available
  const initializeUser = React.useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!privyUser) return;
      
      // Get connected wallet address
      const walletAddress = wallets[0]?.address;
      
      // Get GitHub username if linked
      const githubAccount = privyUser.github;
      const githubUsername = githubAccount?.username || undefined;
      
      // Get Twitter handle if linked
      const twitterAccount = privyUser.twitter;
      const twitterHandle = twitterAccount?.username || undefined;

      // Create or get user from your backend
      const userData: User = {
        id: privyUser.id,
        email: privyUser.email?.address,
        name: privyUser.github?.name || privyUser.twitter?.name || 'Anonymous User',
        avatar: (privyUser.github as unknown as { picture?: string })?.picture || (privyUser.twitter as unknown as { picture?: string })?.picture || undefined,
        walletAddress: walletAddress || undefined,
        githubUsername,
        twitterHandle,
        createdAt: new Date(privyUser.createdAt),
        lastLogin: new Date(),
        subscription: 'free', // Default subscription
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: {
            deployment: true,
            updates: true,
            collaboration: true,
          },
          editor: {
            fontSize: 14,
            tabSize: 2,
            wordWrap: true,
            minimap: true,
            autoSave: true,
          },
        },
      };

      // Load saved preferences from localStorage
      const savedPreferences = localStorage.getItem(`user-preferences-${privyUser.id}`);
      if (savedPreferences) {
        userData.preferences = { ...userData.preferences, ...JSON.parse(savedPreferences) };
      }

      setUser(userData);
      
      // Load subscription info
      await loadSubscription(userData.id);
      
      // Load notifications
      await loadNotifications(userData.id);
      
    } catch (error) {
      console.error('Failed to initialize user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [privyUser, wallets]);

  useEffect(() => {
    if (ready && authenticated && privyUser) {
      initializeUser();
    } else if (ready && !authenticated) {
      setUser(null);
      setSubscription(null);
      setNotifications([]);
      setIsLoading(false);
    }
  }, [ready, authenticated, privyUser, initializeUser]);

  const loadSubscription = async (userId: string) => {
    try {
      // In a real app, this would be an API call
      const savedSubscription = localStorage.getItem(`subscription-${userId}`);
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      } else {
        // Default free subscription
        const defaultSubscription: Subscription = {
          id: `sub_${userId}`,
          userId,
          plan: 'free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          cancelAtPeriodEnd: false,
          features: ['basic_generation', 'public_projects', 'community_templates'],
          limits: {
            projects: 3,
            storage: 100, // MB
            bandwidth: 1, // GB
            collaborators: 0,
            deployments: 10, // per month
          },
          usage: {
            projects: 0,
            storage: 0,
            bandwidth: 0,
            collaborators: 0,
            deployments: 0,
          },
        };
        setSubscription(defaultSubscription);
        localStorage.setItem(`subscription-${userId}`, JSON.stringify(defaultSubscription));
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const loadNotifications = async (userId: string) => {
    try {
      const savedNotifications = localStorage.getItem(`notifications-${userId}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: NotificationData & { timestamp: string }) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // In a real app, this would be an API call
    localStorage.setItem(`user-profile-${user.id}`, JSON.stringify(updatedUser));
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    const updatedPreferences = { ...user.preferences, ...preferences };
    const updatedUser = { ...user, preferences: updatedPreferences };
    setUser(updatedUser);
    
    localStorage.setItem(`user-preferences-${user.id}`, JSON.stringify(updatedPreferences));
  };

  const markNotificationRead = (id: string) => {
    if (!user) return;
    
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updatedNotifications));
  };

  const connectGitHub = async () => {
    try {
      await linkGithub();
      // Refresh user data after linking
      if (privyUser) {
        await initializeUser();
      }
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      throw error;
    }
  };

  const disconnectGitHub = async () => {
    try {
      await unlinkGithub('github');
      // Update user data after unlinking
      if (user) {
        await updateProfile({ githubUsername: undefined });
      }
    } catch (error) {
      console.error('Failed to disconnect GitHub:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      await linkWallet();
      // Refresh user data after linking
      if (privyUser) {
        await initializeUser();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await privyLogout();
      setUser(null);
      setSubscription(null);
      setNotifications([]);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading: !ready || isLoading,
    isAuthenticated: authenticated,
    login,
    logout,
    updateProfile,
    updatePreferences,
    subscription,
    notifications,
    markNotificationRead,
    connectGitHub,
    disconnectGitHub,
    connectWallet,
    privyUser: (privyUser || null) as unknown,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Main provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clp7bj1g00qer080w05qe2ltz'}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#215FF6',
          logo: '/logo.png',
        },
        loginMethods: ['github', 'twitter', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </PrivyProvider>
  );
}; 