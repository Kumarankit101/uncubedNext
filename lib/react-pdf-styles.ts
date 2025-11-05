/**
 * React PDF Styles Loader
 *
 * Loads react-pdf CSS only on the client side to prevent build issues.
 * This file should only be imported in client components with 'use client' directive.
 */

'use client';

// Import react-pdf CSS for annotations and text layers
// These imports are safe here because this file is client-only
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Export a noop function just so this module exports something
export const loadReactPdfStyles = () => {
  // Styles are loaded via the imports above
  return true;
};
