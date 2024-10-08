import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { HttpAgent } from "@dfinity/agent";
import { AssetManager } from "@dfinity/assets";
import mime from "mime";
import { v4 as uuidv4 } from 'uuid';

import { canisterId } from "../../declarations/uploads";
import { useAuth } from "./auth/use-auth-client";
import { isLocalHost, getAssetPfx } from "./Utils";

export const UploadNew = ({
    asset,
    setAsset,
    assets,
    setAssets,
    setDisabledButs,
    label,
    show=false,
    accept="image/*"
}) => {
  const { t } = useTranslation(["translation", "dossier", "tipotecnica", "tiposupporto", "tipofirma"]);
  const {principal, identity} = useAuth();
  let asset_pfx = getAssetPfx();
  const [progress, setProgress] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // console.log("META: ", JSON.stringify(import.meta));
  // console.log("ENV: ", JSON.stringify(import.meta.env));
  // console.log("asset_pfx: ", asset_pfx);
  // console.log("asset_pfx principal: ", principal.toText());

  // Create asset manager instance for above asset canister
  // const assetManager = new AssetManager({canisterId, agent});
  const agent = new HttpAgent({
    host: isLocalHost() ? `http://127.0.0.1:4943` : "https://ic0.app",
    identity,
  });
  const assetManager = new AssetManager({ canisterId, agent });
  if (isLocalHost()) {
    agent.fetchRootKey();
  }

  // Get file name, width and height from key
  const detailsFromKey = (key) => {
    const fileName = key.split("/").slice(-1)[0];
    const width = parseInt(fileName.split(".").slice(-3)[0]);
    const height = parseInt(fileName.split(".").slice(-2)[0]);
    return { key, fileName, width, height };
  };

  // Get file name, width and height from file
  const detailsFromFile = async (file, accept) => {
      let width=0;
      let height=0;
    const src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
      if ( accept == "image/*") {
          console.log("IIIIIIII");
        const [width, height] = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
          img.src = src;
        });
      }
    const name = file.name.split(".");
    setUploadedFileName(file.name);
    const extension = name.pop();
    const fileName = [uuidv4(), extension].join(".");
    // const fileName = [name, width, height, extension].join(".");
    console.error("detailsFromFile: ", JSON.stringify(file.name));
    const original_filename = file.name;
    const file_size = file.size;
    const mimetype = mime.getType(original_filename)
    // return {fileName, width, height}
    return { fileName, width, height, original_filename, extension, file_size, mimetype };
  };

  const uploadPhotos = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = true;
    input.onchange = async () => {
      setProgress(0);
      try {
        const upload_items = await assetManager.list();
        const batch = assetManager.batch();
        const items = await Promise.all(
          Array.from(input.files).map(async (file) => {
            const { fileName, width, height, original_filename, extension, file_size, mimetype } = await detailsFromFile(file, accept);
            const key = await batch.store(file, { path: "/uploads", fileName });
            return { key, fileName, width, height, original_filename, extension, file_size, mimetype };
          }),
        );
        console.error("preawait");
        await batch.commit({ onProgress: ({ current, total }) => setProgress(current / total) });
        console.error("postawait");
        console.error("items: ", JSON.stringify(items));

          let asset_ar = [];
        items.forEach((item) => {
            asset_ar.push({
              key: item.key,
              fileName: item.fileName,
              original_filename: item.original_filename,
              extension: item.extension,
              file_size: item.file_size,
              mimetype: item.mimetype,
            });
        });
        setAssets(asset_ar);
        setDisabledButs(false);
      } catch (e) {
        if (e.message.includes("Caller does not have Prepare permission")) {
          appAlert("You do not have the permission to add pictures, please ask the Admins");
        } else {
          throw e;
        }
      }
      setProgress(null);
    };
    input.click();
  };

  return (
    <>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}> <span className="padding10">{label}</span></Grid>
                <Grid item xs={6} > <button className={"App-upload"} onClick={uploadPhotos}> 📂 {t("UploadFiles")} </button> 
                {(uploadedFileName) ? uploadedFileName : "No file"}
      {show ?(
          <div key={`${asset_pfx}${asset.key}`} className={"App-image"}>
            <img src={`${asset_pfx}${asset.key}`} width={"500"} loading={"lazy"} />
          </div>
        ) : null }
      </Grid>
                {progress !== null && <div className={"App-progress"}>{Math.round(progress * 100)}%</div>}
            </Grid>

    </>
  );
};
