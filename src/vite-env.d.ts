/// <reference types="vite/client" />

declare module '*.mod.css' {
    const classes: { [key: string]: string };
    export default classes;
}
  