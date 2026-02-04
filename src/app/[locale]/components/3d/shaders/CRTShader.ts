import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Shader CRT que simula una pantalla de monitor antiguo
 * - Scanlines horizontales
 * - Efecto de flicker
 * - Distorsión de bordes (efecto curvo)
 * - Viñeta
 * - Tinte de color
 */

export interface CRTShaderUniforms {
  uTexture: THREE.Texture | null;
  uTime: number;
  uScanlineIntensity: number;
  uFlickerIntensity: number;
  uDistortion: number;
  uVignetteIntensity: number;
  uTint: [number, number, number];
}

export const DEFAULT_CRT_UNIFORMS: Omit<CRTShaderUniforms, 'uTexture'> = {
  uTime: 0,
  uScanlineIntensity: 0.15,
  uFlickerIntensity: 0.03,
  uDistortion: 0.05,
  uVignetteIntensity: 0.8,
  uTint: [0.7, 1.0, 0.8], // Verde Pip-Boy
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uScanlineIntensity;
  uniform float uFlickerIntensity;
  uniform float uDistortion;
  uniform float uVignetteIntensity;
  uniform vec3 uTint;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Distorsión en los bordes (efecto CRT curvo)
    vec2 center = uv - 0.5;
    float dist = length(center);
    uv += center * dist * dist * uDistortion;
    
    // Color base de la textura
    vec4 color = texture2D(uTexture, uv);
    
    // Scanlines horizontales
    float scanline = sin(uv.y * 400.0) * uScanlineIntensity;
    color.rgb -= scanline;
    
    // Flicker sutil
    float flicker = sin(uTime * 10.0) * uFlickerIntensity;
    color.rgb += flicker;
    
    // Viñeta (oscurecer bordes)
    float vignette = 1.0 - dist * uVignetteIntensity;
    color.rgb *= vignette;
    
    // Aplicar tinte de color
    color.rgb *= uTint;
    
    gl_FragColor = color;
  }
`;

export const CRTMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: DEFAULT_CRT_UNIFORMS.uTime,
    uScanlineIntensity: DEFAULT_CRT_UNIFORMS.uScanlineIntensity,
    uFlickerIntensity: DEFAULT_CRT_UNIFORMS.uFlickerIntensity,
    uDistortion: DEFAULT_CRT_UNIFORMS.uDistortion,
    uVignetteIntensity: DEFAULT_CRT_UNIFORMS.uVignetteIntensity,
    uTint: DEFAULT_CRT_UNIFORMS.uTint,
  },
  vertexShader,
  fragmentShader
);

// Extender para uso en JSX
extend({ CRTMaterial });

// Tipos para TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      cRTMaterial: any;
    }
  }
}
