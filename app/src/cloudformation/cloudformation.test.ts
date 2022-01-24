import { deployStack } from './deployStack'
import { getDeployStatus } from './getDeployStatus'
import fs from 'fs'

const STACK_NAME = 'RiseFoundationTestDB'
const TEMPLATE_PATH = 'infrastructure/dbStack.json'
const SECOND = 1000
jest.setTimeout(SECOND * 60)

test('deployStack and getDployStatus work', async () => {
    /**
     * deployStack test
     */
    const template = fs.readFileSync(TEMPLATE_PATH, { encoding: 'utf-8' })
    const res = await deployStack({
        name: STACK_NAME,
        template
    })
    expect(res.status).toBe('nothing')

    /**
     * getDeployStatus test
     */
    let checking = 'onCheckIsNotCalled'
    const res2 = await getDeployStatus({
        config: {
            stackName: STACK_NAME,
            minRetryInterval: 1000,
            maxRetryInterval: 1000,
            backoffRate: 1,
            maxRetries: 3,
            onCheck: (x: any) => {
                checking = x
            }
        }
    })

    expect(res2.status).toBe('success')
    expect(checking).toBe('onCheckIsNotCalled')
})
