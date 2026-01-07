export type ToastType = 'SUCCESS' | 'WARNING' | 'ERROR';

export interface ToastOptions {
	title?: string;
	description?: string;
	duration?: number;
	onClose?: () => void;
	icon?: string;
}

export const toastcolors = {
	SUCCESS: 'success',
	WARNING: 'warning',
	ERROR: 'error',
} as const;
