# Horse Riding Simulator Frontend

Light-themed, modern React UI implementing a 3D training arena with interactive controls.

Features
- 3D riding environment (react-three-fiber + drei) with sky, ground, and stylized horse
- User controls for horse movement (WASD/Arrow keys + on-screen d-pad)
- Scoring and progress indicators (score, speed, stamina, distance)
- Customizable horse and rider avatars (colors and saddle style)
- Interactive tutorials (step-based with toggle)

UI Layout
- Top navigation: brand, settings, leaderboard, tutorial toggle
- Sidebar: movement/gait selection, avatar customization, tutorials
- Main: 3D simulation canvas with HUD overlays
- Bottom: on-screen movement controls and quick actions

Brand Colors
- Primary: #3B4CCA
- Accent: #6DC5D1
- Secondary: #F4A300

Controls
- Move: W/A/S/D or Arrow keys
- Actions: Jump, Rest (demo stubs)
- Gaits: Walk/Trot/Canter/Gallop – impacts speed and stamina drain

Notes
- Simulation uses a placeholder low-poly horse model built from primitives to keep dependencies light.
- Leaderboard/Settings are mocked alerts for now and can be wired to backend later.
