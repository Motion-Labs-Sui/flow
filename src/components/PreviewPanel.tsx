'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Code, 
  Download, 
  Share, 
  RefreshCw,
  ExternalLink,
  CloudUpload,
  Check,
  Copy,
  Loader2,
  Sparkles,
  Globe
} from 'lucide-react';
import type { GeneratedSite, WalrusDeployment } from '../lib/api';

interface PreviewPanelProps {
  site: GeneratedSite | null;
  isGenerating: boolean;
  onDeploy: () => Promise<WalrusDeployment>;
  deployment?: WalrusDeployment;
  isDeploying?: boolean;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type TabMode = 'preview' | 'code';

export default function PreviewPanel({ 
  site, 
  isGenerating, 
  onDeploy, 
  deployment, 
  isDeploying = false 
}: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [tabMode, setTabMode] = useState<TabMode>('preview');
  const [codeView, setCodeView] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const viewportSizes = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] mx-auto',
    mobile: 'w-[375px] h-[812px] mx-auto'
  };

  const handleCopyCode = async () => {
    if (!site) return;
    
    let codeToCopy = '';
    switch (codeView) {
      case 'html':
        codeToCopy = site.html;
        break;
      case 'css':
        codeToCopy = site.css;
        break;
      case 'js':
        codeToCopy = site.js;
        break;
    }
    
    await navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!site) return;

    // Create a complete HTML file with inline CSS and JS
    const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${site.metadata.title}</title>
    <meta name="description" content="${site.metadata.description}">
    <style>
        ${site.css}
    </style>
</head>
<body>
    ${site.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '')}
    <script>
        ${site.js}
    </script>
</body>
</html>`;

    const blob = new Blob([completeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.metadata.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const DeploymentSuccess = ({ deployment }: { deployment: WalrusDeployment }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-quantum-500/10 border border-quantum-500/30 rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-quantum-500 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Deployed Successfully!</h3>
          <p className="text-void-300 text-sm">Your site is live on Walrus</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-void-800/50 rounded-lg p-3">
          <span className="text-void-300 text-sm">Site URL:</span>
          <div className="flex items-center gap-2">
            <code className="text-quantum-400 text-sm">{deployment.url}</code>
            <button
              onClick={() => navigator.clipboard.writeText(deployment.url)}
              className="p-1 hover:bg-void-700 rounded"
            >
              <Copy className="w-4 h-4 text-void-400" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-void-800/50 rounded-lg p-3">
          <span className="text-void-300 text-sm">Object ID:</span>
          <code className="text-void-400 text-sm font-mono">{deployment.objectId}</code>
        </div>
        
        <div className="flex gap-2">
          <motion.a
            href={deployment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-quantum-500 text-white py-2 px-4 rounded-lg hover:bg-quantum-400 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink className="w-4 h-4" />
            Visit Site
          </motion.a>
          <motion.button
            onClick={() => navigator.clipboard.writeText(deployment.url)}
            className="flex items-center gap-2 bg-void-700 text-void-300 py-2 px-4 rounded-lg hover:bg-void-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share className="w-4 h-4" />
            Share
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  if (isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-void-900/50">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto bg-gradient-to-br from-quantum-500 to-plasma-500 rounded-2xl flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Claude is crafting your website...</h3>
            <p className="text-void-300">Creating magical experiences with AI ✨</p>
          </div>
          <motion.div
            className="w-64 h-2 bg-void-800 rounded-full overflow-hidden mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-quantum-500 to-plasma-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex-1 flex items-center justify-center bg-void-900/50">
        <div className="text-center space-y-4">
          <Eye className="w-16 h-16 text-void-600 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">No Preview Available</h3>
            <p className="text-void-300">Generate a website to see the preview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-void-900/50">
      {/* Header Controls */}
      <div className="p-4 border-b border-void-700/50 bg-void-900/80">
        <div className="flex items-center justify-between">
          {/* View Mode Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setTabMode('preview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tabMode === 'preview'
                  ? 'bg-quantum-500 text-white'
                  : 'text-void-400 hover:text-void-200 hover:bg-void-800/50'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTabMode('code')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tabMode === 'code'
                  ? 'bg-quantum-500 text-white'
                  : 'text-void-400 hover:text-void-200 hover:bg-void-800/50'
              }`}
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Responsive Controls */}
          {tabMode === 'preview' && (
            <div className="flex gap-1">
              {[
                { mode: 'desktop' as ViewMode, icon: Monitor },
                { mode: 'tablet' as ViewMode, icon: Tablet },
                { mode: 'mobile' as ViewMode, icon: Smartphone }
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === mode
                      ? 'bg-quantum-500 text-white'
                      : 'text-void-400 hover:text-void-200 hover:bg-void-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-void-800/50 text-void-400 hover:text-void-200 hover:bg-void-700/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download HTML"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            
            {!deployment && (
              <motion.button
                onClick={onDeploy}
                disabled={isDeploying}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quantum-500 text-white hover:bg-quantum-400 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    Deploy to Walrus
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Deployment Success Banner */}
      {deployment && (
        <div className="p-4 border-b border-void-700/50">
          <DeploymentSuccess deployment={deployment} />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tabMode === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full p-4"
            >
              <div className={`${viewportSizes[viewMode]} border border-void-700 rounded-lg overflow-hidden bg-white shadow-2xl`}>
                <iframe
                  srcDoc={`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${site.metadata.title}</title>
    <style>${site.css}</style>
</head>
<body>
    ${site.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '')}
    <script>${site.js}</script>
</body>
</html>`}
                  className="w-full h-full"
                  style={{ minHeight: viewMode === 'mobile' ? '812px' : '600px' }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Code Tabs */}
              <div className="flex gap-1 p-4 pb-2">
                {[
                  { key: 'html' as const, label: 'HTML' },
                  { key: 'css' as const, label: 'CSS' },
                  { key: 'js' as const, label: 'JavaScript' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCodeView(key)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      codeView === key
                        ? 'bg-quantum-500 text-white'
                        : 'text-void-400 hover:text-void-200 hover:bg-void-800/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                
                <div className="flex-1" />
                
                <motion.button
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg text-sm bg-void-800/50 text-void-400 hover:text-void-200 hover:bg-void-700/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>
              
              {/* Code Display */}
              <div className="flex-1 mx-4 mb-4 bg-void-900 rounded-lg border border-void-700 overflow-hidden">
                <pre className="h-full overflow-auto p-4 text-sm text-void-200 font-mono leading-relaxed">
                  <code>
                    {codeView === 'html' && site.html}
                    {codeView === 'css' && site.css}
                    {codeView === 'js' && site.js}
                  </code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 