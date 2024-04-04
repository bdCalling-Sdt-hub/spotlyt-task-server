const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { tasksService } = require("../services");
const { Service } = require("../models");
const crypto = require('crypto');
const axios = require('axios');





const generateSignature = (data, passPhrase) => {
    let pfOutput = dataToString(data);
    if (passPhrase !== null) {
        pfOutput += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }
    return crypto.createHash("md5").update(pfOutput).digest("hex");
};

const dataToString = (data) => {
    let pfParamString = "";
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            pfParamString += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
        }
    }
    return pfParamString.slice(0, -1);
};

const getPaymentId = async (paymentData) => {
    const result = await axios.post('https://www.payfast.co.za/onsite/process', paymentData);
    return result.data;
}


const processPayment = catchAsync(async (req, res) => {
    const { merchantId, merchantKey, emailAddress, amount, itemName } = req.body;
    const phrase = "youknow1Ksdfksdj";
    console.log(req.body);

    const paymentData = {
        merchant_id: merchantId,
        merchant_key: merchantKey,
        email_address: emailAddress,
        amount: amount,
        item_name: itemName
    };

    const signature = generateSignature(paymentData, phrase);
    paymentData.signature = signature;

    try {
        const paymentId = await getPaymentId(paymentData);
        // console.log(paymentId);
        res.json({ paymentId });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});


module.exports = {
    processPayment
};
