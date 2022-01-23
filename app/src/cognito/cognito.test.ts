import { createUser } from './createUser'
import { removeUser } from './removeUser'
import { loginUser } from './loginUser'
import { loginHandleNewPassword } from './loginHandleNewPassword'
import { validateToken } from './validateJwtToken'
import { resetPassword } from './resetPassword'
import { refreshTokens } from './loginRefreshToken'
import aws from 'aws-sdk'
import { makeCognitoPoolAndClient } from './cf/makeCognitoPoolAndClient'

const SECOND = 1000
jest.setTimeout(SECOND * 60)

const cloudformation = new aws.CloudFormation({
    region: 'us-east-1'
})

async function getCognitoIds(props: { stack: string; outputs: string[] }) {
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

test('cf.makeCognitoPoolAndClient CloudFormation is valid', async () => {
    const x = makeCognitoPoolAndClient('my-test-cognito')
    const res: any = await cloudformation
        .validateTemplate({
            TemplateBody: JSON.stringify(x)
        })
        .promise()

    expect(res.ResponseMetadata.RequestId).toBeTruthy()
})

test('cognito user management works', async () => {
    const { CognitoUserPoolId, CognitoUserPoolClientId } = await getCognitoIds({
        stack: 'RiseFoundationTestStack',
        outputs: ['CognitoUserPoolId', 'CognitoUserPoolClientId']
    })

    const poolId = CognitoUserPoolId
    const clientId = CognitoUserPoolClientId

    /**
     * Create User
     *
     */
    const res = await createUser({
        email: 'garysjennings@gmail.com',
        userPoolId: poolId
    })

    expect(res.email).toBe('garysjennings@gmail.com')
    expect(typeof res.password).toBe('string')

    /**
     * Login with Temp Password
     *
     */
    const loginRes = await loginUser({
        userName: 'garysjennings@gmail.com',
        password: res.password,
        userPoolId: poolId,
        clientId: clientId
    })

    // @ts-ignore
    expect(loginRes.challenge).toBe('NEW_PASSWORD')
    // @ts-ignore
    expect(typeof loginRes.session).toBe('string')

    /**
     * Handle new Password
     *
     */
    const tokens = await loginHandleNewPassword({
        // @ts-ignore
        session: loginRes.session,
        userName: 'garysjennings@gmail.com',
        newPassword: res.password,
        userPoolId: poolId,
        clientId: clientId
    })

    expect(typeof tokens.accessToken).toBe('string')
    expect(typeof tokens.refreshToken).toBe('string')
    expect(typeof tokens.idToken).toBe('string')

    /**
     * Validate Token
     *
     */
    const validateRes = await validateToken({
        token: tokens.accessToken,
        userPoolId: poolId
    })
    expect(validateRes.userName).toBe('garysjennings@gmail.com')
    expect(typeof validateRes.clientId).toBe('string')
    expect(validateRes.isValid).toBe(true)

    /**
     * Reset Password
     *
     */
    const resetRes = await resetPassword({
        email: 'garysjennings@gmail.com',
        userPoolId: poolId
    })

    const resetLoginRes = await loginUser({
        userName: 'garysjennings@gmail.com',
        password: resetRes.password,
        userPoolId: poolId,
        clientId: clientId
    })

    // @ts-ignore
    expect(resetLoginRes.challenge).toBe('NEW_PASSWORD')

    /**
     * Remove User
     *
     */
    const res2 = await removeUser({
        email: 'garysjennings@gmail.com',
        userPoolId: poolId
    })

    expect(res2).toBe(true)
})
