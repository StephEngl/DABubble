export interface ToastInterface {
  message: string;
  type: 'create' | 'update' | 'delete' | 'error';
  isOpen: boolean;
  isAnimated: boolean;
  icon?: string;
}
