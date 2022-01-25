import { getDbItem, listDbItems, setDbItem, removeDbItem } from '../src/db/db'
import { makeDb } from '../src/db/cf/makeDb'
import { deployStack } from '../src/cloudformation/deployStack'

const STACK_NAME = 'RiseFoundationTestDB'
const SECOND = 1000

jest.setTimeout(SECOND * 60)
process.env.TABLE = 'mytestdb'

test('cf.makeDb creates Cloudformation correctly', async () => {
    const x = makeDb('mytestdb')
    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(x)
    })

    expect(res.status).toBe('nothing')
})

test('db works', async () => {
    /**
     * Testing Set
     *
     */
    const item = await setDbItem({
        pk: 'user_1234',
        sk: 'item_1234',
        pk2: 'team_1234',
        pk3: 'org_1234'
    })

    expect(item).toEqual({
        pk: 'user_1234',
        sk: 'item_1234',
        pk2: 'team_1234',
        pk3: 'org_1234'
    })

    await setDbItem({
        pk: 'user_1235',
        sk: 'item_1235',
        pk2: 'team_1234',
        pk3: 'org_1234'
    })
    await setDbItem({
        pk: 'user_1236',
        sk: 'item_1236',
        pk2: 'team_1235',
        pk3: 'org_1234'
    })

    /**
     * Testing Get
     *
     */
    const getItem = await getDbItem({
        pk: 'user_1234',
        sk: 'item_1234'
    })

    expect(getItem).toEqual({
        pk3: 'org_1234',
        sk: 'item_1234',
        pk2: 'team_1234',
        pk: 'user_1234'
    })

    /**
     * Testing List
     *
     */
    const listItem = await listDbItems({
        pk: 'user_1234',
        sk: 'item_'
    })

    expect(listItem).toEqual([
        {
            pk3: 'org_1234',
            sk: 'item_1234',
            pk2: 'team_1234',
            pk: 'user_1234'
        }
    ])

    const listItem2 = await listDbItems({
        pk2: 'team_1234',
        sk: 'item_'
    })

    expect(listItem2).toEqual([
        {
            pk3: 'org_1234',
            sk: 'item_1234',
            pk2: 'team_1234',
            pk: 'user_1234'
        },
        {
            pk3: 'org_1234',
            sk: 'item_1235',
            pk2: 'team_1234',
            pk: 'user_1235'
        }
    ])

    const listItem3 = await listDbItems({
        pk3: 'org_1234',
        sk: 'item_'
    })

    expect(listItem3).toEqual([
        {
            pk3: 'org_1234',
            sk: 'item_1234',
            pk2: 'team_1234',
            pk: 'user_1234'
        },
        {
            pk3: 'org_1234',
            sk: 'item_1235',
            pk2: 'team_1234',
            pk: 'user_1235'
        },
        {
            pk3: 'org_1234',
            sk: 'item_1236',
            pk2: 'team_1235',
            pk: 'user_1236'
        }
    ])

    /**
     * Testing Remove
     *
     */
    const removedItem = await removeDbItem({
        pk: 'user_1234',
        sk: 'item_1234'
    })

    await removeDbItem({
        pk: 'user_1235',
        sk: 'item_1235'
    })

    await removeDbItem({
        pk: 'user_1236',
        sk: 'item_1236'
    })

    expect(removedItem).toEqual({ pk: 'user_1234', sk: 'item_1234' })

    /**
     * Testing Get Empty
     *
     */
    const noItem = await getDbItem({
        pk: 'user_1234',
        sk: 'item_1234'
    })

    expect(noItem).toEqual(false)

    /**
     * Testing @id
     *
     */
    const idTestItem = await setDbItem({
        pk: 'user_1235',
        sk: 'item_@id'
    })

    await removeDbItem(idTestItem)
})

test('db pagination works', async () => {
    const item = await setDbItem({
        pk: 'team_1234',
        sk: 'item_1234'
    })

    const item2 = await setDbItem({
        pk: 'team_1234',
        sk: 'item_1235'
    })

    const item3 = await setDbItem({
        pk: 'team_1234',
        sk: 'item_1236'
    })

    const item4 = await setDbItem({
        pk: 'team_1234',
        sk: 'item_1237'
    })

    const list1 = await listDbItems({
        pk: 'team_1234',
        sk: 'item',
        limit: 2
    })

    expect(list1).toEqual([
        { pk: 'team_1234', sk: 'item_1234' },
        { pk: 'team_1234', sk: 'item_1235' }
    ])

    const list2 = await listDbItems({
        pk: 'team_1234',
        sk: 'item',
        limit: 2,
        startAt: list1[1]
    })

    expect(list2).toEqual([
        { pk: 'team_1234', sk: 'item_1236' },
        { pk: 'team_1234', sk: 'item_1237' }
    ])

    await removeDbItem(item)
    await removeDbItem(item2)
    await removeDbItem(item3)
    await removeDbItem(item4)
})
