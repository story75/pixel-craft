struct GlobalLight {
    @location(0) color: vec3f,
    @location(1) intensity: f32,
}

struct PointLight {
    @location(0) color: vec3f,
    @location(1) intensity: f32,
    @location(2) position: vec2f,
}

struct CameraTransform {
    @location(0) translation: vec2f,
    @location(1) scaling: vec2f,
}

// bind group order should be from changing least(0) to most(n) frequently

@group(0) @binding(0)
var<uniform> projection_view_matrix: mat4x4f;

@group(1) @binding(0)
var<uniform> camera_transform: CameraTransform;

@group(2) @binding(0)
var<uniform> global_light: GlobalLight;

@group(2) @binding(1)
var gbuffer: texture_2d<f32>;

@group(2) @binding(2)
var<uniform> point_light_amount: u32;

@group(2) @binding(3)
var<storage, read> point_lights: array<PointLight>;

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

    for (var i = 0u; i < point_light_amount; i++) {
        var point_light = point_lights[i];
        var light_position = (point_light.position + camera_transform.translation) * camera_transform.scaling;

        var light_distance = length(light_position - position.xy);
        var light_attenuation = mix(2, 0, clamp(light_distance / 200, 0, 1));

        light_color += point_light.color * point_light.intensity * light_attenuation;
    }

    return texture_color * vec4f(light_color, 1.0);
}