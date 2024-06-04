import { ChangeEvent, FC } from "react";

interface ITextBoxProps {
  textInput: string;
  className?: string;
  placeholder?: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextBox: FC<ITextBoxProps> = ({
  textInput,
  className,
  placeholder,
  handleInputChange,
}) => {
  return (
    <textarea
      className={className}
      value={textInput}
      onChange={handleInputChange}
      placeholder={placeholder}
    />
  );
};
