'use strict';

const { handleResponse, handleError,  getPublicKey, createPaymentIntent, receiveWebHook }  = require('../helpers');

module.exports.stripe =  async (event, context, callback) => {

    const {requestContext: { path, httpMethod}, body } = event;

    switch (httpMethod) {
        case 'GET':
            if(path.indexOf('public-key') !== -1) {
                const response = getPublicKey();
                handleResponse(callback, response , 200);
            }

        case 'POST':
            if(path.indexOf('create-payment-intent') !== -1) {      
                try {  
                    const data = JSON.parse(body);           
                    const response = await createPaymentIntent(data);
                    handleResponse(callback, response , 200);
                } catch (error) {
                    handleError(callback, '', error);
                }
            }

            if(path.indexOf('webhook') !== -1) {
                const response = {from:  'webhook'}        
                handleResponse(callback, response , 200);
            }
            
        default: 
            handleResponse(callback, {from : 'Unknown'} , 200);
            break;
        
    }
    
}

