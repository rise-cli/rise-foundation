import { createUser } from '../src/cognito/createUser'
import { removeUser } from '../src/cognito/removeUser'
import { loginUser } from '../src/cognito/loginUser'
import { loginHandleNewPassword } from '../src/cognito/loginHandleNewPassword'
import { validateToken } from '../src/cognito/validateJwtToken'
import { resetPassword } from '../src/cognito/resetPassword'
import { refreshTokens } from '../src/cognito/loginRefreshToken'
import aws from 'aws-sdk'
import { makeCognitoPoolAndClient } from '../src/cognito/cf/makeCognitoPoolAndClient'
import { deployStack } from '../src/cloudformation/deployStack'

const STACK_NAME = 'RiseFoundationTestCognito'
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
    const x = makeCognitoPoolAndClient('mytestcognito')

    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    expect(res.status).toBe('nothing')
})

test('cognito user management works', async () => {
    const { UserPoolId, UserPoolClientId } = await getCognitoIds({
        stack: STACK_NAME,
        outputs: ['UserPoolId', 'UserPoolClientId']
    })

    const poolId = UserPoolId
    const clientId = UserPoolClientId

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
