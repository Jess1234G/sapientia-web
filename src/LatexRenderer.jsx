// src/LatexRenderer.jsx
import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function LatexRenderer({ content }) {
  if (!content) return null;

  // 1. LIMPIEZA DE SALTOS DE LÍNEA (La solución al error)
  // DeepSeek a veces mete \n alrededor de los delimitadores, lo que rompe el renderizador.
  let cleanContent = content
    .replace(/\n*\\\[\n*/g, '\\[')
    .replace(/\n*\\\]\n*/g, '\\]')
    .replace(/\n*\$\$\n*/g, '$$')
    .replace(/\n*\\\(\n*/g, '\\(')
    .replace(/\n*\\\)\n*/g, '\\)');

  // 2. Si después de limpiar no queda nada, no renderizamos
  if (!cleanContent.trim()) return null;

  return (
    <div className="latex-renderer" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
      <Latex>{cleanContent}</Latex>
    </div>
  );
}