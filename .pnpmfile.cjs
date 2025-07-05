function allowBuild(pkgName) {
  const allowed = [
    'sharp',
    '@tailwindcss/oxide',
    'unstorage',
    'esbuild',
    '@swc/core'
  ];
  return allowed.includes(pkgName);
}

module.exports = {
  hooks: { allowBuild }
};