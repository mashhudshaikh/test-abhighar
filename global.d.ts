// Allows TypeScript to recognize side-effect imports of style files
// before Next.js generates next-env.d.ts on first run.
declare module "*.css";
declare module "*.scss";
declare module "*.sass";