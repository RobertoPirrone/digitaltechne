import { canisterId } from "../../declarations/uploads";

export const dmy_hms = (d, full) => {
  var ret = "";
  if (full) ret = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " ";
  return ret + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
};

// yyyy-mm-dd
export const dmy = (s) => {
  return s.substring(8) + "/" + s.substring(5, 7) + "/" + s.substring(0, 4);
};

export const now = (full) => {
  return dmy_hms(new Date(), full);
};

export const downloadArrayBuffer = (ab, fileName, fileType) => {
  var blob = new Blob([ab], { type: fileType });
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

export const prettyJson = (obj, preformatted, nl2br) => {
  let pretty = JSON.stringify(obj, null, 2);
  if (nl2br) pretty = pretty.replace(/[\n]/g, "<br>");
  if (preformatted) pretty = "<pre>" + pretty + "</pre>";
  return pretty;
};

export const getAssetPfx = () => {
  const isLocal = !window.location.host.endsWith("icp0.io");
  let asset_pfx = `https://${canisterId}.icp0.io`;
  if (isLocal) {
    asset_pfx = `http://${canisterId}.localhost:4943`;
  }

  console.log("asset_pfx :", asset_pfx);
  return asset_pfx;
};
