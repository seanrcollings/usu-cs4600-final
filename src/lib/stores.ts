import { writable } from 'svelte/store';
import type { ExtraNavOption } from './types/nav';

export const theme = writable('dark');

export const extraNavOptions = writable([] as ExtraNavOption[]);

export const currentPosition = writable<GeolocationPosition | null | undefined>(undefined);
