type SvgProps = React.SVGProps<SVGSVGElement>;

export function EnrichAnimation() {
  return (
    <>
      <div className="scale-75 lg:scale-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <DottedCircleCentre className="h-[436px] w-[436px] max-w-[80vmin] max-h-[80vmin]" />
      </div>

      <div className="scale-75 lg:scale-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <CircleOutlineCentre className="h-[376px] w-[376px] max-w-[69vmin] max-h-[69vmin]" />
      </div>

      <div className="scale-75 lg:scale-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <SemiCircleCentre
          id="enrich-sweep"
          className="h-[436px] w-[436px] max-w-[80vmin] max-h-[80vmin]"
        />
      </div>

      <div className="scale-75 lg:scale-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <RevolvingCircleCentre
          id="enrich-orbit"
          className="h-[436px] w-[436px] max-w-[80vmin] max-h-[80vmin]"
        />
      </div>

      <DiamondTopLeft className="scale-75 lg:scale-100 absolute left-4 lg:left-8 top-8" />
      <BarcodeTopRight className="scale-75 lg:scale-100 absolute right-0 lg:right-6 top-6" />
      <BarcodeBottomLeft className="scale-75 lg:scale-100 absolute bottom-2 lg:bottom-6 left-2 lg:left-6" />
      <BottomLeftDots className="scale-75 lg:scale-100 absolute bottom-3 lg:bottom-6 right-0 lg:right-6 animate-flicker" />
    </>
  );
}

function DottedCircleCentre(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 436 436"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="218"
        cy="218"
        r="217.65"
        stroke="#020203"
        strokeOpacity="0.5"
        strokeWidth="0.7"
        strokeDasharray="4 6"
      />
    </svg>
  );
}

function CircleOutlineCentre(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 376 376"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="188" cy="188" r="187.5" stroke="#020203" />
    </svg>
  );
}

function SemiCircleCentre(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 436 436"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M140.835 -0.00120318C163.726 9.24604 184.572 22.9115 202.182 40.215C219.792 57.5184 233.822 78.121 243.469 100.846C253.117 123.572 258.194 147.975 258.411 172.662C258.628 197.35 253.98 221.839 244.733 244.73C235.486 267.621 221.82 288.467 204.517 306.077C187.213 323.687 166.611 337.716 143.885 347.364C121.16 357.012 96.7568 362.089 72.0692 362.306C47.3817 362.523 22.8931 357.875 0.00186268 348.628L70.4185 174.313L140.835 -0.00120318Z"
        fill="#020203"
        fillOpacity="0.85"
        transform="translate(147.58 43.69)"
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}

function RevolvingCircleCentre(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 436 436"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="133" cy="420" r="10" fill="#2F47F0" />
    </svg>
  );
}

function DiamondTopLeft(props: SvgProps) {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        id="enrich-diamond"
        x="0.707107"
        y="22.6289"
        width="31"
        height="31"
        transform="rotate(-45 0.707107 22.6289)"
        stroke="black"
      />
    </svg>
  );
}

function BarcodeTopRight(props: SvgProps) {
  return (
    <svg
      width="71"
      height="44"
      viewBox="0 0 71 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0.865627 0H0V43.2814H0.865627V0Z" fill="black" />
      <path d="M6.92345 0H3.46094V43.2814H6.92345V0Z" fill="black" />
      <path d="M8.6625 0H7.79688V43.2814H8.6625V0Z" fill="black" />
      <path d="M11.2547 0H9.52344V43.2814H11.2547V0Z" fill="black" />
      <path d="M15.5766 0H14.7109V43.2814H15.5766V0Z" fill="black" />
      <path d="M17.3109 0H16.4453V43.2814H17.3109V0Z" fill="black" />
      <path d="M19.9125 0H19.0469V43.2814H19.9125V0Z" fill="black" />
      <path d="M22.5047 0H20.7734V43.2814H22.5047V0Z" fill="black" />
      <path d="M25.1 0H24.2344V43.2814H25.1V0Z" fill="black" />
      <path d="M30.3016 0H28.5703V43.2814H30.3016V0Z" fill="black" />
      <path d="M32.8953 0H31.1641V43.2814H32.8953V0Z" fill="black" />
      <path d="M37.2203 0H33.7578V43.2814H37.2203V0Z" fill="black" />
      <path d="M39.8172 0H38.0859V43.2814H39.8172V0Z" fill="black" />
      <path d="M42.4188 0H40.6875V43.2814H42.4188V0Z" fill="black" />
      <path d="M46.7438 0H43.2812V43.2814H46.7438V0Z" fill="black" />
      <path d="M49.3406 0H47.6094V43.2814H49.3406V0Z" fill="black" />
      <path d="M51.9422 0H50.2109V43.2814H51.9422V0Z" fill="black" />
      <path d="M56.2672 0H52.8047V43.2814H56.2672V0Z" fill="black" />
      <path d="M58.8641 0H57.1328V43.2814H58.8641V0Z" fill="black" />
      <path d="M61.4578 0H59.7266V43.2814H61.4578V0Z" fill="black" />
      <path d="M65.7906 0H62.3281V43.2814H65.7906V0Z" fill="black" />
      <path d="M68.3875 0H66.6562V43.2814H68.3875V0Z" fill="black" />
      <path d="M70.9813 0H69.25V43.2814H70.9813V0Z" fill="black" />
    </svg>
  );
}

function BarcodeBottomLeft(props: SvgProps) {
  return (
    <svg
      width="49"
      height="44"
      viewBox="0 0 49 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3.46251 0H0V43.2814H3.46251V0Z" fill="black" />
      <path d="M8.73125 0H7V43.2814H8.73125V0Z" fill="black" />
      <path d="M15.8656 0H15V43.2814H15.8656V0Z" fill="black" />
      <path d="M22.5969 0H20V43.2814H22.5969V0Z" fill="black" />
      <path d="M28.7313 0H27V43.2814H28.7313V0Z" fill="black" />
      <path d="M37.5969 0H35V43.2814H37.5969V0Z" fill="black" />
      <path d="M42.8656 0H42V43.2814H42.8656V0Z" fill="black" />
      <path d="M48.7313 0H47V43.2814H48.7313V0Z" fill="black" />
    </svg>
  );
}

function BottomLeftDots(props: SvgProps) {
  return (
    <svg
      width="104"
      height="48"
      viewBox="0 0 104 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="3" cy="3" r="3" fill="#020203" />
      <circle cx="25" cy="3" r="3" fill="#020203" />
      <circle cx="47" cy="3" r="3" fill="#020203" />
      <circle cx="69" cy="3" r="3" fill="#020203" />
      <circle cx="91" cy="3" r="3" fill="#020203" />
      <circle cx="3" cy="17" r="3" fill="#020203" />
      <circle cx="25" cy="17" r="3" fill="#020203" />
      <circle cx="47" cy="17" r="3" fill="#020203" />
      <circle cx="69" cy="17" r="3" fill="#2F47F0" />
      <circle cx="91" cy="17" r="3" fill="#020203" />
      <circle cx="3" cy="31" r="3" fill="#020203" />
      <circle cx="25" cy="31" r="3" fill="#020203" />
      <circle cx="47" cy="31" r="3" fill="#020203" />
      <circle cx="69" cy="31" r="3" fill="#020203" />
      <circle cx="91" cy="31" r="3" fill="#020203" />
      <circle cx="3" cy="45" r="3" fill="#020203" />
      <circle cx="25" cy="45" r="3" fill="#020203" />
      <circle cx="47" cy="45" r="3" fill="#020203" />
      <circle cx="69" cy="45" r="3" fill="#020203" />
      <circle cx="91" cy="45" r="3" fill="#020203" />
    </svg>
  );
}
