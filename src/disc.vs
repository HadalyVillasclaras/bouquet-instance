#include '../includes/simplexNoise4d.glsl'
uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;
uniform vec3 uModelCursor;


void main(){
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);

    float displacementIntensity = distance(normalize(particle.xyz), normalize(uModelCursor));
    displacementIntensity = smoothstep(0.0, 0.2, displacementIntensity);

    if(particle.a >= 1.0){
        particle.a = fract(particle.a);
        particle.xyz = base.xyz;
    }else{
        //STrength
        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
        float influence = (uFlowFieldInfluence - 0.5) * (- 2.0);
        strength = smoothstep(influence, 1.0, strength);
        // Flow field
        vec3 flowField = vec3(
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))
        );
        flowField = normalize(flowField);

        particle.xyz /= displacementIntensity;

        particle.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;

        //Decay
        particle.a += uDeltaTime * 0.3;

    }


    gl_FragColor = particle;
}


// Good start
// But don't do that particle.xyz /= displacementIntensity;
// You are changing the particle position, raw
// Instead, use the displacementIntensity on the strength of you flow field (the influence)




// OTRO

// Mouse
vec2 mouseDir = normalize(uMouse.xy - modelPosition.xy);
modelPosition.xy -= mouseDir * .2;