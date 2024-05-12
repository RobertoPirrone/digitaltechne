from diagrams import Cluster, Diagram
from diagrams.programming.flowchart import Database
from diagrams.programming.language import Rust
from diagrams.programming.framework import React
from diagrams.aws.storage import S3
from diagrams.onprem.network import Internet
from diagrams.gcp.security import KeyManagementService
from diagrams.custom import Custom

graph_attr = {
    "bgcolor": "transparent"
}

with Diagram("DigitalTechne Service", graph_attr=graph_attr, outformat="png"):

    internet = Internet("Internet") 

    with Cluster(" "):
        # ic = Custom("Internet Computer", "./ic.png")
        # alpha: magick ic.png  -transparent white  ic_alpha.png
        ic = Custom("Internet Computer", "./ic_alpha.png")

        fe = React("Frontend") 

        with Cluster(" "):
            fe >> Rust("Backend") >> Database("operas,\n documents, ..."),
            fe >> KeyManagementService("Internet Identity"),
            fe >> S3("Asset Canister")

    internet >> fe 
