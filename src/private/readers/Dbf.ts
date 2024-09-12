import toDataView from "../helpers/toDataView";
import { Buffer } from "buffer";

type FieldMeta = {
  field_name: string;
  field_type: "C" | "N" | "L" | "F";
  field_length: number;
};

const dbf = async (file: File | Blob | ArrayBuffer | Buffer) => {
  const dbfView = await toDataView(file);

  const versionLevel = dbfView.getUint8(0) === 3 ? 5 : dbfView.getUint8(0) === 4 ? 7 : -1;

  const recordsLength = dbfView.getUint32(4, true);
  const headerLength = dbfView.getUint16(8, true);
  const recordLength = dbfView.getUint16(10, true);

  const fieldsMeta: FieldMeta[] = [];

  if (![5, 7].includes(versionLevel)) {
    throw new Error("Unknown dbase version number");
  }

  const fieldMetaStart = versionLevel === 5 ? 32 : 68;
  const fieldMetaRecordLength = versionLevel === 5 ? 32 : 48;

  for (let i = fieldMetaStart; i < headerLength - fieldMetaRecordLength; i += fieldMetaRecordLength) {
    const fieldNameLength = versionLevel === 5 ? 11 : 32;
    const fieldLengthByte = versionLevel === 5 ? 16 : 33;
    const field_name = Buffer.from(dbfView.buffer.slice(i, i + fieldNameLength))
      .toString("utf-8")
      .replace(/\x00/g, "");
    const field_type = String.fromCharCode(dbfView.getUint8(i + 11)) as "C" | "N" | "L" | "F";
    const field_length = dbfView.getUint8(i + fieldLengthByte);
    fieldsMeta.push({
      field_name,
      field_type,
      field_length,
    } as FieldMeta);
  }

  const parsedProperties: { [key: string]: any }[] = [];
  for (let i = headerLength + 1; i < headerLength + recordLength * recordsLength; i += recordLength) {
    let currOffset = 0;
    const propObject: { [key: string]: any } = {};
    fieldsMeta.forEach((field) => {
      let value: any = Buffer.from(dbfView.buffer.slice(i + currOffset, i + currOffset + field.field_length))
        .toString("utf-8")
        .trim()
        .replace(/\x00/g, "");

      if (["F", "N"].includes(field.field_type)) {
        value = Number(value);
      }
      if (["L"].includes(field.field_type)) {
        value = "TY".includes((value as string).toUpperCase()) ? true : false;
      }

      currOffset += field.field_length;
      propObject[field.field_name] = value;
    });
    parsedProperties.push(propObject);
  }

  return parsedProperties;
};

export default dbf;
