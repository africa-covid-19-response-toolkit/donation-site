#Local dev

Uses serverless-offline + serverless-dynamodb-local

`yarn dev` to run it all locally 


# User data model
## To add data (POST)
```
/dev/donors
{
    currency: Joi.string().required(),
    amount: Joi.string().required(),
    companyName: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string(),
    comment: Joi.string(),
}
```

## To retrieve data (GET)
```
/dev/donors
[
    {
        id: Joi.string(),
        createdAt: Joi.string(),
        currency: Joi.string().required(),
        amount: Joi.string().required(),
        companyName: Joi.string().required(),
        email: Joi.string().email().required(),
        name: Joi.string(),
        comment: Joi.string(),
    }
]
```