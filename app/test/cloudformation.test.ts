import { deployStack } from '../src/cloudformation/deployStack'
import { getDeployStatus } from '../src/cloudformation/getDeployStatus'
import { getCloudFormationOutputs } from '../src/cloudformation/getOutputs'
import fs from 'fs'

const STACK_NAME = 'RiseFoundationTestDB'
const STACK_WITH_OUTPUT_NAME = 'RiseFoundationTestApi'
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

test('getCloudFormationOutputs will work', async () => {
    const x = await getCloudFormationOutputs({
        stack: STACK_WITH_OUTPUT_NAME,
        outputs: ['Endpoint']
    })

    expect(x.Endpoint).toBeTruthy()
})
