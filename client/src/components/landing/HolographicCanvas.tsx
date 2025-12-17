import { useEffect, useRef } from 'react';

export function HolographicCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // VERTEX SHADER: Full-screen quad
        const vertShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        // FRAGMENT SHADER: Simplex Noise + Domain Warping
        // Effect: Liquid, silky, holographic foil
        const fragShaderSource = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;

      // --- SIMPLEX NOISE 3D (Standard Implementation) ---
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      // --- DOMAIN WARPING FBM ---
      float fbm(vec3 p) {
        float f = 0.0;
        f += 0.500 * snoise(p); p *= 2.01;
        f += 0.250 * snoise(p); p *= 2.02;
        f += 0.125 * snoise(p);
        return f;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y; // Aspect correct

        // Domain Warping Logic
        vec3 p = vec3(st * 3.0, uTime * 0.15); // Scale & Time
        
        float n1 = fbm(p);
        vec3 q = p + vec3(n1, n1, 0.0) + vec3(3.2, 1.4, 0.8);
        
        float n2 = fbm(q);
        vec3 r = p + vec3(n2, n2, 0.0) * 2.0 + vec3(1.7, 9.2, uTime * 0.2);
        
        float f = fbm(r); // Final warped noise value

        // --- COLOR PALETTE (Blue / Navy / Cyan) ---
        // Base Dark Navy
        vec3 color = vec3(0.01, 0.02, 0.09); 
        
        // Add layers based on noise intensity
        
        // Deep Blue Flow 
        color = mix(color, vec3(0.0, 0.2, 0.6), smoothstep(0.0, 1.0, f)); 
        
        // Electric Cyan Highlights (The "Foil" shine)
        float shiny = smoothstep(0.4, 0.9, f * n2); // Sharpen the highlights
        color = mix(color, vec3(0.0, 0.95, 1.0), shiny);
        
        // Bright Specs
        color += vec3(0.8) * smoothstep(0.8, 1.0, f * f);

        // Vignette
        float vign = 1.0 - smoothstep(0.5, 1.5, length(st - 0.5) * 1.5);
        color *= vign;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

        // COMPILE HELPERS
        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // ATTRIBUTES
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ]), gl.STATIC_DRAW);

        const positionExt = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionExt);
        gl.vertexAttribPointer(positionExt, 2, gl.FLOAT, false, 0, 0);

        // UNIFORMS
        const timeLoc = gl.getUniformLocation(program, 'uTime');
        const resLoc = gl.getUniformLocation(program, 'uResolution');

        // RESIZE & RENDER
        let animationFrameId: number;
        let startTime = performance.now();

        const render = (time: number) => {
            // Resize if needed
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            const currentTime = (time - startTime) * 0.001; // Seconds

            gl.uniform1f(timeLoc, currentTime);
            gl.uniform2f(resLoc, canvas.width, canvas.height);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };

        render(startTime);

        return () => {
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full opacity-60 mix-blend-screen" />;
}
