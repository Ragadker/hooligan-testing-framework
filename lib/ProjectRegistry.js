import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_MANIFEST_DIR = './manifests';

/**
 * Loads and validates project manifests.
 */
export class ProjectRegistry {
  /**
   * Creates a project registry.
   * @param {string} manifestDir - Folder containing project manifest files.
   */
  constructor(manifestDir = DEFAULT_MANIFEST_DIR) {
    this.manifestDir = manifestDir;
  }

  /**
   * Loads all project manifests from the manifest directory.
   * @returns {Array<object>} List of project manifests.
   */
  listProjects() {
    if (!fs.existsSync(this.manifestDir)) {
      return [];
    }

    const files = fs
      .readdirSync(this.manifestDir)
      .filter((file) => file.endsWith('.json'));

    return files.map((file) => {
      const manifestPath = path.join(this.manifestDir, file);
      return this.loadManifest(manifestPath);
    });
  }

  /**
   * Finds one project manifest by project name.
   * @param {string} projectName - Project name to find.
   * @returns {object} Matching project manifest.
   */
  getProject(projectName) {
    const projects = this.listProjects();
    const project = projects.find((item) => item.name === projectName);

    if (!project) {
      throw new Error(`Project "${projectName}" was not found.`);
    }

    return project;
  }

  /**
   * Loads and validates one manifest file.
   * @param {string} manifestPath - Path to the manifest file.
   * @returns {object} Validated manifest object.
   */
  loadManifest(manifestPath) {
    const rawContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(rawContent);

    this.validateManifest(manifest);

    return {
      ...manifest,
      manifestPath
    };
  }

  /** 
   * Validates required manifest fields.
   @param {object} manifest -Manifest object to validate.
   */
  validateManifest(manifest) {
    const requiredFields = ['name', 'baseUrl', 'testDir'];

    for (const field of requiredFields) {
      if (!manifest[field]) {
        throw new Error(`Manifest is missing required field: ${field}`);
      }
    }

    if (typeof manifest.name !== 'string') {
      throw new Error('Manifest field "name" must be a string.');
    }

    if (typeof manifest.baseUrl !== 'string') {
      throw new Error('Manifest field "baseUrl" must be a string.');
    }

    if (typeof manifest.testDir !== 'string') {
      throw new Error('Manifest field "testDir" must be a string.');
    }
  }
}
