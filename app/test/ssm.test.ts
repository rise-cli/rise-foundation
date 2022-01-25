import { getParameter } from '../src/ssm/getParameter'
import { setParameter } from '../src/ssm/setParameter'
import { removeParameter } from '../src/ssm/removeParameter'

test('ssm works', async () => {
    const setResult = await setParameter({
        key: 'RiseIntegrationTest',
        value: '1234'
    })
    expect(setResult).toBe(true)

    const getResult = await getParameter({
        key: 'RiseIntegrationTest'
    })
    expect(getResult).toBe('1234')

    const removeResult = await removeParameter({
        key: 'RiseIntegrationTest'
    })
    expect(removeResult).toBe(true)
})
