export interface ToastInterface {
  message: string;
  type: 'confirm' | 'error';
  isOpen: boolean;
  isAnimated: boolean;
  icon?: string;
}
