/**
 * Custom type declarations for importing SVG as React components.
 */
declare module "*.svg" {
  import * as React from "react";
  const src: string;
  export default src;
}
