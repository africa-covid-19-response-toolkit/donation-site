'use strict';

const AWS = require('aws-sdk');
const Joi = require('joi');

const { handleResponse, handleError, getPublicKey, createPaymentIntent, receiveWebHook } = require('../helpers');

// TODOAB: make it dynamic
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
})

const TABLE_NAME = 'userDataTable'


module.exports.userData = async (event, context, callback) => {
    const { requestContext: { path, httpMethod }, body } = event;
    let res
    switch (httpMethod) {
        case 'GET':
            res = await handleGet(body)
            callback(null, res)
        case 'POST':
            res = await handlePost(body)
            callback(null, res)
        default:
            callback(null, res)
    }

}


const handleGet = async () => {
    let res = {}

    try {
        const data = await docClient.scan({ TableName: TABLE_NAME }).promise()
        res.body = JSON.stringify(data, null, 2)
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        return res
    } catch(err) {
        res.body = JSON.stringify(err, null, 2)
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        return res
    }
}


const handlePost = async (body) => {
    const parsedBody = JSON.parse(body);
    let res = {}
    const model = Joi.object().keys({
        currency: Joi.string().required(),
        // amount: Joi.string().required(),
        // companyName: Joi.string().required(),
        // email: Joi.string().email().required(),
        // name: Joi.string(),
        // comment: Joi.string(),
    })
    const result = model.validate(parsedBody)

    if (result.error) {
        res.body = JSON.stringify({
            message: result,
        })
        return res
    }

    try {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                ...parsedBody
            }
        };
        const data = await docClient.put(params).promise()
        res.body = JSON.stringify(data, null, 2)
        console.log("Added item:", JSON.stringify(data, null, 2));
        return res
    } catch(err) {
        res.body = JSON.stringify(err, null, 2)
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        return res
    }
}

