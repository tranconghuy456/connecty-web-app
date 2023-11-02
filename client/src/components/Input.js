import React from "react";

const Input = (props) => {
  return (
    <div className={props.className}>
      <label
        className="block mb-2 text-sm font-medium text-slate-300"
        htmlFor={props.labelFor}>
        {props.labelText}
      </label>

      <input
        type={props.inputType || "text"}
        accept={props.accept}
        id={props.inputID}
        className={`w-full p-2 block rounded-lg text-sm  text-slate-200 focus:outline hover:outline
        ${props.inputClass} ${
          props.error
            ? "outline outline-red-800 bg-red-600/20"
            : "outline-2 outline-teal-600 bg-teal-400/20"
        }`}
        placeholder={props.placeholder || "Your text"}
        required={props.isRequired}
        {...props.action}
        autoComplete="off"
      />
    </div>
  );
};

export default Input;
