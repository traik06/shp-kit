import createDataView from "../helpers/createDataView";
type FieldMeta = {
  field_key: string;
  field_name: string;
  field_type: "C" | "N" | "L";
  field_length: number;
  field_decimal_length: number;
};

type Properties = { [key: string]: string | number | boolean | object | any[] }[];

const formatStringField = (input: string, len: number) => {
  const limitedString = input.substring(0, len);
  const remainingSpaces = Math.max(0, len - limitedString.length);
  const result = limitedString + " ".repeat(remainingSpaces);
  return result;
};

const formatNumField = (input: number, len: number, decimalSpaces: number) => {
  const formattedNumber = input.toFixed(decimalSpaces);
  const remainingSpaces = Math.max(0, len - formattedNumber.length);
  const result = " ".repeat(remainingSpaces) + formattedNumber;
  return result;
};

const getMeta = (properties: Properties) => {
  const fieldsMetaObjecet: {
    [key: string]: FieldMeta;
  } = {};
  let value: any;
  let decimal: any;
  let length: any;
  properties.forEach((props) => {
    Object.keys(props).forEach((key) => {
      value = props[key];

      if (typeof value === "boolean") {
        if (typeof fieldsMetaObjecet[key] === "undefined") {
          fieldsMetaObjecet[key] = {
            field_key: key,
            field_name: key,
            field_type: "L",
            field_length: 1,
            field_decimal_length: 0,
          };
        }
      }

      if (typeof value === "string") {
        if (typeof fieldsMetaObjecet[key] === "undefined") {
          fieldsMetaObjecet[key] = {
            field_key: key,
            field_name: key,
            field_type: "C",
            field_length: value.length,
            field_decimal_length: 0,
          };
        } else {
          (fieldsMetaObjecet[key] as FieldMeta).field_length = Math.min(
            254,
            Math.max(value.length, (fieldsMetaObjecet[key] as FieldMeta).field_length)
          );
        }
      }

      if (typeof value === "number") {
        if (typeof fieldsMetaObjecet[key] === "undefined") {
          decimal = String(value).split(".")[1]?.length;
          fieldsMetaObjecet[key] = {
            field_key: key,
            field_name: key,
            field_type: "N",
            field_length: String(value).length,
            field_decimal_length: decimal ? decimal : 0,
          };
        } else {
          decimal = String(value).split(".")[1]?.length;
          length = String(value).length;
          (fieldsMetaObjecet[key] as FieldMeta).field_length = Math.min(
            254,
            Math.max(length, (fieldsMetaObjecet[key] as FieldMeta).field_length)
          );
          (fieldsMetaObjecet[key] as FieldMeta).field_decimal_length = Math.max(
            decimal,
            (fieldsMetaObjecet[key] as FieldMeta).field_decimal_length
          );
        }
      }
    });
  });
  const recordLength = Object.values(fieldsMetaObjecet).reduce((total, meta) => {
    return total + meta.field_length;
  }, 1); // 1 - Data records are preceded by one byte, that is, a space (20h) if the record is not deleted, an asterisk (2Ah) if the record is deleted.

  //Remove possible duplicate keys
  const existingKeys = new Set<string>([]);
  const makeUniqueKey = (name: string): string => {
    let uniqueName = name;
    let counter = 1;
    while (existingKeys.has(uniqueName)) {
      uniqueName = `${counter.toString().padStart(3, "0")}.${name}`.substring(0, 10);
      counter++;
    }
    existingKeys.add(uniqueName);
    return uniqueName;
  };

  const fieldsMeta = Object.values(fieldsMetaObjecet).map((v) => {
    return {
      ...v,
      field_name: makeUniqueKey(v.field_name.substring(0, 10)),
    } as FieldMeta;
  });
  return { fieldsMeta, recordLength };
};
const dbf = (records: { [key: string]: string | number | boolean | object | any[] }[]) => {
  const { fieldsMeta, recordLength } = getMeta(records);

  const fileByteLength =
    32 + // Header
    32 * fieldsMeta.length + // Header descriptors
    1 + // 0x0D field terminator
    recordLength * records.length + // Records
    1; // 0x1A file-end marker

  const dbfView = createDataView(fileByteLength);
  dbfView.setUint8(fileByteLength - 1, 26); // 0x1A file-end marker

  dbfView.setUint8(0, 3);

  const now = new Date();
  dbfView.setUint8(1, now.getFullYear() - 1900); // Year
  dbfView.setUint8(2, now.getMonth() + 1); // Month
  dbfView.setUint8(3, now.getDate()); // Day

  dbfView.setInt32(4, records.length, true); // records count
  dbfView.setInt16(8, 32 + fieldsMeta.length * 32 + 1, true); // header length
  dbfView.setInt16(10, recordLength, true); // header length

  fieldsMeta.forEach((meta, mi) => {
    for (let i = 0; i < 10; i++) {
      dbfView.setUint8(32 + mi * 32 + i, meta.field_name?.charCodeAt(i) || 0);
    }
    dbfView.setUint8(32 + mi * 32 + 11, meta.field_type?.charCodeAt(0));
    dbfView.setUint8(32 + mi * 32 + 16, meta.field_length);
    dbfView.setUint8(32 + mi * 32 + 17, meta.field_decimal_length);
  });

  dbfView.setUint8(32 + fieldsMeta.length * 32, 13); // Day

  const headerOffset = 32 + fieldsMeta.length * 32 + 1;

  records.forEach((record, ri) => {
    let recordOffset = 1;
    dbfView.setUint8(headerOffset + ri * recordLength, " ".charCodeAt(0));
    fieldsMeta.forEach((field) => {
      if (field.field_type === "C") {
        const string = formatStringField((record[field.field_key] as string) || "", field.field_length);
        for (let i = 0; i < string.length; i++) {
          dbfView.setUint8(headerOffset + ri * recordLength + recordOffset + i, string.charCodeAt(i));
        }
      }
      if (field.field_type === "N") {
        const num = formatNumField(
          (record[field.field_key] as number) || -1,
          field.field_length,
          field.field_decimal_length
        );
        for (let i = 0; i < num.length; i++) {
          dbfView.setUint8(headerOffset + ri * recordLength + recordOffset + i, num.charCodeAt(i));
        }
      }
      recordOffset += field.field_length;
    });
  });

  return dbfView;
};

export default dbf;
