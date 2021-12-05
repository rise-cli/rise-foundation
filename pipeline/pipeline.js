module.exports = {
    name: 'rise-foundation-pipeline',
    stages: [
        {
            name: 'source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'source',
                    repo: 'rise-foundation',
                    owner: 'rise-cli',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'Test',
            actions: [
                {
                    type: 'INVOKE',
                    name: 'DeployTestInfra',
                    functionName: 'risefoundationtests-createTestInfra-dev',
                    region: 'us-east-1'
                },
                {
                    type: 'INVOKE',
                    name: 'TestS3',
                    functionName: 'risefoundationtests-testS3-dev',
                    region: 'us-east-1'
                },
                {
                    type: 'INVOKE',
                    name: 'TestDB',
                    functionName: 'risefoundationtests-testDb-dev',
                    region: 'us-east-1'
                }
            ]
        }
    ]
}
