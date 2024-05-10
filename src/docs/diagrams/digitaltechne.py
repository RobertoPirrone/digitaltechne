from diagrams import Cluster, Diagram
from diagrams.programming.flowchart import Database
from diagrams.programming.language import Rust
from diagrams.programming.framework import React
from diagrams.aws.storage import S3
from diagrams.onprem.network import Internet
from diagrams.gcp.security import KeyManagementService

graph_attr = {
    "bgcolor": "transparent"
}

with Diagram("DigitalTechne Service", graph_attr=graph_attr, outformat="png"):

    internet = Internet("Internet") 

    with Cluster("Internet Computer"):
        fe = React("Frontend") 

        with Cluster(" "):
            fe >> Rust("Backend") >> Database("operas,\n documents, ..."),
            fe >> KeyManagementService("Internet Identity"),
            fe >> S3("Asset Canister")

    internet >> fe 
