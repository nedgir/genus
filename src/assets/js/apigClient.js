/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: 'zJIpb7gVb94ljQ6FCX4K4BHr3sOXPtC18VWoK9Nf',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }


    // extract endpoint and path from url
    var invokeUrl = 'https://api.genusconnect.com/v1';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);



    apigClient.communityChatGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var communityChatGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/chat').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(communityChatGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityChatPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityChatPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/chat').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityChatPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityChatOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityChatOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/chat').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityChatOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityChatIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityChatIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/chat/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityChatIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityChatIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var communityChatIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/community/chat/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityChatIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityChatIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityChatIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/community/chat/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityChatIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityChatIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityChatIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/chat/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityChatIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityCommunityGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'guid'], ['body']);

        var communityCommunityGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/community').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'guid']),
            body: body
        };


        return apiGatewayClient.makeRequest(communityCommunityGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityCommunityPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityCommunityPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/community').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityCommunityPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityCommunityOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityCommunityOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/community').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityCommunityOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityCommunityIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityCommunityIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/community/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityCommunityIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityCommunityIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var communityCommunityIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/community/community/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityCommunityIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityCommunityIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityCommunityIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/community/community/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityCommunityIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityCommunityIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityCommunityIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/community/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityCommunityIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityEventGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var communityEventGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(communityEventGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityEventPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityEventPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityEventPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityEventOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityEventOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/event').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityEventOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityEventIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityEventIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/event/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityEventIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityEventIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var communityEventIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/community/event/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityEventIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityEventIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityEventIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/community/event/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityEventIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityEventIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityEventIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/event/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityEventIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityInviteGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['inviteCode'], ['body']);

        var communityInviteGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/invite').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['inviteCode']),
            body: body
        };


        return apiGatewayClient.makeRequest(communityInviteGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityInvitePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityInvitePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/invite').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityInvitePostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityInviteOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityInviteOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/invite').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityInviteOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityInviteIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityInviteIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/invite/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityInviteIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityInviteIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var communityInviteIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/community/invite/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityInviteIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityInviteIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityInviteIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/community/invite/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityInviteIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityInviteIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityInviteIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/invite/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityInviteIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityLoadorcreateuserPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityLoadorcreateuserPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/loadorcreateuser').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityLoadorcreateuserPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityLoadorcreateuserOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityLoadorcreateuserOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/loadorcreateuser').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityLoadorcreateuserOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityModifymodulesPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityModifymodulesPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/modifymodules').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityModifymodulesPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityModifymodulesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityModifymodulesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/modifymodules').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityModifymodulesOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var communityObservationGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityObservationPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityObservationOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityObservationIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var communityObservationIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityObservationIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityObservationIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationCategoryGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var communityObservationCategoryGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation_category').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationCategoryGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationCategoryPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityObservationCategoryPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation_category').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationCategoryPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationCategoryOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityObservationCategoryOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation_category').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationCategoryOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationCategoryIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityObservationCategoryIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation_category/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationCategoryIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationCategoryIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var communityObservationCategoryIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation_category/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationCategoryIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationCategoryIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityObservationCategoryIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation_category/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationCategoryIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityObservationCategoryIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityObservationCategoryIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/observation_category/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityObservationCategoryIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityUserGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'cognitoId'], ['body']);

        var communityUserGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'cognitoId']),
            body: body
        };


        return apiGatewayClient.makeRequest(communityUserGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityUserPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var communityUserPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/community/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityUserPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityUserOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityUserOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityUserOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityUserIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityUserIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/community/user/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityUserIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityUserIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var communityUserIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/community/user/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityUserIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityUserIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var communityUserIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/community/user/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityUserIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.communityUserIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var communityUserIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/community/user/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(communityUserIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.feedbackFeedbackGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'guid'], ['body']);

        var feedbackFeedbackGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/feedback/feedback').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'guid']),
            body: body
        };


        return apiGatewayClient.makeRequest(feedbackFeedbackGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.feedbackFeedbackPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var feedbackFeedbackPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/feedback/feedback').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(feedbackFeedbackPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.feedbackFeedbackOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var feedbackFeedbackOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/feedback/feedback').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(feedbackFeedbackOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.feedbackFeedbackIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var feedbackFeedbackIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/feedback/feedback/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(feedbackFeedbackIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.feedbackFeedbackIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var feedbackFeedbackIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/feedback/feedback/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(feedbackFeedbackIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.feedbackFeedbackIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var feedbackFeedbackIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/feedback/feedback/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(feedbackFeedbackIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.feedbackFeedbackIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var feedbackFeedbackIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/feedback/feedback/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(feedbackFeedbackIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthAllergyGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthAllergyGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/allergy').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthAllergyGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthAllergyPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthAllergyPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/allergy').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthAllergyPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthAllergyIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthAllergyIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/allergy/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthAllergyIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthAllergyIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthAllergyIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/allergy/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthAllergyIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthAllergyIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthAllergyIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/allergy/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthAllergyIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDataentryGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthDataentryGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/dataentry').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDataentryGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDataentryPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthDataentryPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/dataentry').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDataentryPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDataentryIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthDataentryIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/dataentry/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDataentryIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDataentryIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthDataentryIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/dataentry/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDataentryIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDataentryIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthDataentryIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/dataentry/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDataentryIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthDoctorGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctor').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthDoctorPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctor').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthDoctorIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctor/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthDoctorIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctor/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthDoctorIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctor/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorvisitGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthDoctorvisitGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctorvisit').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorvisitGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorvisitPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthDoctorvisitPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctorvisit').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorvisitPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorvisitIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthDoctorvisitIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctorvisit/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorvisitIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorvisitIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthDoctorvisitIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctorvisit/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorvisitIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthDoctorvisitIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthDoctorvisitIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/doctorvisit/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthDoctorvisitIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthFamilyhistoryGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthFamilyhistoryGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/familyhistory').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthFamilyhistoryGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthFamilyhistoryPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthFamilyhistoryPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/familyhistory').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthFamilyhistoryPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthFamilyhistoryIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthFamilyhistoryIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/familyhistory/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthFamilyhistoryIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthFamilyhistoryIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthFamilyhistoryIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/familyhistory/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthFamilyhistoryIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthFamilyhistoryIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthFamilyhistoryIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/familyhistory/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthFamilyhistoryIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthHospitalvisitGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthHospitalvisitGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/hospitalvisit').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthHospitalvisitGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthHospitalvisitPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthHospitalvisitPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/hospitalvisit').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthHospitalvisitPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthHospitalvisitIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthHospitalvisitIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/hospitalvisit/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthHospitalvisitIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthHospitalvisitIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthHospitalvisitIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/hospitalvisit/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthHospitalvisitIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthHospitalvisitIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthHospitalvisitIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/hospitalvisit/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthHospitalvisitIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthInsuranceGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthInsuranceGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/insurance').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthInsuranceGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthInsurancePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthInsurancePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/insurance').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthInsurancePostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthInsuranceIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthInsuranceIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/insurance/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthInsuranceIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthInsuranceIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthInsuranceIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/insurance/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthInsuranceIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthInsuranceIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthInsuranceIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/insurance/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthInsuranceIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalconditionGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthMedicalconditionGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalcondition').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalconditionGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalconditionPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthMedicalconditionPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalcondition').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalconditionPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalconditionIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicalconditionIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalcondition/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalconditionIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalconditionIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthMedicalconditionIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalcondition/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalconditionIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalconditionIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicalconditionIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalcondition/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalconditionIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldevicesGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthMedicaldevicesGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldevices').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldevicesGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldevicesPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthMedicaldevicesPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldevices').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldevicesPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldevicesIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicaldevicesIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldevices/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldevicesIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldevicesIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthMedicaldevicesIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldevices/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldevicesIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldevicesIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicaldevicesIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldevices/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldevicesIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldocumentGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthMedicaldocumentGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldocument').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldocumentGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldocumentPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthMedicaldocumentPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldocument').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldocumentPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldocumentIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicaldocumentIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldocument/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldocumentIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldocumentIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthMedicaldocumentIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldocument/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldocumentIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicaldocumentIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicaldocumentIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicaldocument/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicaldocumentIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalreportGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthMedicalreportGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalreport').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalreportGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalreportPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthMedicalreportPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalreport').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalreportPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalreportIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicalreportIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalreport/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalreportIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalreportIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthMedicalreportIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalreport/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalreportIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicalreportIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicalreportIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medicalreport/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicalreportIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicationGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthMedicationGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medication').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicationGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicationPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthMedicationPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medication').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicationPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicationIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicationIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medication/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicationIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicationIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthMedicationIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medication/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicationIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMedicationIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMedicationIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/medication/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMedicationIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMissionstatusGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthMissionstatusGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/missionstatus').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMissionstatusGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMissionstatusPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthMissionstatusPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/missionstatus').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMissionstatusPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMissionstatusIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMissionstatusIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/missionstatus/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMissionstatusIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMissionstatusIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthMissionstatusIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/missionstatus/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMissionstatusIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthMissionstatusIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthMissionstatusIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/missionstatus/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthMissionstatusIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthPersonalinformationGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthPersonalinformationGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/personalinformation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthPersonalinformationGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthPersonalinformationPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthPersonalinformationPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/personalinformation').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthPersonalinformationPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthPersonalinformationIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthPersonalinformationIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/personalinformation/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthPersonalinformationIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthPersonalinformationIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthPersonalinformationIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/personalinformation/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthPersonalinformationIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthPersonalinformationIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthPersonalinformationIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/personalinformation/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthPersonalinformationIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthProfilecompletenessGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthProfilecompletenessGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/profilecompleteness').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthProfilecompletenessGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthProfilecompletenessPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthProfilecompletenessPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/profilecompleteness').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthProfilecompletenessPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthProfilecompletenessIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthProfilecompletenessIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/profilecompleteness/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthProfilecompletenessIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthProfilecompletenessIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthProfilecompletenessIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/profilecompleteness/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthProfilecompletenessIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthProfilecompletenessIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthProfilecompletenessIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/profilecompleteness/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthProfilecompletenessIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthSurgeryGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthSurgeryGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/surgery').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthSurgeryGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthSurgeryPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthSurgeryPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/surgery').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthSurgeryPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthSurgeryIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthSurgeryIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/surgery/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthSurgeryIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthSurgeryIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthSurgeryIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/surgery/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthSurgeryIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthSurgeryIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthSurgeryIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/surgery/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthSurgeryIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthTargetrangeGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var healthTargetrangeGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/targetrange').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(healthTargetrangeGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthTargetrangePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var healthTargetrangePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/health/targetrange').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthTargetrangePostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthTargetrangeIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthTargetrangeIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/health/targetrange/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthTargetrangeIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthTargetrangeIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var healthTargetrangeIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/health/targetrange/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthTargetrangeIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.healthTargetrangeIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var healthTargetrangeIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/health/targetrange/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(healthTargetrangeIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.initialGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var initialGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/initial').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(initialGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.initialOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var initialOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/initial').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(initialOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.latestPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var latestPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/latest').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(latestPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.latestOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var latestOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/latest').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(latestOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsFrameGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var momentsFrameGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/frame').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsFrameGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsFramePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var momentsFramePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/frame').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsFramePostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsFrameOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var momentsFrameOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/frame').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsFrameOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsFrameIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var momentsFrameIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/frame/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsFrameIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsFrameIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var momentsFrameIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/frame/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsFrameIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsFrameIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var momentsFrameIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/frame/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsFrameIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsMomentGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['lastUpdateTimestamp', 'communityId'], ['body']);

        var momentsMomentGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/moment').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['lastUpdateTimestamp', 'communityId']),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsMomentGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsMomentPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var momentsMomentPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/moment').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsMomentPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsMomentOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var momentsMomentOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/moment').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsMomentOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsMomentIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var momentsMomentIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/moment/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsMomentIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsMomentIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id', 'body'], ['body']);

        var momentsMomentIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/moment/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsMomentIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.momentsMomentIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var momentsMomentIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/moments/moment/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(momentsMomentIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.resourcesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var resourcesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/resources').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(resourcesOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.resourcesIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var resourcesIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/resources/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(resourcesIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.resourcesIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var resourcesIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/resources/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(resourcesIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.userCreateorloadPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);

        var userCreateorloadPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/user/createorload').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(userCreateorloadPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.userCreateorloadOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var userCreateorloadOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/user/createorload').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(userCreateorloadOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.userExistsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var userExistsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/user/exists').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(userExistsPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.userExistsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var userExistsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/user/exists').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(userExistsOptionsRequest, authType, additionalParams, config.apiKey);
    };


    return apigClient;
};
