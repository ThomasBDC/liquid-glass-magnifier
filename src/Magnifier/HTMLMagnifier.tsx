import React, { useEffect, useRef, useState } from 'react';
import './Magnifier.css'; // pour styles supplémentaires si besoin

const defaultOptions = {
  zoom: 2,
  shape: 'square',
  width: 200,
  height: 200,
};

const isDescendant = (parent, child) => {
  let node = child;
  while (node != null) {
    if (node === parent) return true;
    node = node.parentNode;
  }
  return false;
};

export const HTMLMagnifier = ({ zoom = 2, shape = 'square', width = 200, height = 200, visible = false, onClose }) => {
  const magnifierRef = useRef(null);
  const magnifierContentRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const magnifier = magnifierRef.current;
    const magnifierContent = magnifierContentRef.current;

    if (!magnifier || !magnifierContent) return;

    const updatePosition = (event) => {
      const left = event.pageX - width / 2;
      const top = event.pageY - height / 2;
      magnifier.style.left = `${left}px`;
      magnifier.style.top = `${top}px`;
    };

    const setupMagnifier = () => {
      magnifier.style.width = `${width}px`;
      magnifier.style.height = `${height}px`;
      magnifier.style.borderRadius = shape === 'circle' ? '50%' : '4px';
      const scale = `scale(${zoom})`;
      magnifierContent.style.transform = scale;
      magnifierContent.style.transformOrigin = 'left top';
    };

    const cloneBody = () => {
      const bodyCopy = document.body.cloneNode(true);
      bodyCopy.style.cursor = 'auto';
      bodyCopy.style.paddingTop = '0px';
      const scripts = bodyCopy.querySelectorAll('script, audio, video, .magnifier');
      scripts.forEach((el) => el.parentNode.removeChild(el));
      magnifierContent.innerHTML = '';
      magnifierContent.appendChild(bodyCopy);
      magnifierContent.style.width = `${document.body.clientWidth}px`;
      magnifierContent.style.height = `${document.body.clientHeight}px`;
    };

    const onMouseMove = (e) => {
      updatePosition(e);
    };

    magnifier.style.display = 'block';
    setupMagnifier();
    cloneBody();

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [visible, zoom, shape, width, height]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={magnifierRef}
      className="magnifier"
      style={{
        position: 'fixed',
        overflow: 'hidden',
        backgroundColor: 'white',
        border: '1px solid #555',
        borderRadius: shape === 'circle' ? '50%' : '4px',
        zIndex: 10000,
        top: 200,
        left: 200,
        display: 'none',
      }}
    >
      <div
        ref={magnifierContentRef}
        className="magnifier-content"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          userSelect: 'none',
        }}
      />
      <div
        className="magnifier-glass"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          backgroundColor: 'white',
          cursor: 'move',
        }}
        onMouseDown={onClose}
      />
    </div>
  );
};