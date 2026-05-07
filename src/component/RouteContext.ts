import { Route } from '../model/Route.ts';
import { createContext, Dispatch, type SetStateAction } from 'react';

export type RouteState = [Route, Dispatch<SetStateAction<Route>>];

const defaultRouteState: RouteState = [Route.PRESENTATION, () => {}];

export const RouteContext = createContext<RouteState>(defaultRouteState);
