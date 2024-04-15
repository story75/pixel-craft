struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
    @location(1) uv: vec2f,
}

@group(0) @binding(0)
var<uniform> projection_view_matrix: mat4x4f;

@group(1) @binding(0)
var texture_sampler: sampler;

@group(1) @binding(1)
var texture: texture_2d<f32>;

@vertex
fn vs_main(
  @location(0) position: vec3f, // x: f32, y: f32, z: f32,
  @location(1) uv: vec2f, // u: f32, v: f32
  @location(2) color: vec4f, // r: f32, g: f32, b: f32, a: f32
) -> VertexOutput {
  var output: VertexOutput;

  output.position = projection_view_matrix * vec4f(position, 1.0);
  output.color = color;
  output.uv = uv;

  return output;
}

@fragment
fn fs_main(output: VertexOutput) -> @location(0) vec4f {
  var texture_color = textureSample(texture, texture_sampler, output.uv);
  var final_color = texture_color * output.color;
  if (final_color.a < 0.01) {
    discard;
  }

  return final_color;
}

@fragment
fn fs_repeating(output: VertexOutput) -> @location(0) vec4f {
  var texture_color = textureSample(texture, texture_sampler, fract(output.uv));
  var final_color = texture_color * output.color;
  if (final_color.a < 0.01) {
    discard;
  }

  return final_color;
}