import { Octokit } from '@octokit/rest';
import { GitRepository, GitCommit, GitBranch, PullRequest, FileChange, SourceFile } from '../types/enhanced';

export class GitHubService {
  private octokit: Octokit;
  
  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  // Repository Management
  async getUserRepositories(): Promise<GitRepository[]> {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100,
      });

      return data.map(repo => ({
        provider: 'github' as const,
        url: repo.html_url,
        owner: repo.owner.login,
        name: repo.name,
        branch: repo.default_branch,
        lastSync: new Date(),
        autoSync: false,
      }));
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      throw error;
    }
  }

  async createRepository(name: string, description: string, isPrivate: boolean = false): Promise<GitRepository> {
    try {
      const { data } = await this.octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      });

      return {
        provider: 'github',
        url: data.html_url,
        owner: data.owner.login,
        name: data.name,
        branch: data.default_branch,
        lastSync: new Date(),
        autoSync: false,
      };
    } catch (error) {
      console.error('Failed to create repository:', error);
      throw error;
    }
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    try {
      await this.octokit.repos.delete({
        owner,
        repo,
      });
    } catch (error) {
      console.error('Failed to delete repository:', error);
      throw error;
    }
  }

  // File Management
  async getRepositoryFiles(owner: string, repo: string, branch: string = 'main'): Promise<SourceFile[]> {
    try {
      const files: SourceFile[] = [];
      
      const getFiles = async (path: string = ''): Promise<void> => {
        const { data } = await this.octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });

        if (Array.isArray(data)) {
          for (const item of data) {
            if (item.type === 'file' && item.download_url) {
              const content = await fetch(item.download_url).then(res => res.text());
              files.push({
                id: item.sha,
                path: item.path,
                content,
                language: this.getLanguageFromExtension(item.name),
                size: item.size,
                lastModified: new Date(),
                modifiedBy: 'system',
                isGenerated: false,
                isEditable: true,
              });
            } else if (item.type === 'dir') {
              await getFiles(item.path);
            }
          }
        }
      };

      await getFiles();
      return files;
    } catch (error) {
      console.error('Failed to fetch repository files:', error);
      throw error;
    }
  }

  async updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string = 'main',
    sha?: string
  ): Promise<void> {
    try {
      const encodedContent = Buffer.from(content).toString('base64');
      
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: encodedContent,
        branch,
        sha,
      });
    } catch (error) {
      console.error('Failed to update file:', error);
      throw error;
    }
  }

  async createFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string = 'main'
  ): Promise<void> {
    try {
      const encodedContent = Buffer.from(content).toString('base64');
      
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: encodedContent,
        branch,
      });
    } catch (error) {
      console.error('Failed to create file:', error);
      throw error;
    }
  }

  async deleteFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    sha: string,
    branch: string = 'main'
  ): Promise<void> {
    try {
      await this.octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        sha,
        branch,
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  // Commit Management
  async getCommits(owner: string, repo: string, branch: string = 'main', limit: number = 50): Promise<GitCommit[]> {
    try {
      const { data } = await this.octokit.repos.listCommits({
        owner,
        repo,
        sha: branch,
        per_page: limit,
      });

      return data.map(commit => ({
        hash: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name || 'Unknown',
          email: commit.commit.author?.email || '',
          avatar: commit.author?.avatar_url,
        },
        timestamp: new Date(commit.commit.author?.date || Date.now()),
        changes: [], // Would need separate API call to get changes
        branch,
        tags: [],
      }));
    } catch (error) {
      console.error('Failed to fetch commits:', error);
      throw error;
    }
  }

  async getCommitChanges(owner: string, repo: string, commitSha: string): Promise<FileChange[]> {
    try {
      const { data } = await this.octokit.repos.getCommit({
        owner,
        repo,
        ref: commitSha,
      });

      return data.files?.map(file => ({
        path: file.filename,
        status: file.status as 'added' | 'modified' | 'deleted' | 'renamed',
        additions: file.additions,
        deletions: file.deletions,
        oldPath: file.previous_filename,
      })) || [];
    } catch (error) {
      console.error('Failed to fetch commit changes:', error);
      throw error;
    }
  }

  async createCommit(
    owner: string,
    repo: string,
    message: string,
    files: { path: string; content: string }[],
    branch: string = 'main'
  ): Promise<string> {
    try {
      // Get the latest commit SHA
      const { data: ref } = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });

      const latestCommitSha = ref.object.sha;

      // Get the tree for the latest commit
      const { data: commit } = await this.octokit.git.getCommit({
        owner,
        repo,
        commit_sha: latestCommitSha,
      });

      // Create blobs for each file
      const blobs = await Promise.all(
        files.map(async file => {
          const { data: blob } = await this.octokit.git.createBlob({
            owner,
            repo,
            content: Buffer.from(file.content).toString('base64'),
            encoding: 'base64',
          });
          return {
            path: file.path,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blob.sha,
          };
        })
      );

      // Create a tree
      const { data: tree } = await this.octokit.git.createTree({
        owner,
        repo,
        base_tree: commit.tree.sha,
        tree: blobs,
      });

      // Create a commit
      const { data: newCommit } = await this.octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: tree.sha,
        parents: [latestCommitSha],
      });

      // Update the reference
      await this.octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: newCommit.sha,
      });

      return newCommit.sha;
    } catch (error) {
      console.error('Failed to create commit:', error);
      throw error;
    }
  }

  // Branch Management
  async getBranches(owner: string, repo: string): Promise<GitBranch[]> {
    try {
      const { data } = await this.octokit.repos.listBranches({
        owner,
        repo,
      });

      return data.map(branch => ({
        name: branch.name,
        commit: branch.commit.sha,
        isDefault: false, // Would need repo info to determine
        isProtected: branch.protected,
        ahead: 0, // Would need comparison
        behind: 0, // Would need comparison
        lastCommit: new Date(),
      }));
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      throw error;
    }
  }

  async createBranch(owner: string, repo: string, branchName: string, fromBranch: string = 'main'): Promise<void> {
    try {
      // Get the SHA of the source branch
      const { data: ref } = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${fromBranch}`,
      });

      // Create the new branch
      await this.octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: ref.object.sha,
      });
    } catch (error) {
      console.error('Failed to create branch:', error);
      throw error;
    }
  }

  async deleteBranch(owner: string, repo: string, branchName: string): Promise<void> {
    try {
      await this.octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
      });
    } catch (error) {
      console.error('Failed to delete branch:', error);
      throw error;
    }
  }

  // Pull Request Management
  async getPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<PullRequest[]> {
    try {
      const { data } = await this.octokit.pulls.list({
        owner,
        repo,
        state,
        per_page: 50,
      });

      return data.map(pr => ({
        id: pr.number,
        title: pr.title,
        description: pr.body || '',
        author: {
          username: pr.user?.login || 'Unknown',
          avatar: pr.user?.avatar_url,
        },
        source: pr.head.ref,
        target: pr.base.ref,
        status: pr.state as 'open' | 'closed',
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
        comments: 0, // This would need a separate API call
        changes: 0, // This would need a separate API call
      }));
    } catch (error) {
      console.error('Failed to fetch pull requests:', error);
      throw error;
    }
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    description: string,
    head: string,
    base: string = 'main'
  ): Promise<PullRequest> {
    try {
      const { data } = await this.octokit.pulls.create({
        owner,
        repo,
        title,
        body: description,
        head,
        base,
      });

      return {
        id: data.number,
        title: data.title,
        description: data.body || '',
        author: {
          username: data.user?.login || 'Unknown',
          avatar: data.user?.avatar_url,
        },
        source: data.head.ref,
        target: data.base.ref,
        status: data.state as 'open' | 'closed',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        comments: data.comments,
        changes: data.changed_files || 0,
      };
    } catch (error) {
      console.error('Failed to create pull request:', error);
      throw error;
    }
  }

  // Deployment Management
  async deployToGitHubPages(
    owner: string,
    repo: string,
    files: { [path: string]: string },
    commitMessage: string = 'Deploy to GitHub Pages'
  ): Promise<string> {
    try {
      // Create or switch to gh-pages branch
      try {
        await this.octokit.git.getRef({
          owner,
          repo,
          ref: 'heads/gh-pages',
        });
      } catch {
        // Branch doesn't exist, create it
        const { data: mainRef } = await this.octokit.git.getRef({
          owner,
          repo,
          ref: 'heads/main',
        });

        await this.octokit.git.createRef({
          owner,
          repo,
          ref: 'refs/heads/gh-pages',
          sha: mainRef.object.sha,
        });
      }

      // Commit files to gh-pages branch
      const fileArray = Object.entries(files).map(([path, content]) => ({
        path,
        content,
      }));

      await this.createCommit(owner, repo, commitMessage, fileArray, 'gh-pages');

      // Enable GitHub Pages if not already enabled
      try {
        await this.octokit.repos.createPagesSite({
          owner,
          repo,
          source: {
            branch: 'gh-pages',
            path: '/',
          },
        });
      } catch {
        // Pages might already be enabled
        console.log('GitHub Pages already enabled or configuration failed');
      }

      return `https://${owner}.github.io/${repo}`;
    } catch (error) {
      console.error('Failed to deploy to GitHub Pages:', error);
      throw error;
    }
  }

  // Utility Methods
  private getLanguageFromExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'dart': 'dart',
      'vue': 'vue',
      'svelte': 'svelte',
    };

    return languageMap[extension || ''] || 'text';
  }

  async getUserInfo() {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return {
        username: data.login,
        name: data.name,
        email: data.email,
        avatar: data.avatar_url,
        profile: data.html_url,
      };
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  }

  async searchRepositories(query: string, sort: 'stars' | 'forks' | 'updated' = 'updated'): Promise<GitRepository[]> {
    try {
      const { data } = await this.octokit.search.repos({
        q: `${query} user:@me`,
        sort,
        per_page: 30,
      });

      return data.items.map(repo => ({
        provider: 'github' as const,
        url: repo.html_url,
        owner: repo.owner?.login || 'Unknown',
        name: repo.name,
        branch: repo.default_branch || 'main',
        lastSync: new Date(),
        autoSync: false,
      }));
    } catch (error) {
      console.error('Failed to search repositories:', error);
      throw error;
    }
  }
} 