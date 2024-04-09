import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Riservato = (props) => {
    const { t } = useTranslation()
    let reserved = false
    if (typeof props.reserved === "string") {
        if(props.reserved === "true")
            reserved = true
    } else if (typeof props.reserved === "boolean") {
        if(props.reserved)
            reserved = true
    } else {
        return (<span> props.reserved: unknown type</span>)
    }
    if(reserved)
        return (
            <span className="riservato">{" "}{t("(riservato)")}</span>
        )
    return null
}

export const bexplorerLink = (address,transactionHash,returnHref) => {
    let href
    if(address) {
        address = address.toLowerCase() 
        if (process.env.REACT_APP_BCID === "3333") 
            href = "/address/"
        else
            href = "/account/"
        href = process.env.REACT_APP_BEXPLORER+href+address
    } else {
        if(!transactionHash)
            return null
        transactionHash = transactionHash.toLowerCase()
        if (process.env.REACT_APP_BCID === "3333")
            href = "/tx/"
        else
            href = "/transaction/"
        href = process.env.REACT_APP_BEXPLORER+href+transactionHash
    }
    if (returnHref)
        return href
    return " <a href='"+href+"' target='blockExplorer' rel='noreferrer'>Block Explorer</a>"
  }     

export const BexplorerLink = (props) => {
    console.log("BexplorerLink",props)
    const href = bexplorerLink(props.address,props.tx_hash,1)
    if(!href)
        return null
    return <a href ={href} target='blockExplorer' rel='noreferrer'>Block Explorer</a>
}

export const GoToHomePage = () => {
    console.error("GoToHomePage")
    const navigate = useNavigate();
    setTimeout(() => {
        navigate("/home")
    },100)
    return <div />
}

