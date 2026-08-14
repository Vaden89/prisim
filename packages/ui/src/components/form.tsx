import { ReactNode } from "react";
import { cn } from "./cn";

interface FormFieldProps extends FormLabelProps {
  name?: string;
  value?: string;
  type?: string;
  prefix?: ReactNode;
  readOnly?: boolean;
  placeholder?: string;
  inputClassName?: string;
  formFieldClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormField({
  placeholder,
  label,
  htmlFor,
  required,
  inputClassName,
  formFieldClassName,
  onChange,
  name,
  value,
  prefix,
  type = "text",
  readOnly = false,
}: FormFieldProps) {
  const inputStyling = cn(
    "w-full outline-none border-none text-sm",
    inputClassName,
  );
  const fieldStyling = cn(
    "w-full bg-light-gray/10 rounded-xl flex items-center gap-2 px-4 py-3 outline outline-1 outline-outline-gray-700 focus-within:outline-foreground",
    formFieldClassName,
  );

  return (
    <div className="w-full flex flex-col gap-1 items-start">
      <FormLabel label={label} htmlFor={htmlFor} required={required} />
      <div className={fieldStyling}>
        {prefix && <span className="shrink-0">{prefix}</span>}
        <input
          name={name}
          type={type ?? "text"}
          id={htmlFor}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={readOnly}
          className={inputStyling}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

interface FormTextAreaProps extends FormLabelProps {
  name?: string;
  value?: string;
  rows?: number;
  readOnly?: boolean;
  placeholder?: string;
  textAreaClassName?: string;
  formFieldClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function FormTextArea({
  placeholder,
  label,
  htmlFor,
  required,
  textAreaClassName,
  formFieldClassName,
  onChange,
  name,
  value,
  rows = 4,
  readOnly = false,
}: FormTextAreaProps) {
  const textAreaStyling = cn(
    "w-full outline-none border-none text-sm resize-none bg-transparent",
    textAreaClassName,
  );
  const fieldStyling = cn(
    "w-full bg-light-gray/10 rounded-xl flex items-start gap-2 px-4 py-3 outline outline-1 outline-outline-gray-700 focus-within:outline-foreground",
    formFieldClassName,
  );

  return (
    <div className="flex flex-col gap-1 items-start">
      <FormLabel label={label} htmlFor={htmlFor} required={required} />
      <div className={fieldStyling}>
        <textarea
          name={name}
          id={htmlFor}
          rows={rows}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={readOnly}
          className={textAreaStyling}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

interface FormLabelProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
}

export function FormLabel({ label, htmlFor, required }: FormLabelProps) {
  return (
    <label htmlFor={htmlFor}>
      <span className="text-sm text-light-gray">{label}</span>
      {required && <span className="text-red-500 text-xs">*</span>}
    </label>
  );
}
