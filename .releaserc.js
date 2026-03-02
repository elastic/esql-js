const isDryRun = process.argv.includes('--dry-run');

export default {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'next',
    'next-major',
    { name: 'beta', prerelease: true },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'build', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'revert', release: 'patch' },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
        },
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ...(isDryRun
      ? []
      : [
          [
            '@semantic-release/github',
            {
              successComment: false,
              failComment: false,
            },
          ],
          [
            '@semantic-release/npm',
            {
              provenance: true,
            },
          ],
        ]),
  ],
};
