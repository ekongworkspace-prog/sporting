import QRCode from "qrcode";

// export const generateQrCode = async (token: string): Promise<string> => {
//   return QRCode.toDataURL(token, {
//     errorCorrectionLevel: "M",
//     margin: 2,
//     width: 400,
//   });
// };

export const generateQrCode = async (token: string): Promise<Buffer> => {
  return QRCode.toBuffer(token, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 400,
  });
};
