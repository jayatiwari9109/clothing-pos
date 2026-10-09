// Auto-generate Unique Barcode & SKU Code
export const generateUniqueBarcode = () => {
  // Generates 12-digit numeric barcode (EAN-12 style)
  const prefix = "890"; // India Country Prefix code
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${randomDigits}`;
};

export const generateSKU = (category = "GEN", size = "STD", color = "MIX") => {
  const catCode = category.substring(0, 3).toUpperCase();
  const sizeCode = size.substring(0, 3).toUpperCase();
  const colorCode = color.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${catCode}-${colorCode}-${sizeCode}-${randomNum}`;
};