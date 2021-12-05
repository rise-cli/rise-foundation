const foundation = require('/opt/node_modules/rise-foundation')

module.exports.handler = async (event, context) => {
    try {
        const db = foundation.default.db.cf.makeDb(
            'RiseFoundationIntegrationTestTable'
        )
        const s3 = foundation.default.s3.cf.makeSimpleBucket('test')

        const cognito = foundation.default.cognito.cf.makeCognitoPoolAndClient(
            'RiseFoundationIntegrationTest'
        )

        const template = {
            Resources: {
                ...db.Resources,
                ...s3.Resources,
                ...cognito.Resources
            },
            Outputs: {
                ...db.Outputs,
                ...s3.Outputs,
                ...cognito.Outputs
            }
        }

        await foundation.default.cloudformation.deployStack({
            name: 'risefoundationinttestsstack',
            template: JSON.stringify(template)
        })

        await foundation.default.cloudformation.getDeployStatus({
            config: {
                stackName: 'risefoundationinttestsstack',
                minRetryInterval: 5000,
                maxRetryInterval: 10000,
                backoffRate: 1.1,
                maxRetries: 200,
                onCheck: () => {
                    //console.log(JSON.stringify(resources, null, 2))
                }
            }
        })

        await foundation.default.codestar.putJobSuccess({
            event,
            context
        })

        // console.log(JSON.stringify(template, null, 2))

        return 2
    } catch (e) {
        await foundation.default.codestar.putJobFailure({
            event,
            context,
            message: e.message
        })
    }
}
