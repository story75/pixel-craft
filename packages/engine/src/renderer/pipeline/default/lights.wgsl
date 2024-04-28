struct GlobalLight {
    @location(0) color: vec3f,
    @location(1) intensity: f32,
}

// bind group order should be from changing least(0) to most(n) frequently

@group(0) @binding(0)
var<uniform> projection_view_matrix: mat4x4f;

@group(1) @binding(0)
var<uniform> global_light: GlobalLight;

@group(1) @binding(1)
var gbuffer: texture_2d<f32>;

@vertex
fn vs_lights(@builtin(vertex_index) vertex_index: u32) -> @builtin(position) vec4f {
  const pos = array(
    vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
    vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0),
  );

  return vec4f(pos[vertex_index], 0.0, 1.0);
}

@fragment
fn fs_lights(@builtin(position) position: vec4f) -> @location(0) vec4f {
    var texture_color = textureLoad(gbuffer, vec2i(floor(position.xy)), 0);
    var light_color = global_light.color * global_light.intensity;
    return texture_color * vec4f(light_color, 1.0);
}