import { getKeyword } from '../src/keywords'

const STACK_NAME = 'RiseFoundationTestBase'
const STACK_OUTPUT = 'Bucket'
const PARAM = 'FOUNDATION_TEST'

test('keywords will get outputs, ssm, and accountIds', async () => {
    let state = {
        '@region': 'us-east-1'
    }
    const keyword = `BucketName: {@output.${STACK_NAME}.${STACK_OUTPUT}}`
    const res = await getKeyword(state, keyword)
    expect(res.result).toBe('BucketName: risefoundationtestbase-risefoundationtestresource-1oyazk301hbrk')

    const keyword2 = `MyUser-{@ssm.${PARAM}}`
    const res2 = await getKeyword(state, keyword2)
    expect(res2.result).toBe('MyUser-TEST')

    const keyword3 = `arn:{@accountId}:123`
    const res3 = await getKeyword(state, keyword3)
    expect(res3.result).toBe('arn:251256923172:123')
    expect(res3.state).toEqual({
        '@stage': 'dev',
        '@region': 'us-east-1',
        '@output.RiseFoundationTestBase.Bucket': 'risefoundationtestbase-risefoundationtestresource-1oyazk301hbrk',
        '@ssm.FOUNDATION_TEST': 'TEST',
        '@accountId': '251256923172'
    })
})
