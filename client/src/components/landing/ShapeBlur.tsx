import React, { useRef, useEffect, FC } from 'react';

const vertexShaderSource = `#version 300 es
in vec2 position;
out vec2 v_texcoord;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    v_texcoord = position * 0.5 + 0.5; // Map -1..1 to 0..1
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 v_texcoord;
out vec4 fragColor;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif

// VAR defines the shape variation: 0=Rect, 1=Circle, 2=CircleOutline, 3=Triangle
#ifndef VAR
#define VAR 0
#endif

vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}
float sdPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}

float aastep(float threshold, float value) {
    // dFdx/dFdy are built-in for WebGL2 (GLSL ES 3.0)
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;

    float size = u_shapeSize;
    float roundness = u_roundness;
    float borderSize = u_borderSize;
    float circleSize = u_circleSize;
    float circleEdge = u_circleEdge;

    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );

    float sdf;
    if (VAR == 0) {
        float d = sdRoundRect(st, vec2(size), roundness);
        sdf = strokeAA(d, 0.0, borderSize, sdfCircle) * 4.0;
    } else if (VAR == 1) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
    } else if (VAR == 2) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = strokeAA(sdf, 0.58, 0.02, sdfCircle) * 4.0;
    } else if (VAR == 3) { // Triangle
        sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
        sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
    }

    vec3 color = vec3(1.0);
    float alpha = sdf;
    fragColor = vec4(color.rgb, alpha);
}
`;

interface ShapeBlurProps {
    className?: string;
    variation?: number;
    pixelRatioProp?: number;
    shapeSize?: number;
    roundness?: number;
    borderSize?: number;
    circleSize?: number;
    circleEdge?: number;
}

// Simple damp function to replace THREE.MathUtils.damp
// frame independent damping
function damp(current: number, target: number, lambda: number, dt: number) {
    return current + (target - current) * (1.0 - Math.exp(-lambda * dt));
}

export const ShapeBlur: FC<ShapeBlurProps> = ({
    className = '',
    variation = 0,
    pixelRatioProp = 2,
    shapeSize = 1.2,
    roundness = 0.4,
    borderSize = 0.05,
    circleSize = 0.3,
    circleEdge = 0.5
}) => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Create Canvas
        const canvas = document.createElement('canvas');
        // Using WebGL 2 for full GLSL ES 3.0 support (dFdx/dFdy) without extensions
        const gl = canvas.getContext('webgl2', { alpha: true });

        if (!gl) {
            console.error("WebGL 2 not supported");
            return;
        }

        mount.appendChild(canvas);

        // Compile Shader Function
        const createShader = (gl: WebGL2RenderingContext, type: number, source: string, defines: Record<string, any> = {}) => {
            let finalSource = source;
            // Inject defines after version string
            const lines = source.split('\n');
            let injected = false;
            finalSource = lines.map((line, i) => {
                if (!injected && line.trim().startsWith('#version')) {
                    injected = true;
                    return line + '\n' + Object.keys(defines).map(k => `#define ${k} ${defines[k]}`).join('\n');
                }
                return line;
            }).join('\n');

            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, finalSource);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource, { VAR: variation });

        if (!vertShader || !fragShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        // Fullscreen Quad
        const positions = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniform Locations
        const locs = {
            u_mouse: gl.getUniformLocation(program, 'u_mouse'),
            u_resolution: gl.getUniformLocation(program, 'u_resolution'),
            u_pixelRatio: gl.getUniformLocation(program, 'u_pixelRatio'),
            u_shapeSize: gl.getUniformLocation(program, 'u_shapeSize'),
            u_roundness: gl.getUniformLocation(program, 'u_roundness'),
            u_borderSize: gl.getUniformLocation(program, 'u_borderSize'),
            u_circleSize: gl.getUniformLocation(program, 'u_circleSize'),
            u_circleEdge: gl.getUniformLocation(program, 'u_circleEdge'),
        };

        // State
        const vMouse = { x: 0, y: 0 };
        const vMouseDamp = { x: 0, y: 0 };
        let width = 0;
        let height = 0;
        let time = 0;
        let lastTime = performance.now();
        let animationFrameId: number;

        const onPointerMove = (e: MouseEvent | PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            vMouse.x = e.clientX - rect.left;
            vMouse.y = e.clientY - rect.top;
        };

        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('pointermove', onPointerMove);

        const resize = () => {
            const rect = mount.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            gl.viewport(0, 0, canvas.width, canvas.height);

            gl.uniform2f(locs.u_resolution, canvas.width, canvas.height);
            gl.uniform1f(locs.u_pixelRatio, dpr);
        };
        resize();
        window.addEventListener('resize', resize);
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        // Initial Uniforms
        gl.uniform1f(locs.u_shapeSize, shapeSize);
        gl.uniform1f(locs.u_roundness, roundness);
        gl.uniform1f(locs.u_borderSize, borderSize);
        gl.uniform1f(locs.u_circleSize, circleSize);
        gl.uniform1f(locs.u_circleEdge, circleEdge);

        // Enable Transparency/Blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const render = () => {
            const now = performance.now();
            const dt = (now - lastTime) * 0.001; // in seconds
            lastTime = now;

            // Damp mouse info
            vMouseDamp.x = damp(vMouseDamp.x, vMouse.x, 8, dt);
            vMouseDamp.y = damp(vMouseDamp.y, vMouse.y, 8, dt);

            gl.uniform2f(locs.u_mouse, vMouseDamp.x, vMouseDamp.y);

            // Clear to transparent
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            document.removeEventListener('mousemove', onPointerMove);
            document.removeEventListener('pointermove', onPointerMove);
            ro.disconnect();
            if (mount.contains(canvas)) mount.removeChild(canvas);
            gl.deleteProgram(program);
        };

    }, [variation, pixelRatioProp, shapeSize, roundness, borderSize, circleSize, circleEdge]);

    return <div ref={mountRef} className={`w-full h-full ${className}`} style={{ minHeight: '100%', minWidth: '100%' }} />;
};

export default ShapeBlur;
