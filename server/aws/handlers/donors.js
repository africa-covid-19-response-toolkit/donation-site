'use strict';

const AWS = require('aws-sdk');
const Joi = require('joi');
const { v5 } = require('uuid');

const dynamoDBParams = { region: process.env.AWS_REGION };
if (process.env.IS_OFFLINE) {
    dynamoDBParams.endpoint = process.env.DYNAMODB_LOCAL_URL;
}
const docClient = new AWS.DynamoDB.DocumentClient(dynamoDBParams);
const TABLE_NAME = process.env.DYNAMODB_TABLE;
const UUID_NAMESPACE = '7516f1bf-7a20-4768-8e91-23bbcc4ece8b';


module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const { requestContext: { httpMethod }, body } = event;
    switch (httpMethod) {
        case 'GET':
            return handleGet(body)
        case 'POST':
            return handlePost(body)
        default:
            return { body: null, statusCode: 501 }
    }
}


const handleGet = async () => {
    let res = {}

    try {
        const data = await docClient.scan({ TableName: TABLE_NAME }).promise()
        res.body = JSON.stringify(data.Items, null, 2)
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        return res
    } catch (err) {
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
        amount: Joi.number().required(),
        companyName: Joi.string().required(),
        email: Joi.string().email().required(),
        name: Joi.string(),
        comment: Joi.string(),
    })
    const result = model.validate(parsedBody)

    if (result.error) {
        res.body = JSON.stringify({
            error: true,
            message: result,
        })
        return res
    }

    try {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                id: v5(parsedBody.email, UUID_NAMESPACE),
                ...parsedBody
            },
            ConditionExpression: 'attribute_not_exists(id)'
        };

        await docClient.put(params).promise()
        res = {
            body: JSON.stringify({ ...params.Item }, null, 2),
            statusCode: 201
        }
        return res
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            res = {
                body: JSON.stringify({
                    error: true,
                    message: 'Duplicate donor'
                }, null, 2),
                statusCode: 400
            }
            return res
        }
        res= {
            body: JSON.stringify(err, null, 2),
            statusCode: 502
        }
        console.error("Unable to add item. Error JSON:", err);
        return res
    }
}

