/**
 * Publishes every public workspace package whose version is not on npm yet.
 * Then tags the release so the Changesets action can create a GitHub release.
 *
 * This replaces `changeset publish`, which publishes through `pnpm publish`.
 * npm trusted publishing is handled by the npm CLI, so each package is packed with pnpm
 * and the tarball is published with npm. Packing with pnpm rewrites `workspace:` ranges.
 *
 * A version that is already on npm is skipped. The release workflow runs this on every push
 * to `main` without pending changesets, and most of those have nothing new to publish.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The package manifest fields this script reads. */
interface Manifest {
  name: string;
  version: string;
  private?: boolean;
  scripts?: Record<string, string>;
}

function isManifest(value: unknown): value is Manifest {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'version' in value &&
    typeof value.version === 'string'
  );
}

function readManifest(dir: string): Manifest {
  const parsed: unknown = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  if (!isManifest(parsed)) {
    throw new Error(`${dir}/package.json has no name or version`);
  }
  return parsed;
}

function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PACKAGES = join(ROOT, 'packages');

function run(command: string, args: string[], cwd: string): void {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function isPublished(name: string, version: string): boolean {
  try {
    const found = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return found.trim() === version;
  } catch {
    // `npm view` exits with an error for a version the registry does not have.
    return false;
  }
}

/**
 * Returns the dist-tag to publish under.
 * A prerelease such as `1.0.0-next.3` goes under `next`, so `latest` never points at a prerelease.
 */
function distTagOf(version: string): string {
  const prerelease = /^\d+\.\d+\.\d+-([0-9A-Za-z-]+)/.exec(version);
  return prerelease ? prerelease[1] : 'latest';
}

let published = 0;

for (const entry of readdirSync(PACKAGES, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }
  const dir = join(PACKAGES, entry.name);
  const pkg = readManifest(dir);
  if (pkg.private) {
    continue;
  }

  if (isPublished(pkg.name, pkg.version)) {
    log(`${pkg.name}@${pkg.version} is already on npm, skipping.`);
    continue;
  }

  const tag = distTagOf(pkg.version);
  log(`Publishing ${pkg.name}@${pkg.version} under "${tag}".`);

  // Publishing a tarball skips lifecycle scripts, so build before packing.
  if (pkg.scripts?.build !== undefined) {
    run('pnpm', ['run', 'build'], dir);
  }

  const out = mkdtempSync(join(tmpdir(), 'solid-use-pack-'));
  try {
    run('pnpm', ['pack', '--pack-destination', out], dir);
    const tarball = readdirSync(out).find((file) => file.endsWith('.tgz'));
    if (tarball === undefined) {
      throw new Error(`pnpm pack produced no tarball for ${pkg.name}`);
    }
    // Trusted publishing adds provenance on its own, so no token or `--provenance` flag is needed.
    run('npm', ['publish', join(out, tarball), '--access', 'public', '--tag', tag], dir);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
  published += 1;
}

// Tags every public package version that has no git tag yet.
// It runs even when nothing was published, so a failed tag step is retried on the next push.
run('pnpm', ['exec', 'changeset', 'git-tag'], ROOT);

log(published > 0 ? `Published ${published} package(s).` : 'Nothing new to publish.');
