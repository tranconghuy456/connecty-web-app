// MODULES
import React from "react";

// Input field
const Input = ({
  id,
  className,
  type,
  label,
  placeholder,
  onChange,
  onError,
  register,
  value,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type || "text"}
        className={`
    ${className} w-full p-2 block rounded-lg text-sm mb-1 text-slate-200 focus:outline hover:outline
        ${
          onError[id]
            ? "outline outline-red-800 bg-red-600/20"
            : "outline-2 outline-teal-600 bg-teal-400/20"
        }
        `}
        placeholder={placeholder}
        {...register(id)}
        value={value}
      />
      {onError[id] && (
        <span className="text-red-500 text-sm mt-1">
          <i className="ri-error-warning-line ri-lg mr-1 h-100"></i>
          {onError[id]["message"]}
        </span>
      )}
    </>
  );
};

// File Input field
const FileInput = ({
  id,
  className,
  label,
  placeholder,
  accept,
  onChange,
  onError,
  register,
  action,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="file"
        className={`
    ${className} w-full rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-700 file:text-slate-300 hover:file:text-slate-100
        ${
          onError[id]
            ? "outline outline-red-800 bg-red-600/20"
            : "outline-2 outline-teal-600 bg-teal-400/20"
        }
        `}
        placeholder={placeholder}
        {...register(id)}
        accept={accept}
        onChange={(e) => {
          onChange(e);
        }}
      />
      {onError[id] && (
        <span className="text-red-500 text-sm">
          <i className="ri-error-warning-line ri-lg mr-1 h-100"></i>
          {onError[id]["message"]}
        </span>
      )}
    </>
  );
};

export { Input, FileInput };
