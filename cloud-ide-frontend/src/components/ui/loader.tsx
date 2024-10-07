import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="absolute bg-white/80 size-full z-50 inset-0 flex justify-center items-center">
      <LoaderCircle className="animate-spin text-black size-16 md:size-20 " />
    </div>
  );
}
