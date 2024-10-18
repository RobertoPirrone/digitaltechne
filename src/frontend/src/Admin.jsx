import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { appAlert, fillIconField } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
//import { MyCheckIcon, MostSubmitButton } from "./components/MostComponents";
import { MostDataGrid } from "./components/MostDataGrid";

const hasRole = () => {
    return true;
};

/**
 * Show User Capabilities
 */
export const Admin = () => {
    const { backendActor, principal } = useAuth();
    const userInfo = "pippo";
    const { t } = useTranslation();
    const navigate = useNavigate();
    const AdminRole = hasRole("Admin", userInfo);
    const LaboratoryRole = hasRole("Laboratory", userInfo);
    const OwnerRole = hasRole("Owner", userInfo);
    const UserRole = hasRole("User", userInfo);
    const [rbacs, setRbacs] = useState({});
    let columns = [];

    columns.push({ flex: 1, field: "friendly_name", headerName: t("friendly_name") });
    columns.push(fillIconField("add_dna_ok", t("add_dna_ok")));
    columns.push(fillIconField("associate_dna_ok", t("associate_dna_ok")));
    columns.push(fillIconField("add_opera_ok", t("add_opera_ok")));
    columns.push(fillIconField("view_opera_ok", t("view_opera_ok")));
    columns.push(fillIconField("admin_ok", t("admin_ok")));
    columns.push({ flex: 1, field: "id", 
        headerName: t("button"),
        renderCell: (params) => {
            return (
               <Button
                onClick={() => {
                    navigate("/change_rbac", { state: { row: params.row }, replace: true });
                }}
                color="primary"
                autoFocus>
                {t("Modify")}
            </Button>
        )
        }
    });

    useEffect(() => {
        if (backendActor === null) {
            console.log("Admin, backendActor null");
            return;
        }
        if (backendActor === "") {
            console.log("Admin, backendActor empty");
            return;
        }
        if (backendActor === "2vxsx-fae") {
            console.log("Admin, backendActor 2vxsx-fae");
            return;
        }
        console.log("Admin, backendActor: ", backendActor);
        backendActor
            .rbac_query()
            .then((Ret_data) => {
                console.log("rbac_query returns: ", Ret_data);
                if ("Ok" in Ret_data) {
                console.log("rbac_query Ok: ", Ret_data.Ok);
                    let parsed = JSON.parse(Ret_data.Ok);
                    console.log("Admin check_caller rbacs: ");
                    console.log( parsed.rbacs);
                    setRbacs(parsed.rbacs);
                } else {
                    const err = Ret_data.Err;
                    console.log("Admin check_caller Err response: ", err);
                    console.error(err);
                    // appAlert(err.CanisterError.message);

                }
            })
            .catch((error) => {
                console.error(error);
                alert(error.message ? error.message : JSON.stringify(error));
            });
    }, [backendActor, navigate]);

    return (
        <div className="app-container">
            <Header />
            <div className="content-container">
                <Container component="main" maxWidth="md">
                    <h1> {t("AdminWelcome")} {userInfo.name} {userInfo.surname} </h1>
                    <MostDataGrid columns={columns} rows={rbacs} />
                </Container>
            </div>
            <Footer />
        </div>
    );
};
