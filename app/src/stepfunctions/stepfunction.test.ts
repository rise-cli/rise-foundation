import { makeStepFunction } from './cf/makeStepFunction'
import { updateStepFunctionDefinition } from './updateStepFunctionDefinition'
import { deployStack } from '../cloudformation/deployStack'
import aws from 'aws-sdk'

const STACK_NAME = 'RiseFoundationTestStepFunction'

const sf = new aws.StepFunctions({
    region: 'us-east-1'
})

const sts = new aws.STS({
    region: 'us-east-1'
})

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

    const { Account } = await sts.getCallerIdentity().promise()

    const result = await sf
        .startExecution({
            stateMachineArn: `arn:aws:states:us-east-1:${Account}:stateMachine:bluereddev`
        })
        .promise()

    expect(result.startDate).toBeTruthy()

    /**
     * Update Step Function
     *
     */
    const updateResult = await updateStepFunctionDefinition({
        arn: `arn:aws:states:us-east-1:${Account}:stateMachine:bluereddev`,
        definition: `{
            "Comment": "A description of my state machine",
            "StartAt": "Pass",
            "States": {
                "Pass": {
                    "Type": "Pass",
                    "Next": "Pass 3"
                },
                "Pass 3": {
                    "Type": "Pass",
                    "End": true
                }
            }
        }`
    })

    expect(updateResult.updateDate).toBeTruthy()

    /**
     * Revert to original for next step
     */
    await updateStepFunctionDefinition({
        arn: `arn:aws:states:us-east-1:${Account}:stateMachine:bluereddev`,
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
        }`
    })
})
