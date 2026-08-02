import { ReactNode } from "react";
import { cn } from "./cn";

interface FormFieldProps extends FormLabelProps {
  name?: string;
  value?: string;
  type?: string;
  prefix?: ReactNode;
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
}: FormFieldProps) {
  const inputStyling = cn(
    "w-full outline-none border-none text-sm",
    inputClassName,
  );
  const fieldStyling = cn(
    "w-full bg-light-gray/10 rounded-xl flex items-center gap-2 px-4 py-3 outline outline-1 outline-transparent focus-within:outline-foreground",
    formFieldClassName,
  );

  return (
    <div>
      <FormLabel label={label} htmlFor={htmlFor} required={required} />
      <div className={fieldStyling}>
        {prefix && <span className="shrink-0">{prefix}</span>}
        <input
          name={name}
          type={type ?? "text"}
          id={htmlFor}
          value={value}
          onChange={onChange}
          className={inputStyling}
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
