module.exports = {
    permissions: [
        {
            Action: 'cloudformation:*',
            Resource: '*'
        },
        {
            Action: 's3:*',
            Resource: '*'
        },
        {
            Action: 'dynamodb:*',
            Resource: '*'
        },
        {
            Action: 'cognito-idp:*',
            Resource: '*'
        },
        {
            Action: [
                'codepipeline:PutJobFailureResult',
                'codepipeline:PutJobSuccessResult'
            ],
            Resource: '*'
        }
    ],
    env: {},
    timeout: 900,
    layers: ['arn:aws:lambda:us-east-1:251256923172:layer:foundation:2']
}
