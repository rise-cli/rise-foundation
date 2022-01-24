import { getParameter } from './getParameter'
import { setParameter } from './setParameter'
import { removeParameter } from './removeParameter'

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
