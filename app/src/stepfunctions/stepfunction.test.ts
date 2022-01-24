import { makeStepFunction } from './cf/makeStepFunction'
import { deployStack } from '../cloudformation/deployStack'

const STACK_NAME = 'RiseFoundationTestStepFunction'

test('cf.makeStepFunction CloudFormation is valid', async () => {
    const x = makeStepFunction({
        appName: 'blue',
        name: 'red',
        stage: 'dev',
        definition: `{
            "Comment": "A description of my state machine",
            "StartAt": "Pass",
            "States": {
                "Pass": {
                    "Type": "Pass",
                    "Next": "Pass 2"
                },
                "Pass 2": {
                    "Type": "Pass",
                    "End": true
                }
            }
        }`,
        permissions: [
            {
                Action: '*',
                Resource: '*',
                Effect: 'Allow'
            }
        ]
    })

    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    expect(res.status).toBe('nothing')
})
