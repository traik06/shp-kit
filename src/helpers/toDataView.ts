const toDataView = async (file: File | Blob | ArrayBuffer | Buffer) => {
  const buffer =
    file instanceof File || file instanceof Blob
      ? await file.arrayBuffer()
      : file instanceof ArrayBuffer
      ? file
      : file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
  return new DataView(buffer);
};
export default toDataView;
