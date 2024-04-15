import React, { useState, useEffect, useCallback } from "react";
import {Ed25519KeyIdentity} from '@dfinity/identity';
import {HttpAgent} from '@dfinity/agent';
import {AssetManager} from '@dfinity/assets';

export const Upload = (props ) => {
    let asset = props.asset;
    console.log("Upload: ", JSON.stringify(props));
    let setAsset = props.setAsset;
    let setDisabledButs = props.setDisabledButs;
// Hardcoded principal: 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe
// Should be replaced with authentication method e.g. Internet Identity when deployed on IC
const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({length: 32}).fill(0)));
const isLocal = !window.location.host.endsWith('ic0.app');
    const [progress, setProgress] = useState(null);

            if (false) {
        const agent = new HttpAgent({
            host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app', identity,
        });
        if (isLocal) {
            agent.fetchRootKey();
        }
        }

// Canister id can be fetched from URL since frontend in this example is hosted in the same canister as file upload
// const canisterId = new URLSearchParams(window.location.search).get('canisterId') ?? /(.*?)(?:\.raw)?\.ic0.app/.exec(window.location.host)?.[1] ?? /(.*)\.localhost/.exec(window.location.host)?.[1];
// const canisterId = process.env.CANISTER_ID_ASSETS;
const canisterId = 'br5f7-7uaaa-aaaaa-qaaca-cai';
const asset_pfx = `http://${canisterId}.localhost:4943`;

// Create asset manager instance for above asset canister
// const assetManager = new AssetManager({canisterId, agent});
const agent = new HttpAgent({
    host: isLocal ? `http://127.0.0.1:4943` : 'https://ic0.app', identity,
});
const assetManager = new AssetManager({canisterId, agent});
if (isLocal) {
    agent.fetchRootKey();
}

// Get file name, width and height from key
const detailsFromKey = (key) => {
    const fileName = key.split('/').slice(-1)[0];
    const width = parseInt(fileName.split('.').slice(-3)[0]);
    const height = parseInt(fileName.split('.').slice(-2)[0]);
    return {key, fileName, width, height}
}

// Get file name, width and height from file
const detailsFromFile = async (file) => {
    const src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    })
    const [width, height] = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
        img.src = src;
    })
    const name = file.name.split('.');
    const extension = name.pop();
    const fileName = [name, width, height, extension].join('.');
    console.error("detailsFromFile: ", JSON.stringify(file.name));
    const original_filename = file.name;
    const file_size = 10240;
    const mimetype = "image/jpeg";
    // return {fileName, width, height}
    return {fileName, width, height, original_filename, extension, file_size, mimetype}
}

const uploadPhotos = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async () => {
            setProgress(0);
            try {
                const upload_items = await assetManager.list();
                const batch = assetManager.batch();
                const items = await Promise.all(Array.from(input.files).map(async (file) => {
                    const {fileName, width, height, original_filename, extension, file_size, mimetype} = await detailsFromFile(file);
                    const key = await batch.store(file, {path: '/uploads', fileName});
                    return {key, fileName, width, height, original_filename, extension, file_size, mimetype};
                }));
                console.error("preawait");
                await batch.commit({onProgress: ({current, total}) => setProgress(current / total)});
                console.error("postawait");
                console.error("items: ", JSON.stringify(items));
                let item = items[0];
                setAsset({
                    "key": item.key,
                    "fileName": item.fileName,
                    "original_filename": item.original_filename,
                    "extension": item.extension,
                    "file_size": item.file_size,
                    "mimetype": item.mimetype
                });
                setDisabledButs(false);
            } catch (e) {
                if (e.message.includes('Caller is not authorized')) {
                    alert("Caller is not authorized, follow Authorization instructions in README");
                } else {
                    throw e;
                }
            }
            setProgress(null)
        };
        input.click();
    }

    return (
        <>
        <button className={'App-upload'} onClick={uploadPhotos}>📂 Upload photo</button>
        <div key={`${asset_pfx}${asset.key}`} className={'App-image'} >
            <img src={`${asset_pfx}${asset.key}`} width= {'100%'}  loading={'lazy'}/>
        </div>
        {progress !== null && <div className={'App-progress'}>{Math.round(progress * 100)}%</div>}
        </>
    )
}
