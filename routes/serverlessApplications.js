const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')
const dt = require('node-json-transform').DataTransform
const models = require('../models/applications')
const metrics = require('../models/metrics')

global.Headers = fetch.Headers

// return all lambda services
router.get('/allServerlessApps',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://management.usgovcloudapi.net/subscriptions/07fefdba-84eb-4d6b-b398-ab8737a57f95/resourceGroups/lambdas/providers/Microsoft.Web/sites?api-version=2016-08-01", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.app).transform().sort((a, b) => a.name.localeCompare(b.name)))
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return all functions per lambda service
router.get('/allFunctions',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://management.usgovcloudapi.net/subscriptions/07fefdba-84eb-4d6b-b398-ab8737a57f95/resourceGroups/lambdas/providers/Microsoft.Web/sites/" + req.query.appName + "/functions?api-version=2016-08-01", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.func).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// requests on lambdas
router.get('/requests',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://management.usgovcloudapi.net/subscriptions/07fefdba-84eb-4d6b-b398-ab8737a57f95/resourceGroups/client-applications/providers/Microsoft.Web/sites/" + req.query.appName + "/metrics?$filter=name.value eq 'Requests'&api-version=2016-08-01", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, metrics.metric).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// 400 errors
router.get('/fourHundo',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://management.usgovcloudapi.net/subscriptions/07fefdba-84eb-4d6b-b398-ab8737a57f95/resourceGroups/client-applications/providers/Microsoft.Web/sites/" + req.query.appName + "/metrics?$filter=name.value eq 'Http4xx'&api-version=2016-08-01", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, metrics.metric).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// 500 errors
router.get('/fiveHundo',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://management.usgovcloudapi.net/subscriptions/07fefdba-84eb-4d6b-b398-ab8737a57f95/resourceGroups/client-applications/providers/Microsoft.Web/sites/" + req.query.appName + "/metrics?$filter=name.value eq 'Http5xx'&api-version=2016-08-01", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, metrics.metric).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

module.exports = router