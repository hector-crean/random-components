

import "./App.css";

import { SandboxPage } from "./pages/SandboxPage";


/**
 * Within VideoPage: 
 *  - sidebar needs to know what 
 */


const routes = [
    { path: '/sandbox', component: SandboxPage }
] as const;


type RoutePath = typeof routes[number]['path']

export { routes };
export type { RoutePath };


