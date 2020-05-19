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
        res.body = JSON.stringify(data.Items)
        console.log("GetItem succeeded:", JSON.stringify(data));
        return res
    } catch (err) {
        console.log('handleGet Err', err);
        return {
            body: JSON.stringify(err),
            statusCode: 502
        }
    }
}


const handlePost = async (body) => {
    const parsedBody = JSON.parse(body);
    const model = Joi.object().keys({
        currency: Joi.string().required(),
        amount: Joi.number().required(),
        companyName: Joi.string().required(),
        email: Joi.string().email().required(),
        name: Joi.string(),
        comment: Joi.string(),
        anonymousDonation: Joi.boolean()
    })
    const result = model.validate(parsedBody)

    if (result.error) {
        return {
            body: JSON.stringify({
                error: true,
                message: result,
            }),
            statusCode: 400
        }
    }

    try {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                ...parsedBody,
                id: v5(parsedBody.email, UUID_NAMESPACE),
                createdAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(id)'
        };

        await docClient.put(params).promise()
        return {
            body: JSON.stringify({ ...params.Item }),
            statusCode: 201
        }
    } catch (err) {
        console.error("Unable to add item. Error JSON:", err);
        if (err.name === 'ConditionalCheckFailedException') {
            return {
                body: JSON.stringify({
                    error: true,
                    message: 'Duplicate donor'
                }),
                statusCode: 400
            }
        }

        return {
            body: JSON.stringify(err),
            statusCode: 502
        }
    }
}

