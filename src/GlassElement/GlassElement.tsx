import { CSSProperties, ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  getDisplacementFilter,
  DisplacementOptions,
} from "./getDisplacementFilter";
import { getDisplacementMap } from "./getDisplacementMap";
import styles from "./GlassElement.module.css";

type GlassElementProps = DisplacementOptions & {
  children?: ReactNode | undefined;
  blur?: number;
  debug?: boolean;
  zoom?: number;
};

export const GlassElement = ({
  height,
  width,
  depth: baseDepth,
  radius,
  children,
  strength,
  chromaticAberration,
  blur = 2,
  debug = false,
  zoom = 1,
}: GlassElementProps) => {
  const [clicked, setClicked] = useState(false);
  let depth = baseDepth / (clicked ? 0.7 : 1);

  // Position de la loupe
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: width / 2, y: height / 2 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const magnifierRef = useRef<HTMLDivElement>(null);

  // Clone du body pour la loupe
  const [bodyClone, setBodyClone] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (showMagnifier) {
      const body = document.body;
      const clone = body.cloneNode(true) as HTMLElement;
      // Nettoyage des scripts et vidéos
      const scripts = clone.querySelectorAll('script, audio, video');
      scripts.forEach((el) => el.parentNode?.removeChild(el));
      setBodyClone(clone);
    } else {
      setBodyClone(null);
    }
  }, [showMagnifier]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouse({ x, y });
  };

  const style: CSSProperties = {
    height: `${height}px`,
    width: `${width}px`,
    borderRadius: `${radius}px`,
    backdropFilter: `blur(${blur / 2}px) url('${getDisplacementFilter({
      height,
      width,
      radius,
      depth,
      strength,
      chromaticAberration,
    })}') blur(${blur}px) brightness(1.1) saturate(1.5) `,
    position: "relative",
    overflow: "hidden",
  };

  if (debug === true) {
    style.background = `url("${getDisplacementMap({
      height,
      width,
      radius,
      depth,
    })}")`;
    style.boxShadow = "none";
  }

  // Style de la loupe
  const magnifierStyle: CSSProperties = {
    position: "fixed",
    left: mouse.x + window.scrollX - width / 2,
    top: mouse.y + window.scrollY - height / 2,
    width: `${width}px`,
    height: `${height}px`,
    overflow: "hidden",
    border: "2px solid #555",
    borderRadius: "50%",
    zIndex: 10000,
    background: "white",
    boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
    pointerEvents: "none",
    display: showMagnifier ? "block" : "none",
  };

  const magnifierContentStyle: CSSProperties = {
    position: "absolute",
    left: `-${mouse.x * zoom - width / 2}px`,
    top: `-${mouse.y * zoom - height / 2}px`,
    width: `${window.innerWidth * zoom}px`,
    height: `${window.innerHeight * zoom}px`,
    transform: `scale(${zoom})`,
    transformOrigin: "left top",
    userSelect: "none",
    pointerEvents: "none",
  };

  return (
    <div
      className={styles.box}
      style={style}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseMove={(e) => {
        setShowMagnifier(true);
        handleMouseMove(e);
      }}
      onMouseLeave={() => setShowMagnifier(false)}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      {showMagnifier && bodyClone && createPortal(
        <div style={magnifierStyle} ref={magnifierRef}>
          <div
            style={magnifierContentStyle}
            dangerouslySetInnerHTML={{ __html: bodyClone.innerHTML }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};
