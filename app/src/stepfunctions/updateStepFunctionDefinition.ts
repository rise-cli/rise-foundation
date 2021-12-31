const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || 'us-east-1'
const stepfunctions = new AWS.StepFunctions({
    region: region
})

export type UpdateStepFunctionDefinitionInput = {
    arn: string
    definition: string
}

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html#updateStateMachine-property

export async function updateStepFunctionDefinition({
    arn,
    definition
}: UpdateStepFunctionDefinitionInput) {
    const params = {
        stateMachineArn: arn /* required */,
        definition: definition

        // roleArn: 'STRING_VALUE',
        // tracingConfiguration: {
        //     enabled: true || false
        // }
    }

    const res = await stepfunctions.updateStateMachine(params).promise()
    return res
}
