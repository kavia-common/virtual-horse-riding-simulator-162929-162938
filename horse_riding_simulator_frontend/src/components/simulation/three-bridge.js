import * as THREE from 'three';

// Attach THREE to window to simplify small interop in components that refer to window.THREE
if (typeof window !== 'undefined') {
  window.THREE = THREE;
}

export default THREE;
