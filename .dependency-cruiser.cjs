/**
 * dependency-cruiser config
 * Kaam: project ka import graph banana taaki pata chale
 * "is changed file ko kaun kaun import karta hai" (reverse lookup).
 */
module.exports = {
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' }, // TS path alias (@/components) resolve karne ke liye
    // `import type { ... }` compile hone pe gayab ho jaata hai. Ye flag off ho to
    // shared types file "isolated" dikhti hai — jabki asal mein sabse zyada
    // blast radius usi ka hota hai.
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
}
