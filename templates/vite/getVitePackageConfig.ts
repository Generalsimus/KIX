export const getVitePackageConfig = (kixVersion: string, tsVersion: string, appName: string) => {
  return {
    "name": appName,
    "private": true,
    "version": "0.0.1",
    "type": "module",
    "scripts": {
      "dev": "vite --open",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "kix": kixVersion,
      "resolve": "^1.22.1",
      "typescript": tsVersion,
      "vite": "^4.0.4",
      "vite-typescript-plugin": "*"
    },
    "devDependencies": {
      "sass": "^1.57.1"
    }
  }

}