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
                    name: 'DeployBase',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestBase',
                    template: 'app/infrastructure/baseStack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployDB',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestDB',
                    template: 'app/infrastructure/dbStack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployS3',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestS3',
                    template: 'app/infrastructure/s3Stack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployCognito',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestCognito',
                    template: 'app/infrastructure/cognitoStack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployApi',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestApi',
                    template: 'app/infrastructure/apiStack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployLambda',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestLambda',
                    template: 'app/infrastructure/lambdaStack.json'
                },
                {
                    type: 'DEPLOY',
                    name: 'DeployStepFunction',
                    inputArtifact: 'sourceZip',
                    stackName: 'RiseFoundationTestStepFunction',
                    template: 'app/infrastructure/stepFunctionStack.json'
                },
                {
                    type: 'BUILD',
                    name: 'RunTests',
                    script: '/test.yml',
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'testZip'
                }
            ]
        },
        {
            name: 'Prod',
            actions: [
                {
                    type: 'BUILD',
                    name: 'PublishToNpm',
                    script: '/publish.yml',
                    env: {
                        NPM_TOKEN: '@secret.NPM_KEY'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'publishedZip'
                },
                {
                    type: 'VERCEL',
                    name: 'DeployDocs',
                    prod: true,
                    path: './docs',
                    token: '@secret.VERCEL_TOKEN'
                }
            ]
        }
    ]
}
