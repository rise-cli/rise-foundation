module.exports = {
    name: 'rise-foundation-pipeline',
    stages: [
        {
            name: 'Source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'GithubRepo',
                    repo: 'rise-foundation',
                    owner: 'rise-cli',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'Staging',
            actions: [
                {
                    type: 'DEPLOY',
                    name: 'DeployTestResources',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestStack',
                    template: 'app/infrastrcture/integrationTestStack.yml'
                }
            ]
        }
        // {
        //     name: 'Test',
        //     actions: [
        //         {
        //             type: 'INVOKE',
        //             name: 'DeployTestInfra',
        //             functionName: 'risefoundationtests-createTestInfra-dev',
        //             region: 'us-east-1'
        //         },
        //         {
        //             type: 'INVOKE',
        //             name: 'TestS3',
        //             functionName: 'risefoundationtests-testS3-dev',
        //             region: 'us-east-1'
        //         },
        //         {
        //             type: 'INVOKE',
        //             name: 'TestDB',
        //             functionName: 'risefoundationtests-testDb-dev',
        //             region: 'us-east-1'
        //         }
        //     ]
        // }
        // {
        //     name: 'Prod',
        //     actions: [
        //         {
        //             type: 'BUILD',
        //             name: 'PublishToNpm',
        //             script: '/publish.yml',
        //             env: {
        //                 NPM_TOKEN: '@secret.NPM_KEY'
        //             },
        //             inputArtifact: 'sourceZip',
        //             outputArtifact: 'publishedZip'
        //         },
        //         {
        //             type: 'VERCEL',
        //             name: 'DeployDocs',
        //             path: './docs',
        //             token: '@secret.VERCEL_TOKEN'
        //         }
        //     ]
        // }
    ]
}
