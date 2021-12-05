module.exports = {
    permissions: [
        {
            Action: 's3:*',
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
