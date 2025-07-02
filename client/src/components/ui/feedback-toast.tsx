
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FeedbackToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  className?: string;
}

export function FeedbackToast({ 
  type, 
  title, 
  description, 
  action, 
  onClose,
  className 
}: FeedbackToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      'rounded-lg border p-4 shadow-lg max-w-md w-full',
      colors[type],
      className
    )}>
      <div className="flex items-start space-x-3">
        <Icon className={cn('w-5 h-5 mt-0.5', iconColors[type])} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          {description && (
            <p className="text-sm mt-1 opacity-90">{description}</p>
          )}
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="mt-3 text-xs"
            >
              {action.label}
            </Button>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
