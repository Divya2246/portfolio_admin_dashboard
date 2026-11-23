import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../../utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-secondary',
  danger: 'btn-secondary text-danger border-danger',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: '',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn('btn', variantStyles[variant], sizeStyles[size], fullWidth && 'w-full', className)}
      disabled={disabled}
      {...props}
    />
  );
}
