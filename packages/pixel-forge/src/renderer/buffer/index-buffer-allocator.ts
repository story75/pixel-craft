/**
 * Creates an index buffer allocator for the given device.
 *
 * @remarks
 * Passed data is automatically mapped to the GPU buffer.
 *
 * @param device
 */
export function indexBufferAllocator(device: GPUDevice) {
    return (data: Uint16Array): GPUBuffer => {
        const buffer = device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        new Uint16Array(buffer.getMappedRange()).set(data);
        buffer.unmap();
        return buffer;
    };
}
