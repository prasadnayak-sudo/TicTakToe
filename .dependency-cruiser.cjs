/**
 * dependency-cruiser config
 * Kaam: project ka import graph banana taaki pata chale
 * "is changed file ko kaun kaun import karta hai" (reverse lookup).
 */
module.exports = {
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' }, // TS path alias (@/components) resolve karne ke liye
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
};
