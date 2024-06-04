import { FC } from "react";

interface IButtonProps {
  pdfUrl: string;
  label: string;
  className?: string;
}

export const DownloadButton: FC<IButtonProps> = ({
  pdfUrl,
  label,
  className,
}) => {
  return (
    <a href={pdfUrl} download="generated.pdf" className={className}>
      {label}
    </a>
  );
};
