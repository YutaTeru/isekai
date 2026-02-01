import { MapNode } from '../types';

// Map Nodes for the Park Area
// Coordinates are in percentages (x: 0-100, y: 0-100)
// Origin is top-left.

export const PARK_NODES: MapNode[] = [
    // --- ENTRANCES (Start) ---
    { id: 'start_left', x: 20, y: 95, type: 'start', nextNodes: ['junc_left_1'] },
    { id: 'start_center', x: 50, y: 95, type: 'start', nextNodes: ['junc_center_1'] },
    { id: 'start_right', x: 80, y: 95, type: 'start', nextNodes: ['junc_right_1'] },

    // --- JUNCTIONS & PATHS ---

    // Left Route
    { id: 'junc_left_1', x: 20, y: 80, type: 'waypoint', nextNodes: ['junc_left_split'] },
    { id: 'junc_left_split', x: 20, y: 70, type: 'junction', nextNodes: ['path_left_bench', 'junc_pond_left'] },

    // Center Route
    { id: 'junc_center_1', x: 50, y: 80, type: 'junction', nextNodes: ['junc_pond_lower', 'junc_playground'] },

    // Right Route
    { id: 'junc_right_1', x: 80, y: 80, type: 'waypoint', nextNodes: ['junc_right_split'] },
    { id: 'junc_right_split', x: 80, y: 70, type: 'junction', nextNodes: ['path_right_bench', 'junc_pond_right'] },

    // --- INTERMEDIATE JUNCTIONS ---

    // Near Pond
    { id: 'junc_pond_left', x: 30, y: 60, type: 'junction', nextNodes: ['end_pond_ducks', 'junc_bridge_left'] },
    { id: 'junc_pond_right', x: 70, y: 60, type: 'junction', nextNodes: ['end_pond_ducks', 'junc_bridge_right'] },
    { id: 'junc_pond_lower', x: 50, y: 70, type: 'junction', nextNodes: ['junc_pond_left', 'junc_pond_right'] },

    // Bridge Area
    { id: 'junc_bridge_left', x: 40, y: 50, type: 'waypoint', nextNodes: ['junc_bridge_mid'] },
    { id: 'junc_bridge_right', x: 60, y: 50, type: 'waypoint', nextNodes: ['junc_bridge_mid'] },
    { id: 'junc_bridge_mid', x: 50, y: 45, type: 'junction', nextNodes: ['path_upper_center'] },

    // Playground Area (Lower Right)
    { id: 'junc_playground', x: 60, y: 85, type: 'junction', nextNodes: ['end_playground_slide', 'end_playground_swings'] },

    // Upper Area
    { id: 'path_upper_center', x: 50, y: 30, type: 'junction', nextNodes: ['end_shrine', 'junc_upper_split'] },
    { id: 'junc_upper_split', x: 50, y: 20, type: 'junction', nextNodes: ['end_bench_upper_left', 'end_gazebo'] },


    // --- DESTINATIONS (End) ---

    // Left Side
    { id: 'end_bench_left', x: 10, y: 60, type: 'end', nextNodes: [], targetId: 'bench_left' }, // Need defined ID later
    { id: 'path_left_bench', x: 15, y: 65, type: 'waypoint', nextNodes: ['end_bench_left'] },

    // Right Side
    { id: 'end_bench_right', x: 90, y: 60, type: 'end', nextNodes: [], targetId: 'bench_right' },
    { id: 'path_right_bench', x: 85, y: 65, type: 'waypoint', nextNodes: ['end_bench_right'] },

    // Pond
    { id: 'end_pond_ducks', x: 40, y: 55, type: 'end', nextNodes: [], targetId: 'pond_ducks' },

    // Playground
    { id: 'end_playground_slide', x: 75, y: 85, type: 'end', nextNodes: [], targetId: 'slide' },
    { id: 'end_playground_swings', x: 65, y: 90, type: 'end', nextNodes: [], targetId: 'swings' },

    // Upper
    { id: 'end_shrine', x: 50, y: 10, type: 'end', nextNodes: [], targetId: 'shrine' },
    { id: 'end_bench_upper_left', x: 20, y: 20, type: 'end', nextNodes: [], targetId: 'sakura_tree' },
    { id: 'end_gazebo', x: 80, y: 20, type: 'end', nextNodes: [], targetId: 'gazebo' },
];
