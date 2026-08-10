type SvgProps = React.SVGProps<SVGSVGElement>;

export function ScanAnimation() {
  return (
    <>
      <div className="scale-75 lg:scale-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <CenterStatic className="h-[436px] w-[436px] max-w-[80vmin] max-h-[80vmin]" />
      </div>

      <div className="scale-75 lg:scale-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ScannerCenter
          id="scanner-center"
          className="h-[436px] w-[436px] max-w-[80vmin] max-h-[80vmin]"
        />
      </div>

      <div className="scale-75 lg:scale-100 absolute right-2/5 lg:right-1/3 top-2/3 -translate-x-1/2 -translate-y-1/2">
        <MovingCircle id="moving" />
      </div>

      <BarcodeTopLeft className="scale-75 lg:scale-100 absolute left-0 lg:left-6 top-6" />
      <BarcodeBottomLeft className="scale-75 lg:scale-100 absolute bottom-2 lg:bottom-6 left-2 lg:left-6" />
      <AnimatedDotsTopRight className="scale-75 lg:scale-100 absolute right-0 lg:right-6 top-6 animate-flicker" />
      <AnimatedRectangleBottomRight className="scale-75 lg:scale-100 absolute bottom-3 lg:bottom-6 right-2 lg:right-6" />
    </>
  );
}

function ScannerCenter(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 436 436"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M433.146 182.829C438.268 214.164 436.484 246.24 427.918 276.813C419.353 307.387 404.212 335.72 383.555 359.832L218.002 218L433.146 182.829Z"
        fill="url(#scanner_paint0_linear)"
      />
      <circle cx="217.727" cy="217.727" r="6.8125" fill="#020203" />
      <defs>
        <linearGradient
          id="scanner_paint0_linear"
          x1="269.681"
          y1="217.72"
          x2="453.639"
          y2="263.23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2F47F0" />
          <stop offset="1" stopColor="#2F47F0" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MovingCircle(props: SvgProps) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="5.45"
        cy="5.45"
        r="5.45"
        fill="#020203"
        style={{ mixBlendMode: "luminosity" }}
      />
    </svg>
  );
}

function BarcodeTopLeft(props: SvgProps) {
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

function AnimatedDotsTopRight(props: SvgProps) {
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
      <circle cx="69" cy="17" r="3" fill="#020203" />
      <circle cx="91" cy="17" r="3" fill="#2030A1" />
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

export function CenterStatic(props: SvgProps) {
  return (
    <svg
      viewBox="0 0 436 436"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="218" cy="218" r="217.5" stroke="#020203" />
      <circle
        cx="218"
        cy="218"
        r="163.125"
        stroke="#020203"
        strokeWidth="0.75"
      />
      <circle cx="218" cy="218" r="108.75" stroke="#020203" strokeWidth="0.5" />
      <line
        y1="217.727"
        x2="436"
        y2="217.727"
        stroke="black"
        strokeOpacity="0.16"
        strokeWidth="0.545"
        strokeDasharray="2.73 2.73"
      />
      <circle cx="242.528" cy="350.434" r="5.45" fill="#020203" />
      <line
        x1="217.727"
        y1="436"
        x2="217.727"
        stroke="black"
        strokeOpacity="0.16"
        strokeWidth="0.545"
        strokeDasharray="2.73 2.73"
      />
      <circle cx="82.0234" cy="204.102" r="6.8125" fill="#020203" />
      <circle
        cx="347.438"
        cy="179.578"
        r="6.8125"
        fill="#020203"
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}

function AnimatedRectangleBottomRight(props: SvgProps) {
  return (
    <svg
      width="46"
      height="43"
      viewBox="0 0 46 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        id="animated-triangle"
        d="M44.4176 41.6286H0.836576L22.6264 1.05767L44.4176 41.6286Z"
        fill="#020203"
        stroke="black"
      />
    </svg>
  );
}
