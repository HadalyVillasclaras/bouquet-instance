uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

// uniform vec3 uCursor;
// float cursorDistance = distance(particle.xyz, uCursor);
// float around = smoothstep(2., 0., cursorDistance);

#include ../includes/simplexNoise4d.glsl

void main() {
  float time = uTime * 0.2;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  // cada cuadrado del plano coresponde a 1 pixel de uParticles, la cual a su vez corresponde a las coordinadas de cada particula
  vec4 particle = texture(uParticles, uv);
  vec4 base = texture(uBase, uv);

  // particle.x += 0.01; // y es el canal green porque rgba es igual xyzw
  // gl_FragColor = vec4(uv, 0.0, 1.0); // degradado

  // Dead
  if (particle.a >= 1.0) {
    particle.a = mod(particle.a, 1.0); // usamos modulo para que cuando cambie de pestaña no empiece de nuevo la animación
    particle.xyz = base.xyz;
    
  }

  // Alive
   else {
    // Strength
    float strength = simplexNoise4d(vec4(base.xyz * 0.5, time + 1.0)); // al multiplicarlo hacemos que incremente la fuerza y el largo de las olas q se mueven
    float influence = (uFlowFieldInfluence - 0.5) * (- 2.0); //uFlowFieldInfluence va de 0 a 1, pero en el smoothstep necesitamos que vaya de -1 a 1, por eso se hace este mapeo mediante este calculo matemático
    strength = smoothstep(influence, 1.0, strength);

    // Flow field 
    vec3 flowField = vec3(
      // simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)), //original with freq. the 3 the same
      simplexNoise4d(vec4(particle.xyz + 0.0, time * uFlowFieldFrequency)),
      simplexNoise4d(vec4(particle.xyz + 1.0, time * uFlowFieldFrequency)),
      simplexNoise4d(vec4(particle.xyz + 2.0, time * uFlowFieldFrequency))
    );

    flowField = normalize(flowField);
    particle.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;

    // Decay
    particle.a += uDeltaTime * 0.3;
  }

  gl_FragColor = particle; 
}