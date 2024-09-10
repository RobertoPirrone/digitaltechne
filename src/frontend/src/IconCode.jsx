import React from 'react';
import * as Icons from '@mui/icons-material';
import Link from "@mui/material/Link";
import { canisterId } from "../../declarations/uploads";

// routine generica di visualizzazione icona/immagine. Quindi gestisce sia campi di Dossier che di Documents
// gestisce icone dei documenti in base a mime type
// permette download/ visualizzazione del documento associato in nuovo tab
export const IconCode = (r) => {

    let mui_icon = false;
    const isLocal = !window.location.host.endsWith("icp0.io");
    let asset_pfx = `https://${canisterId}.icp0.io`;
    if (isLocal) {
      asset_pfx = `http://${canisterId}.localhost:4943`;
    }

    const IconResolver = ({ iconName, ...props }) => {
      const IconComponent = Icons[iconName];

      if (!IconComponent) {
        console.error(`Icon "${iconName}" not found`);
        return null; // You can return a default icon or an empty element here
      }

      return <IconComponent {...props} />;
    };

    let row = r.row;
    // console.log("IconCode: ", JSON.stringify(row));
    let image = row.icon_uri;
    let width = "400";
    // usata per i documenti occorre aggiustare due cose
    if ('image_uri' in row) {
        image = row.image_uri;
        width = "100%";
    }
    let file_uri = `${asset_pfx}${image}`;
    let real_icon = file_uri;
    let isVideo = row.isVideo;

    // solo per le i documenti (che hanno mimetpe), scelgo l'icona giusta
    if ( 'mimetype' in row && ! row.mimetype.includes("image/" ))  {
        console.log(row.mimetype);
        switch (row.mimetype) {
            case "application/pdf": mui_icon = "PictureAsPdf"; break;

            case "application/vnd.ms-excel": 
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 
            case "application/vnd.oasis.opendocument.spreadsheet": 
                mui_icon = "PictureAsPdf"; break;

            case "application/msword": 
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 
            case "application/vnd.oasis.opendocument.text": 
                mui_icon = "PictureAsPdf"; break;

            case "application/vnd.ms-powerpoint": 
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation": 
            case "application/vnd.oasis.opendocument.presentation": 
                mui_icon = "PictureAsPdf"; break;

            default: mui_icon = "FileDownload";
        }
    } ;

    return (
      <Link
        href={ file_uri }
        target="_blank"
        className="nodecoration allCellLink"
      >
      <div key={real_icon} className={"App-image"}>
        {isVideo ? (
          <video controls autoPlay width="400">
            <source src={`${asset_pfx}${dossierInfo.icon_uri}`} type="video/mp4" />
          </video>
        ) : ( mui_icon ? (
            <IconResolver iconName={mui_icon} fontSize="large" />
        ) : (
            <img src={real_icon} width={width} loading={"lazy"} />
        )
        )}

      </div>
      </Link>
    )
}


