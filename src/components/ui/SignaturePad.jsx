import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

/**
 * SignaturePad Component
 * Canvas vetorial para captura de assinaturas digitais em termos de consentimento e fichas médicas
 */
const SignaturePad = forwardRef(({ onSave, placeholder = 'Assine com o dedo ou mouse aqui' }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Expõe métodos imperativos para o pai (obter dados, limpar, checar)
  useImperativeHandle(ref, () => ({
    clear: () => clearCanvas(),
    isEmpty: () => !hasDrawn,
    toDataURL: () => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : null;
    }
  }));

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#F5F5F5'; // Branco/Prata de alta visibilidade
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    setupCanvas();
    const handleResize = () => {
      // Re-setup on resize
      setupCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches[0]) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (onSave && canvasRef.current) {
      onSave(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (onSave) onSave(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative border border-neutral-700 bg-neutral-950 rounded-sm overflow-hidden group focus-within:border-chrome">
        {/* Marca d'água / Instrução inicial */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-neutral-600">
            <PenTool className="w-5 h-5 mb-1 opacity-50" />
            <span className="text-xs font-mono tracking-wider">{placeholder}</span>
          </div>
        )}

        {/* Linha guia de assinatura estilo cartório */}
        <div className="absolute bottom-6 inset-x-8 border-b border-dashed border-neutral-800 pointer-events-none" />

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-36 cursor-crosshair touch-none"
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-neutral-400 flex items-center gap-1.5">
          {hasDrawn ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Assinatura digital capturada
            </span>
          ) : (
            <span className="text-neutral-500">Campo de assinatura biométrica obrigatório</span>
          )}
        </span>

        <button
          type="button"
          onClick={clearCanvas}
          className="flex items-center gap-1 text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Limpar</span>
        </button>
      </div>
    </div>
  );
});

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;
