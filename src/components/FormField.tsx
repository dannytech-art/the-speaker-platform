import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  type?: "text" | "email" | "tel" | "url" | "number" | "date" | "time" | "password";
  id: string;
}

interface TextareaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  id: string;
}

interface SelectFieldProps extends BaseFieldProps {
  id: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, required, description, className, id, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={id} className={cn(error && "text-destructive")}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <Input
          id={id}
          ref={ref}
          className={cn(error && "border-destructive focus-visible:ring-destructive")}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, required, description, className, id, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={id} className={cn(error && "text-destructive")}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <Textarea
          id={id}
          ref={ref}
          className={cn(error && "border-destructive focus-visible:ring-destructive")}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export const FormSelect = ({
  label,
  error,
  required,
  description,
  className,
  id,
  value,
  onValueChange,
  placeholder,
  options,
}: SelectFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger
          id={id}
          className={cn(error && "border-destructive focus-visible:ring-destructive")}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

