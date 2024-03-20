struct InstanceData {
    transform: vec4f, // x, y, width, height,
    frame: vec4f, // x, y, width, height,
    rotation: f32,
    flip: f32,
    offset: vec2f, // x, y,
    color: vec4f, // r, g, b, a
}

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

@group(2) @binding(0)
var<uniform> instance_data: array<InstanceData, 1000>;

@vertex
fn vs_main(
  @builtin(vertex_index) vertex_index: u32,
  @builtin(instance_index) instance_index: u32,
) -> VertexOutput {
  var output: VertexOutput;
  let position = array(
    vec2f(instance_data[instance_index].transform.x, instance_data[instance_index].transform.y),
    vec2f(instance_data[instance_index].transform.x + instance_data[instance_index].transform[2], instance_data[instance_index].transform.y),
    vec2f(instance_data[instance_index].transform.x + instance_data[instance_index].transform[2], instance_data[instance_index].transform.y + instance_data[instance_index].transform[3]),
    vec2f(instance_data[instance_index].transform.x, instance_data[instance_index].transform.y + instance_data[instance_index].transform[3]),
  );

  let uv = array(
    vec2f(0, 0),
    vec2f(1, 0),
    vec2f(1, 1),
    vec2f(0, 1),
  );

  output.position = projection_view_matrix * vec4f(position[vertex_index], 0.0, 1.0);
  output.color = instance_data[instance_index].color;
  output.uv = uv[vertex_index];

  return output;
}

@fragment
fn fs_main(output: VertexOutput) -> @location(0) vec4f {
  var texture_color = textureSample(texture, texture_sampler, output.uv);
  return texture_color * output.color;
}

@fragment
fn fs_repeating(output: VertexOutput) -> @location(0) vec4f {
  var texture_color = textureSample(texture, texture_sampler, fract(output.uv));
  return texture_color * output.color;
}