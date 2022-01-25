import { deployStack } from '../src/cloudformation/deployStack'
import { makeLambdaEndpoint } from '../src/apiGateway/cf/makeLambdaEndpoint'
import { makeInlineLambda } from '../src/lambda/cf/makeInlineLambda'
import axios from 'axios'
import aws from 'aws-sdk'

const STACK_NAME = 'RiseFoundationTestApi'
const SECOND = 1000
jest.setTimeout(SECOND * 60)

const cloudformation = new aws.CloudFormation({
    region: 'us-east-1'
})

async function getOutputs(props: { stack: string; outputs: string[] }) {
    function getOutput(outputs: any[], value: string) {
        const v = outputs.find((x) => x.OutputKey === value)
        return v ? v.OutputValue : false
    }

    const params = {
        StackName: props.stack
    }

    const x: any = await cloudformation.describeStacks(params).promise()
    const details = x.Stacks[0]
    const outputs = details.Outputs

    let res: any = {}
    for (const o of props.outputs) {
        res[o] = getOutput(outputs, o)
    }
    return res
}

test('cf.makeLambdaEndpoint CloudFormation is valid', async () => {
    /**
     * Make CF Tempalte
     */
    const api = makeLambdaEndpoint({
        endpointName: 'testEndpoint',
        lambdaName: 'Lambdabluedev',
        stage: 'dev',
        path: 'api'
    })

    const lambda = makeInlineLambda({
        appName: 'red',
        name: 'blue',
        stage: 'dev',
        permissions: [],
        code: `module.exports.handler = async () => {
        return {
            statusCode: 200,
            body: JSON.stringify({ status: "ok"})
        }
    }`
    })
    const template = {
        Resources: {
            ...api.Resources,
            ...lambda.Resources
        },
        Outputs: {
            ...api.Outputs,
            ...lambda.Outputs
        }
    }

    /**
     * Confirm the template deploys and is what we expect
     */
    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(template)
    })

    expect(res.status).toBe('nothing')

    /**
     * Hit endpoint with lambda and confirm we get something back
     */
    const { Endpoint } = await getOutputs({
        stack: STACK_NAME,
        outputs: ['Endpoint']
    })

    const response = await axios.post(Endpoint + '/api', {})
    expect(response.data.status).toBe('ok')
})
