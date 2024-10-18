/**
 * Change Permissions to the user identified by the state property
 */
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { MostCheckbox, MostSelect, MostSubmitButton, MostTextField, MyAutocomplete, MyCheckbox, MyTextField } from "./components/MostComponents";

export const ChangeRbac = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['translation', 'rbac']);
    const { handleSubmit } = useForm();
    const { backendActor, principal } = useAuth();
    const react_router_location = useLocation();
    const user_row = react_router_location.state.row;
    console.log("ChangeRbac user_row ", user_row);
    const [admin_ok, setAdmin_ok] = useState(user_row.admin_ok);
    const [view_opera_ok, setView_opera_ok] = useState(user_row.view_opera_ok);
    const [add_opera_ok, setAdd_opera_ok] = useState(user_row.add_opera_ok);
    const [add_dna_ok, setAdd_dna_ok] = useState(user_row.add_dna_ok);
    const [dna_mark_ok, setDna_mark_ok] = useState(user_row.dna_mark_ok);

    useEffect(() => {
        console.log("ChangeRbac useEffect");
    }, [t]);

    const onSubmit = (vals) => {
        console.log("onSubmit: ");
        vals.admin_ok = admin_ok;
        vals.view_opera_ok = view_opera_ok;
        vals.add_opera_ok = add_opera_ok;
        vals.add_dna_ok = add_dna_ok;
        vals.dna_mark_ok = dna_mark_ok;
        vals.id = user_row.id;
        vals.principal = user_row.principal;
        console.log(vals);
        backendActor
            .change_rbac(JSON.stringify(vals))
            .then((Ok_data) => {
                appAlert(t("Permissions are updated"));
                navigate("/admin");
            })
            .catch((error) => {
                appAlert(error.message ? error.message : JSON.stringify(error));
            });
    };

    return (
        <>
            <Header />
            <Typography variant="h3">{t("rbac:ChangeRbac")}</Typography>
            <Container maxWidth="sm">
                <Typography variant="h5">
                    {t("rbac:ChangingRbac")} {user_row.friendly_name}{" "}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={admin_ok} onChange={(e, v) => setAdmin_ok(e.target.checked)} />} label={t("rbac:admin_ok")} />
                        <FormControlLabel control={<Switch checked={view_opera_ok} onChange={(e, v) => setView_opera_ok(e.target.checked)} />} label={t("rbac:view_opera_ok")} />
                        <FormControlLabel control={<Switch checked={add_opera_ok} onChange={(e, v) => setAdd_opera_ok(e.target.checked)} />} label={t("rbac:add_opera_ok")} />
                        <FormControlLabel control={<Switch checked={add_dna_ok} onChange={(e, v) => setAdd_dna_ok(e.target.checked)} />} label={t("rbac:add_dna_ok")} />
                        <FormControlLabel control={<Switch checked={dna_mark_ok} onChange={(e, v) => setDna_mark_ok(e.target.checked)} />} label={t("rbac:dna_mark_ok")} />
                    </FormGroup>

                    <MostSubmitButton label={t("Modify")} />
                </form>
            </Container>
            <Footer />
        </>
    );
};
