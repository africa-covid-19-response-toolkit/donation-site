'use strict';

const AWS = require('aws-sdk');
const Joi = require('joi');

const { handleResponse, handleError, getPublicKey, createPaymentIntent, receiveWebHook } = require('../helpers');

// TODOAB: make it dynamic
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
})


module.exports.userData = async (event, context, callback) => {
    const { requestContext: { path, httpMethod }, body } = event;
    switch (httpMethod) {
        case 'GET':
            const res = await handleGet(body)
            callback(null, res)
        case 'POST':
            const res = await handlePost(body)
            callback(null, res)
    }

}


const handleGet = async (body) => {
    let res = {}
    docClient.get({ TableName: 'userData' }, function (err, data) {
        if (err) {
            res.body = JSON.stringify(err, null, 2)
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.body = JSON.stringify(data, null, 2)
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });

    return res
}


const handlePost = async (body) => {
    let res = {}
    const model = Joi.object().keys({
        currency: Joi.string().required(),
        amount: Joi.string().required(),
        companyName: Joi.string().required(),
        email: Joi.string().email().required(),
        name: Joi.string(),
        comment: Joi.string(),
    })
    const result = model.validate(body)

    if (result.error) {
        callback(null, JSON.stringify({
            message: result,
        }));
        return;
    }

    const params = {
        TableName: 'userData',
        Item: {
            ...body
        }
    };

    docClient.put(params, function (err, data) {
        if (err) {
            res.body = JSON.stringify(err, null, 2)
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.body = JSON.stringify(data, null, 2)
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });

    return res
}

