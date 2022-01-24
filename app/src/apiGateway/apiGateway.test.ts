import { deployStack } from '../cloudformation/deployStack'
import { makeLambdaeEndpoint } from './cf/makeLambdaEndpoint'
import { makeInlineLambda } from '../lambda/cf/makeInlineLambda'

const STACK_NAME = 'RiseFoundationTestApi'
const SECOND = 1000
jest.setTimeout(SECOND * 60)

test('cf.makeBucket CloudFormation is valid', async () => {
    const api = makeLambdaeEndpoint({
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
        code: `module.exports = async () => {
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

    console.log(JSON.stringify(template, null, 2))

    // const res = await deployStack({
    //     name: STACK_NAME,
    //     template: JSON.stringify(template)
    // })

    // expect(res.status).toBe('nothing')
})
