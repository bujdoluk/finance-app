import { CONSTANTS } from '~~/utils/constants';
import { type ToastType, type ToastOptions, toastcolors } from '../../utils/types/toast';

export function useToastHandler() {
	const toast = useToast();

	const showToast = (type: ToastType, message: string, options: Partial<ToastOptions> = {}) => {
		toast.add({
			title: options.title ?? type,
			description: message,
			color: toastcolors[type],
			duration: options.duration ?? CONSTANTS.DURATION,
			icon: options.icon,
			close: true,
		});
	};

	return { showToast };
}
