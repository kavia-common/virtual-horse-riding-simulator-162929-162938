# Horse Riding Simulator Frontend

A modern React-based 3D horse riding simulator featuring:
- 3D riding environment built with Three.js via @react-three/fiber
- Keyboard controls (W/S/A/D + Shift) for movement and sprint
- Scoring and progress through checkpoints and obstacle collisions
- Customizable horse and rider colors
- Interactive tutorial that responds to user actions
- Modern, light-themed UI using primary #3B4CCA, accent #6DC5D1, secondary #F4A300

## Scripts

- npm start
- npm run build
- npm test

## Environment Variables

Create a .env based on .env.example:
- REACT_APP_API_BASE_URL: reserved for future backend integrations
- REACT_APP_SITE_URL: public site URL for redirects/integrations
- REACT_APP_QUALITY_PRESET: default quality preset; one of low|medium|high

These must be prefixed with REACT_APP_ to be accessible from the browser environment (CRA standard).

## Controls

- W/S: Move forward/backwards
- A/D: Turn left/right
- Shift: Sprint

## Layout

- Topbar: brand, quality selector, reset, leaderboard
- Sidebar: controls cheat sheet, customization, tutorial
- Main: 3D scene canvas + HUD cards for score, progress, speed

## Notes

- The 3D horse and rider are simplified primitive meshes to keep bundle size low; swap with GLTF models as needed.
- Collision detection is AABB-based and kept intentionally simple for performance.
- State management uses Zustand for lightweight global state.
