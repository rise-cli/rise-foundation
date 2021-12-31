import { makeDashboard } from './makeDashboard'

const mock = {
    widgets: [
        {
            type: 'text',
            x: 0,
            y: 0,
            width: 6,
            height: 6,
            properties: {
                markdown: '# makePayment\nDescription of function...'
            }
        },
        {
            type: 'metric',
            x: 6,
            y: 0,
            width: 6,
            height: 6,
            properties: {
                metrics: [
                    [
                        'AWS/Lambda',
                        'Invocations',
                        'FunctionName',
                        'coffeecore-makePayment-dev'
                    ]
                ],
                view: 'timeSeries',
                stacked: false,
                region: 'us-east-1',
                period: 300,
                annotations: {
                    horizontal: [
                        {
                            color: '#2ca02c',
                            label: 'Goal',
                            value: 10
                        },
                        {
                            color: '#62728',
                            label: 'Alarm',
                            value: 0
                        }
                    ]
                },
                stat: 'Sum',
                title: 'Traffic'
            }
        },
        {
            type: 'metric',
            x: 12,
            y: 0,
            width: 6,
            height: 6,
            properties: {
                metrics: [
                    [
                        'AWS/Lambda',
                        'Errors',
                        'FunctionName',
                        'coffeecore-makePayment-dev'
                    ]
                ],
                view: 'timeSeries',
                stacked: false,
                region: 'us-east-1',
                annotations: {
                    horizontal: [
                        {
                            color: '#62728',
                            label: 'Alarm',
                            value: 2
                        }
                    ]
                },
                period: 300,
                stat: 'Sum',
                title: 'Availability (Errors)'
            }
        },
        {
            type: 'metric',
            x: 18,
            y: 0,
            width: 6,
            height: 6,
            properties: {
                metrics: [
                    [
                        'AWS/Lambda',
                        'Duration',
                        'FunctionName',
                        'coffeecore-makePayment-dev'
                    ]
                ],
                view: 'timeSeries',
                stacked: false,
                region: 'us-east-1',
                annotations: {
                    horizontal: [
                        {
                            color: '#2ca02c',
                            label: 'Goal',
                            value: 1000
                        },
                        {
                            color: '#62728',
                            label: 'Alarm',
                            value: 20000
                        }
                    ]
                },
                period: 300,
                stat: 'p99',
                title: 'Latency (duration)'
            }
        }
    ]
}

test('makeDashboard will work', () => {
    const res = makeDashboard({
        name: 'mydashboard',
        rows: [
            {
                type: 'LAMBDAROW',
                verticalPosition: 0,
                name: 'myfunction',
                region: 'us-east-1',
                functionName: 'coffeecore-makePayment-dev',
                docs: '# makePayment\nDescription of function...',
                invocationAlarm: 0,
                invocationGoal: 10,
                errorAlarm: 2,
                durationAlarm: 20000,
                durationGoal: 1000
            }
        ]
    })
    const result = JSON.parse(
        res.Resources['mydashboard' + 'Dashboard'].Properties.DashboardBody
    )

    const expected = mock

    expect(result).toEqual(expected)
})
