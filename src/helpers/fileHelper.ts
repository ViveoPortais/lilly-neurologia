export const fileToBase64 = (file: File): Promise<string> => {
 return new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = () => {
   const result = reader.result as string;
   const base64 = result.split(",")[1];
   resolve(base64);
  };

  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(file);
 });
};

export const downloadBase64File = (base64: string, fileName: string, contentType: string) => {
 const byteCharacters = atob(base64);
 const byteArrays: Uint8Array[] = [];

 for (let i = 0; i < byteCharacters.length; i += 512) {
  const slice = byteCharacters.slice(i, i + 512);
  const byteNumbers = new Array(slice.length);
  for (let j = 0; j < slice.length; j++) {
   byteNumbers[j] = slice.charCodeAt(j);
  }
  byteArrays.push(new Uint8Array(byteNumbers));
 }

 const blob = new Blob(byteArrays, { type: contentType });
 const url = URL.createObjectURL(blob);

 const link = document.createElement("a");
 link.href = url;
 link.download = fileName;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 URL.revokeObjectURL(url);
};
