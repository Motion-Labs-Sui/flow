'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Save,
  Undo,
  Redo,
  GitBranch,
  GitCommit,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

import { 
  type SourceFile, 
  type GitRepository, 
  type FileTreeNode,
  type GitCommit as GitCommitType,
  type CodeEditorState
} from '../types/enhanced';
import { GitHubService } from '../lib/github';

// Monaco Editor dynamic import
// let monaco: any;
// if (typeof window !== 'undefined') {
//   import('monaco-editor').then((monacoModule) => {
//     monaco = monacoModule;
//   });
// }

interface CodeEditorProps {
  projectId: string;
  files: SourceFile[];
  onFilesChange: (files: SourceFile[]) => void;
  repository?: GitRepository;
  onRepositoryChange?: (repository: GitRepository) => void;
  className?: string;
}

const FileTree = ({ 
  files, 
  onFileSelect, 
  activeFile, 
  onFileCreate, 
  onFileDelete,
  onFileRename
}: {
  files: SourceFile[];
  onFileSelect: (file: SourceFile) => void;
  activeFile: string | null;
  onFileCreate: (path: string, isFolder: boolean) => void;
  onFileDelete: (path: string) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const buildFileTree = (files: SourceFile[]): FileTreeNode[] => {
    const tree: FileTreeNode[] = [];
    const folderMap = new Map<string, FileTreeNode>();

    // First, create all folders
    files.forEach(file => {
      const parts = file.path.split('/');
      let currentPath = '';
      
      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        
        if (!folderMap.has(currentPath)) {
          const folderNode: FileTreeNode = {
            name: folderName,
            type: 'folder',
            path: currentPath,
            children: []
          };
          
          folderMap.set(currentPath, folderNode);
          
          if (parentPath === '') {
            tree.push(folderNode);
          } else {
            const parent = folderMap.get(parentPath);
            if (parent) {
              parent.children!.push(folderNode);
            }
          }
        }
      }
    });

    // Then, add files
    files.forEach(file => {
      const parts = file.path.split('/');
      const fileName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      
      const fileNode: FileTreeNode = {
        name: fileName,
        type: 'file',
        path: file.path,
        size: file.size,
        language: file.language
      };
      
      if (parentPath === '') {
        tree.push(fileNode);
      } else {
        const parent = folderMap.get(parentPath);
        if (parent) {
          parent.children!.push(fileNode);
        }
      }
    });

    return tree;
  };

  const renderTreeNode = (node: FileTreeNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isActive = activeFile === node.path;
    const isEditing = editingPath === node.path;

    return (
      <div key={node.path}>
        <motion.div
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-neutral-700/50 ${
            isActive ? 'bg-motion-500/20 text-motion-300' : 'text-neutral-300'
          }`}
          style={{ marginLeft: `${depth * 16}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              const newExpanded = new Set(expandedFolders);
              if (isExpanded) {
                newExpanded.delete(node.path);
              } else {
                newExpanded.add(node.path);
              }
              setExpandedFolders(newExpanded);
            } else {
              const file = files.find(f => f.path === node.path);
              if (file) onFileSelect(file);
            }
          }}
          onDoubleClick={() => {
            if (node.type === 'file') {
              setEditingPath(node.path);
              setNewName(node.name);
            }
          }}
          whileHover={{ x: 2 }}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
            </>
          ) : (
            <>
              <div className="w-4" />
              <FileText className="w-4 h-4" />
            </>
          )}
          
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => {
                if (newName !== node.name) {
                  const newPath = node.path.replace(node.name, newName);
                  onFileRename(node.path, newPath);
                }
                setEditingPath(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (newName !== node.name) {
                    const newPath = node.path.replace(node.name, newName);
                    onFileRename(node.path, newPath);
                  }
                  setEditingPath(null);
                } else if (e.key === 'Escape') {
                  setEditingPath(null);
                }
              }}
              className="flex-1 bg-neutral-800 text-white text-sm px-1 rounded"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm">{node.name}</span>
          )}
          
          {node.type === 'file' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileDelete(node.path);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded"
            >
              <Trash2 className="w-3 h-3 text-red-400" />
            </button>
          )}
        </motion.div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildFileTree(files);

  return (
    <div className="w-64 bg-neutral-900/60 backdrop-blur-xl border-r border-neutral-700/50 flex flex-col">
      <div className="p-4 border-b border-neutral-700/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">Files</h3>
          <div className="flex gap-1">
            <button
              onClick={() => onFileCreate('new-file.txt', false)}
              className="p-1 hover:bg-neutral-700/50 rounded"
              title="New File"
            >
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {tree.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
};

const EditorToolbar = ({ 
  activeFile, 
  onSave, 
  onUndo, 
  onRedo,
  hasUnsavedChanges,
  onGitCommit,
  onGitPush,
  repository
}: {
  activeFile: SourceFile | null;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  hasUnsavedChanges: boolean;
  onGitCommit: () => void;
  onGitPush: () => void;
  repository?: GitRepository;
}) => {
  return (
    <div className="h-12 bg-neutral-800/60 backdrop-blur-xl border-b border-neutral-700/50 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {activeFile && (
          <span className="text-sm text-neutral-300 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {activeFile.path}
            {hasUnsavedChanges && <div className="w-2 h-2 bg-motion-400 rounded-full" />}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          className="p-2 hover:bg-neutral-700/50 rounded transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4 text-neutral-400" />
        </button>
        
        <button
          onClick={onRedo}
          className="p-2 hover:bg-neutral-700/50 rounded transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4 text-neutral-400" />
        </button>
        
        <button
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className="p-2 hover:bg-neutral-700/50 rounded transition-colors disabled:opacity-50"
          title="Save"
        >
          <Save className="w-4 h-4 text-neutral-400" />
        </button>
        
        {repository && (
          <>
            <div className="w-px h-6 bg-neutral-600" />
            
            <button
              onClick={onGitCommit}
              className="p-2 hover:bg-neutral-700/50 rounded transition-colors"
              title="Commit"
            >
              <GitCommit className="w-4 h-4 text-neutral-400" />
            </button>
            
            <button
              onClick={onGitPush}
              className="p-2 hover:bg-neutral-700/50 rounded transition-colors"
              title="Push"
            >
              <GitBranch className="w-4 h-4 text-neutral-400" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const GitPanel = ({ 
  repository, 
  files, 
  onCommit, 
  onPush,
  githubService
}: {
  repository?: GitRepository;
  files: SourceFile[];
  onCommit: (message: string, files: string[]) => void;
  onPush: () => void;
  githubService?: GitHubService;
}) => {
  const [commits, setCommits] = useState<GitCommitType[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCommits = React.useCallback(async () => {
    if (!repository || !githubService) return;
    
    try {
      setIsLoading(true);
      const repoCommits = await githubService.getCommits(repository.owner, repository.name, repository.branch);
      setCommits(repoCommits);
    } catch (error) {
      console.error('Failed to load commits:', error);
    } finally {
      setIsLoading(false);
    }
  }, [repository, githubService]);

  const handleCommit = () => {
    if (commitMessage.trim() && selectedFiles.length > 0) {
      onCommit(commitMessage.trim(), selectedFiles);
      setCommitMessage('');
      setSelectedFiles([]);
    }
  };

  useEffect(() => {
    loadCommits();
  }, [loadCommits]);

  if (!repository) {
    return (
      <div className="w-80 bg-neutral-900/60 backdrop-blur-xl border-l border-neutral-700/50 p-4">
        <h3 className="text-sm font-medium text-white mb-4">Git Integration</h3>
        <p className="text-sm text-neutral-400">No repository connected</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-neutral-900/60 backdrop-blur-xl border-l border-neutral-700/50 flex flex-col">
      <div className="p-4 border-b border-neutral-700/50">
        <h3 className="text-sm font-medium text-white mb-2">Git Panel</h3>
        <p className="text-xs text-neutral-400">{repository.owner}/{repository.name}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-neutral-700/50">
          <h4 className="text-sm font-medium text-white mb-2">Commit Changes</h4>
          
          <div className="space-y-2 mb-3">
            {files.map(file => (
              <label key={file.path} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.path)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles([...selectedFiles, file.path]);
                    } else {
                      setSelectedFiles(selectedFiles.filter(f => f !== file.path));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-neutral-300">{file.path}</span>
              </label>
            ))}
          </div>
          
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message..."
            className="w-full h-20 p-2 bg-neutral-800 text-white text-sm rounded border border-neutral-600 resize-none"
          />
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCommit}
              disabled={!commitMessage.trim() || selectedFiles.length === 0}
              className="flex-1 px-3 py-2 bg-motion-500 text-white text-sm rounded hover:bg-motion-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commit
            </button>
            <button
              onClick={onPush}
              className="px-3 py-2 bg-neutral-700 text-white text-sm rounded hover:bg-neutral-600"
            >
              Push
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="text-sm font-medium text-white mb-2">Recent Commits</h4>
          {isLoading ? (
            <p className="text-sm text-neutral-400">Loading...</p>
          ) : (
            <div className="space-y-2">
              {commits.slice(0, 10).map(commit => (
                <div key={commit.hash} className="text-xs">
                  <div className="text-neutral-300 font-mono">{commit.hash.slice(0, 7)}</div>
                  <div className="text-neutral-400">{commit.message}</div>
                  <div className="text-neutral-500">{commit.author.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CodeEditor({ 
  files, 
  onFilesChange, 
  repository,
  className = '' 
}: CodeEditorProps) {
  const [editorState, setEditorState] = useState<CodeEditorState>({
    activeFile: null,
    openFiles: [],
    unsavedChanges: new Set<string>(),
    searchQuery: '',
    searchResults: [],
    breakpoints: {},
    cursor: { line: 1, column: 1 },
    selection: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }
  });
  const [githubService, setGithubService] = useState<GitHubService | null>(null);

  useEffect(() => {
    if (repository?.accessToken) {
      setGithubService(new GitHubService(repository.accessToken));
    }
  }, [repository]);

  const handleFileSelect = (file: SourceFile) => {
    setEditorState(prev => ({
      ...prev,
      activeFile: file.path,
      openFiles: prev.openFiles.includes(file.path) ? prev.openFiles : [...prev.openFiles, file.path]
    }));
  };

  const handleFileCreate = (path: string, isFolder: boolean) => {
    if (!isFolder) {
      const newFile: SourceFile = {
        id: Date.now().toString(),
        path,
        content: '',
        language: 'plaintext',
        size: 0,
        lastModified: new Date(),
        modifiedBy: 'user',
        isGenerated: false,
        isEditable: true
      };
      onFilesChange([...files, newFile]);
    }
  };

  const handleFileDelete = (path: string) => {
    const updatedFiles = files.filter(f => f.path !== path);
    onFilesChange(updatedFiles);
    
    if (editorState.activeFile === path) {
      setEditorState(prev => ({
        ...prev,
        activeFile: null,
        openFiles: prev.openFiles.filter(f => f !== path)
      }));
    }
  };

  const handleFileRename = (oldPath: string, newPath: string) => {
    const updatedFiles = files.map(f => 
      f.path === oldPath ? { ...f, path: newPath } : f
    );
    onFilesChange(updatedFiles);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!editorState.activeFile || !value) return;
    
    const updatedFiles = files.map(f => 
      f.path === editorState.activeFile ? { ...f, content: value, lastModified: new Date() } : f
    );
    onFilesChange(updatedFiles);
    
    setEditorState(prev => ({
      ...prev,
      unsavedChanges: new Set([...Array.from(prev.unsavedChanges), editorState.activeFile!])
    }));
  };

  const handleSave = async () => {
    if (!editorState.activeFile) return;
    
    const newUnsavedChanges = new Set(editorState.unsavedChanges);
    newUnsavedChanges.delete(editorState.activeFile);
    
    setEditorState(prev => ({
      ...prev,
      unsavedChanges: newUnsavedChanges
    }));

    // If connected to GitHub, save to repository
    if (repository && githubService) {
      try {
        const file = files.find(f => f.path === editorState.activeFile);
        if (file) {
          await githubService.updateFile(
            repository.owner,
            repository.name,
            file.path,
            file.content,
            `Update ${file.path}`,
            repository.branch
          );
        }
      } catch (error) {
        console.error('Failed to save to GitHub:', error);
      }
    }
  };

  const handleCommit = async (message: string, filePaths: string[]) => {
    if (!repository || !githubService) return;
    
    try {
      const filesToCommit = files
        .filter(f => filePaths.includes(f.path))
        .map(f => ({ path: f.path, content: f.content }));
      
      await githubService.createCommit(
        repository.owner,
        repository.name,
        message,
        filesToCommit,
        repository.branch
      );
      
      // Clear unsaved changes for committed files
      const newUnsavedChanges = new Set(editorState.unsavedChanges);
      filePaths.forEach(path => newUnsavedChanges.delete(path));
      setEditorState(prev => ({ ...prev, unsavedChanges: newUnsavedChanges }));
      
    } catch (error) {
      console.error('Failed to commit:', error);
    }
  };

  const handlePush = async () => {
    // GitHub push is automatic when we commit
    console.log('Changes pushed to repository');
  };

  const currentFile = files.find(f => f.path === editorState.activeFile);
  const hasUnsavedChanges = editorState.activeFile ? editorState.unsavedChanges.has(editorState.activeFile) : false;

  return (
    <div className={`flex h-full bg-neutral-950 ${className}`}>
      <FileTree
        files={files}
        onFileSelect={handleFileSelect}
        activeFile={editorState.activeFile}
        onFileCreate={handleFileCreate}
        onFileDelete={handleFileDelete}
        onFileRename={handleFileRename}
      />
      
      <div className="flex-1 flex flex-col">
        <EditorToolbar
          activeFile={currentFile || null}
          onSave={handleSave}
          onUndo={() => {}}
          onRedo={() => {}}
          hasUnsavedChanges={hasUnsavedChanges}
          onGitCommit={() => {}}
          onGitPush={handlePush}
          repository={repository}
        />
        
        <div className="flex-1 relative">
          {currentFile ? (
            <div className="h-full">
              <textarea
                value={currentFile.content}
                onChange={(e) => handleEditorChange(e.target.value)}
                className="w-full h-full p-4 bg-neutral-900 text-white font-mono text-sm resize-none focus:outline-none"
                placeholder="Start typing..."
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {repository && (
        <GitPanel
          repository={repository}
          files={files}
          onCommit={handleCommit}
          onPush={handlePush}
          githubService={githubService || undefined}
        />
      )}
    </div>
  );
} 