import { ReactNode } from "react"

export default function Divider(
    { label, className }: { label: string, className: string })
{
  return (
    <div className="flex items-center my-4 w-100">
      <div className="grow border-t border-gray-300"></div>
        <span className="shrink mx-4 text-gray-400 font-normal">
            <p className={className}>{label}</p>
        </span>
      <div className="grow border-t border-gray-300"></div>
    </div>
  );
}