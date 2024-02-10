const bufferEqualityCheck = (id: string, buf1: ArrayBuffer, buf2: ArrayBuffer, ignoreByteIndexes: number[] = []) => {
  if (buf1.byteLength != buf2.byteLength) return false;
  var dv1 = new Int8Array(buf1);
  var dv2 = new Int8Array(buf2);
  const diffs = [];
  for (var i = 0; i != buf1.byteLength; i++) {
    0;
    if (dv1[i] != dv2[i] && !ignoreByteIndexes.includes(i)) {
      diffs.push(i);
    }
  }
  if (diffs.length > 0) {
    console.log("DIFFS IN", id, diffs);
    return false;
  }
  return true;
};

export default bufferEqualityCheck;
