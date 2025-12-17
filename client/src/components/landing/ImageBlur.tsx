import React, { useRef, useEffect, FC } from 'react';

const vertexShaderSource = `#version 300 es
in vec2 position;
out vec2 v_texcoord;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    v_texcoord = position * 0.5 + 0.5;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 v_texcoord;
out vec4 fragColor;

uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_circleSize;
uniform float u_circleEdge;

float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}

float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}

void main() {
    vec2 uv = v_texcoord;
    uv.y = 1.0 - uv.y; // Flip Y for image
    
    // Get image color
    vec4 texColor = texture(u_texture, uv);
    
    // Mouse position in normalized coords
    vec2 mouseNorm = u_mouse / u_resolution;
    mouseNorm.y = 1.0 - mouseNorm.y;
    
    // Distance from mouse
    float dist = length(v_texcoord - mouseNorm);
    
    // Blur amount based on distance from mouse
    float blurCircle = fill(dist * 2.0, u_circleSize, u_circleEdge);
    
    // Sample with offset for blur effect
    float blurAmount = blurCircle * 0.02;
    vec4 blurred = vec4(0.0);
    float samples = 0.0;
    
    for(float x = -2.0; x <= 2.0; x += 1.0) {
        for(float y = -2.0; y <= 2.0; y += 1.0) {
            vec2 offset = vec2(x, y) * blurAmount;
            blurred += texture(u_texture, uv + offset);
            samples += 1.0;
        }
    }
    blurred /= samples;
    
    // Mix original and blurred based on mouse proximity
    vec4 finalColor = mix(texColor, blurred, blurCircle * 0.8);
    
    // Add glow at edges near mouse
    float edgeGlow = blurCircle * 0.3;
    finalColor.rgb += vec3(edgeGlow);
    
    fragColor = finalColor;
}
`;

interface ImageBlurProps {
    className?: string;
    imageSrc: string;
    circleSize?: number;
    circleEdge?: number;
}

function damp(current: number, target: number, lambda: number, dt: number) {
    return current + (target - current) * (1.0 - Math.exp(-lambda * dt));
}

export const ImageBlur: FC<ImageBlurProps> = ({
    className = '',
    imageSrc,
    circleSize = 0.5,
    circleEdge = 0.5
}) => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2', { alpha: true });

        if (!gl) {
            console.error("WebGL 2 not supported");
            return;
        }

        mount.appendChild(canvas);

        // Load image as texture
        const image = new Image();
        image.crossOrigin = 'anonymous';

        let texture: WebGLTexture | null = null;
        let program: WebGLProgram | null = null;
        let animationFrameId: number;

        const vMouse = { x: 0, y: 0 };
        const vMouseDamp = { x: 0, y: 0 };
        let lastTime = performance.now();

        const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        image.onload = () => {
            const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

            if (!vertShader || !fragShader) return;

            program = gl.createProgram();
            if (!program) return;
            gl.attachShader(program, vertShader);
            gl.attachShader(program, fragShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program));
                return;
            }
            gl.useProgram(program);

            // Fullscreen quad
            const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            const positionLoc = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(positionLoc);
            gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

            // Create texture
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Uniforms
            const locs = {
                u_texture: gl.getUniformLocation(program, 'u_texture'),
                u_mouse: gl.getUniformLocation(program, 'u_mouse'),
                u_resolution: gl.getUniformLocation(program, 'u_resolution'),
                u_pixelRatio: gl.getUniformLocation(program, 'u_pixelRatio'),
                u_circleSize: gl.getUniformLocation(program, 'u_circleSize'),
                u_circleEdge: gl.getUniformLocation(program, 'u_circleEdge'),
            };

            gl.uniform1i(locs.u_texture, 0);
            gl.uniform1f(locs.u_circleSize, circleSize);
            gl.uniform1f(locs.u_circleEdge, circleEdge);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            const resize = () => {
                const rect = mount.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.uniform2f(locs.u_resolution, canvas.width, canvas.height);
                gl.uniform1f(locs.u_pixelRatio, dpr);
            };
            resize();
            window.addEventListener('resize', resize);

            const onPointerMove = (e: MouseEvent | PointerEvent) => {
                const rect = canvas.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                vMouse.x = (e.clientX - rect.left) * dpr;
                vMouse.y = (e.clientY - rect.top) * dpr;
            };
            document.addEventListener('mousemove', onPointerMove);

            const render = () => {
                const now = performance.now();
                const dt = (now - lastTime) * 0.001;
                lastTime = now;

                vMouseDamp.x = damp(vMouseDamp.x, vMouse.x, 8, dt);
                vMouseDamp.y = damp(vMouseDamp.y, vMouse.y, 8, dt);

                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                gl.uniform2f(locs.u_mouse, vMouseDamp.x, vMouseDamp.y);
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                animationFrameId = requestAnimationFrame(render);
            };
            render();
        };

        image.src = imageSrc;

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (mount.contains(canvas)) mount.removeChild(canvas);
            if (program) gl.deleteProgram(program);
            if (texture) gl.deleteTexture(texture);
        };
    }, [imageSrc, circleSize, circleEdge]);

    return <div ref={mountRef} className={`w-full h-full ${className}`} />;
};

export default ImageBlur;
