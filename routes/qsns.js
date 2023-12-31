const express = require('express')
const session = require("express-session")
const router = express.Router()

const bitsModel = require("../models/bits")

const getBitPack = (testCategory, testLevel) => {
    return bitsModel.find({
        category: testCategory,
        level: testLevel
    }).then(result => {
        if (result && result.length > 0) {
            return result
        } else {
            return null
        }
    }).catch(e => {
        console.error("error in qsn.js server")
    })
}

router.route("/")
    .get((req, res) => {
        if (req?.session?.testCategory && req?.session?.testLevel) {
            res.redirect(`/users/qsns.html?testCategory=${req.session.testCategory}&testLevel=${req.session.testLevel}`)
        } else {
            res.redirect("/users/main")
        }
    })
    .post((req, res) => {
        getBitPack(req.body?.testCategory, req.body?.testLevel)
            .then(bitPack => {
                if (bitPack === null) {
                    res.status(404).json({ status: false, redirect: "/users/main.html" })
                } else {
                    res.status(200).json({ status: true, bitPack: bitPack, redirect: "/users/qsns.html" })
                }
            })
    })

module.exports = router