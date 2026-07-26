// This declaration file tells TypeScript that whenever it sees an import
// for a file ending in .geojson, it should treat the imported value as a string
// representing the public URL of that file. This is how Vite handles static asset imports.
declare module '*.geojson' {
  const value: string;
  export default value;
}