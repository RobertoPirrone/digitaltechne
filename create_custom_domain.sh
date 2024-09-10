# https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/using-custom-domains
curl -sL -X POST \
    -H 'Content-Type: application/json' \
    https://icp0.io/registrations \
    --data @- <<EOF
{
    "name": "ic.mostapps.it"
}
EOF


# {"id":"a2c91bacf87204c69c10209e38dd5e982888fe736fcfcd14bff47f6a47826678"}
