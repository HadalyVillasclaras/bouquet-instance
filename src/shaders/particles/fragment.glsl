varying vec3 vColor;
varying vec3 vPosition;


void main()
{
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if(distanceToCenter > 0.6)
        discard;

    gl_FragColor = vec4(vColor, 0.9);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}