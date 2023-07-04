"use client";

import * as React from "react";
import { Input, InputProps } from "./ui/Input";

interface DebounceInputProps extends InputProps {
  debounce?: number;
}

const DebounceInput: React.FC<DebounceInputProps> = ({
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = React.useState(props.value ?? "");
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    setValue(props.value ?? "");
  }, [props.value]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, debounce);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, debounce]);

  React.useEffect(() => {
    if (debouncedValue !== props.value) {
      // @ts-expect-error debouncedValue is not React.ChangeEvent<HTMLInputElement>
      onChange?.(debouncedValue);
    }
  }, [debouncedValue, onChange, props.value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default DebounceInput;
