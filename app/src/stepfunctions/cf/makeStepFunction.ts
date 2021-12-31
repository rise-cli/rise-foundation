interface AlarmInput {
    appName: string
    name: string
    stage: String
    definition: string
    substitution: string
    permissions: any[]
}
//https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html

export function makeStepFunction(config: AlarmInput) {
    const basePermissions: any[] = [
        // {
        //     Action: ['logs:CreateLogStream'],
        //     Resource: [
        //         {
        //             'Fn::Sub': [
        //                 `arn:aws:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/${props.appName}-${props.name}-${props.stage}:*`,
        //                 {}
        //             ]
        //         }
        //     ],
        //     Effect: 'Allow'
        // },
        // {
        //     Action: ['logs:PutLogEvents'],
        //     Resource: [
        //         {
        //             'Fn::Sub': [
        //                 `arn:aws:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/${props.appName}-${props.name}-${props.stage}:*:*`,
        //                 {}
        //             ]
        //         }
        //     ],
        //     Effect: 'Allow'
        // }
    ]

    const permissions = [...basePermissions, ...config.permissions]

    return {
        Resources: {
            /**
             * Log Group
             *
             */
            [`Lambda${config.name}${config.stage}LogGroup`]: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: `/aws/lambda/${config.appName}-${config.name}-${config.stage}`
                }
            },

            /**
             * StepFunction
             *
             */
            [`StepFunction${config.name}${config.stage}`]: {
                Type: 'AWS::StepFunctions::StateMachine',
                Properties: {
                    // "Definition" : config.definition,
                    //  "DefinitionS3Location" : S3Location,
                    DefinitionString: config.definition,
                    DefinitionSubstitutions: config.substitution,
                    //LoggingConfiguration: LoggingConfiguration,
                    RoleArn: {
                        'Fn::GetAtt': [
                            `StepFunction${config.name}${config.stage}Role`,
                            'Arn'
                        ]
                    },

                    StateMachineName: config.name,
                    StateMachineType: 'STANDARD'

                    //TracingConfiguration: TracingConfiguration
                }
            },
            /**
             * Lambda Function Role
             *
             */
            [`StepFunction${config.name}${config.stage}Role`]: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['states.amazonaws.com']
                                },
                                Action: ['sts:AssumeRole']
                            }
                        ]
                    },
                    Policies: [
                        {
                            PolicyName: `StepFunction${config.appName}${config.name}${config.stage}RolePolicy`,
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: permissions
                            }
                        }
                    ],
                    Path: '/',
                    RoleName: `StepFunction${config.appName}${config.name}${config.stage}Role`
                }
            }
        },
        Outputs: {}
    }
}
