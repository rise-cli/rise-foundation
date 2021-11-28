export type MakeLambdaInput = {
    appName: string
    name: string
    stage: String
    bucketArn: string
    dbName: string
    permissions: any[]
}

/* 
{
    Effect: 'Allow',
    Action: ['dynamodb:*'],
    Resource: [
        {
            'Fn::Sub': [
                'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/' +
                    props.dbName,
                {}
            ]
        }
    ]
}
*/

export function makeLambda(props: MakeLambdaInput) {
    const b = props.bucketArn.split(':::')[1]
    return {
        Resources: {
            /**
             * Log Group
             *
             */
            [`Lambda${props.name}${props.stage}LogGroup`]: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: `/aws/lambda/${props.appName}-${props.name}-${props.stage}`
                }
            },

            /**
             * Lambda Function
             *
             */
            [`Lambda${props.name}${props.stage}`]: {
                Type: 'AWS::Lambda::Function',
                Properties: {
                    Code: {
                        S3Bucket: b,
                        S3Key: `functions/${props.name}/lambda.zip`
                    },
                    FunctionName: `${props.appName}-${props.name}-${props.stage}`,
                    Handler: 'index.handler',
                    MemorySize: 1024,
                    Role: {
                        'Fn::GetAtt': [
                            `Lambda${props.name}${props.stage}Role`,
                            'Arn'
                        ]
                    },
                    Runtime: 'nodejs14.x',
                    Timeout: 6
                    // Environment: {
                    //     Variables: {
                    //         // ...future feature add
                    //     }
                    // }
                },
                DependsOn: [`Lambda${props.name}${props.stage}LogGroup`]
            },

            /**
             * Lambda Function Role
             *
             */
            [`Lambda${props.name}${props.stage}Role`]: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['lambda.amazonaws.com']
                                },
                                Action: ['sts:AssumeRole']
                            }
                        ]
                    },
                    Policies: [
                        {
                            PolicyName: `Lambda${props.appName}${props.name}${props.stage}RolePolicy`,
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: props.permissions
                            }
                        }
                    ],
                    Path: '/',
                    RoleName: `Lambda${props.appName}${props.name}${props.stage}Role`
                }
            }
        }
    }
}
