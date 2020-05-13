class PayUResponse {
    constructor(){
        this._PayUR = this.getEmptyResponse();
    }

    getEmptyResponse () {
        var payUResponse = {
            code : 'SUCCESS',
            error : '',
            transactionResponse : {
                orderId : 848951203,
                transactionId : '',
                state : 'APPROVED',
                paymentNetworkResponseCode : '',
                paymentNetworkResponseErrorMessage : '',
                trazabilityCode : '',
                authorizationCode : '00000000',
                pendingReason : '',
                responseCode : 'APPROVED',
                errorCode : '',
                responseMessage : '',
                transactionDate : '',
                transactionTime : '',
                operationDate : '',
                referenceQuestionnaire : '',
                
                extraParameters : {
                    PAYMENT_WAY_ID : '4',
                    BANK_REFERENCED_CODE : 'CREDIBANCO'
                },
                
                additionalInfo : {
                    paymentNetwork : '',
                    rejectionType : '',
                    responseNetworkMessage : '',
                    travelAgencyAuthorizationCode : '',
                    cardType : '',
                    transactionType : 'AUTHORIZATION_AND_CAPTURE'
                }
            }
        }
    }
}

module.exports = PayUResponse