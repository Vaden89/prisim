import { CenterStatic } from "./scan-animation";

export function SubmitAnimation() {
  return (
    <div className="scale-75 lg:scale-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40">
      <CenterStatic className="h-[436px] w-[436px] max-w-[80vmin] max-h-[80vmin]" />
    </div>
  );
}
