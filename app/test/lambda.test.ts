import { makeLambda } from '../src/lambda/cf/makeLambda'
import { deployStack } from '../src/cloudformation/deployStack'
import { getCloudFormationOutputs } from '../src/cloudformation/getOutputs'
import uploadFile from '../src/s3/upload_file'
import aws from 'aws-sdk'
const { readFile } = require('fs-extra')

const lambda = new aws.Lambda({
    region: 'us-east-1'
})

const STACK_BASE_NAME = 'RiseFoundationTestBase'
const STACK_NAME = 'RiseFoundationTestLambda'
test('cf.makeLambda CloudFormation is valid', async () => {
    /**
     * Get bucket name
     */
    const { Bucket } = await getCloudFormationOutputs({
        stack: STACK_BASE_NAME,
        outputs: ['Bucket']
    })

    /**
     * Upload example lambda function code
     */
    const file = await readFile('test/utils/code.zip')

    await uploadFile({
        file,
        bucket: Bucket,
        key: 'code/lambda.zip'
    })

    /**
     * Test makeLambda deployment
     */
    const x = makeLambda({
        appName: 'risefoundationtest',
        name: 'lambda',
        stage: 'dev',
        bucketArn: 'arn:aws:s3:::' + Bucket,
        bucketKey: 'code/lambda.zip',
        permissions: []
    })

    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    expect(res.status).toBe('nothing')

    /**
     * Test that deployed lambda function works
     */
    const executionResult = await lambda
        .invoke({
            FunctionName: 'risefoundationtest-lambda-dev'
        })
        .promise()

    expect(executionResult.Payload).toBe('2')
})
