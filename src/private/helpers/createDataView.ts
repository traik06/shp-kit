export default (length: number) => {
  const buffer = new ArrayBuffer(length);
  return new DataView(buffer);
};
