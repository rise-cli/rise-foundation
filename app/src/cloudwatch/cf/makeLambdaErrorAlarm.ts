interface AlarmInput {
    name: string
    description: string
    functionName: string
    threshold: number
    period?: number
    evaluationPeriods?: number
}

export function makeLambdaErrorAlarm(config: AlarmInput) {
    return {
        Resources: {
            [config.name + 'Alarm']: {
                Type: 'AWS::CloudWatch::Alarm',
                Properties: {
                    AlarmName: config.name,
                    AlarmDescription: config.description,
                    MetricName: 'Errors',
                    Namespace: 'AWS/Lambda',
                    Dimensions: [
                        {
                            Name: 'FunctionName',
                            Value: config.functionName
                        }
                    ],
                    Statistic: 'Sum',
                    Period: config.period || 60,
                    EvaluationPeriods: config.evaluationPeriods || 1,
                    Threshold: config.threshold,
                    ComparisonOperator: 'GreaterThanThreshold'
                }
            }
        },
        Outputs: {}
    }
}
