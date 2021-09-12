import { getDbItem, listDbItems, setDbItem, removeDbItem } from './db'
import { testUtils } from './_tests/testUtils'
process.env.TABLE = 'RiseFoundationIntegrationTestTable'

test('db works', async () => {
    try {
        await testUtils.createTable()
    } catch (e) {
        console.log('Table already exists')
    }

    /**
     * Testing Set
     *
     */
    const item = await setDbItem({
        PK: 'user_1234',
        SK: 'item_1234',
        GSI1: 'team_1234',
        GSI2: 'org_1234'
    })

    expect(item).toEqual({
        PK: 'user_1234',
        SK: 'item_1234',
        GSI1: 'team_1234',
        GSI2: 'org_1234'
    })

    await setDbItem({
        PK: 'user_1235',
        SK: 'item_1235',
        GSI1: 'team_1234',
        GSI2: 'org_1234'
    })
    await setDbItem({
        PK: 'user_1236',
        SK: 'item_1236',
        GSI1: 'team_1235',
        GSI2: 'org_1234'
    })

    /**
     * Testing Get
     *
     */
    const getItem = await getDbItem({
        PK: 'user_1234',
        SK: 'item_1234'
    })

    expect(getItem).toEqual({
        GSI2: 'org_1234',
        SK: 'item_1234',
        GSI1: 'team_1234',
        PK: 'user_1234'
    })

    /**
     * Testing List
     *
     */
    const listItem = await listDbItems({
        PK: 'user_1234',
        SK: 'item_'
    })

    expect(listItem).toEqual([
        {
            GSI2: 'org_1234',
            SK: 'item_1234',
            GSI1: 'team_1234',
            PK: 'user_1234'
        }
    ])

    const listItem2 = await listDbItems({
        GSI1: 'team_1234',
        SK: 'item_'
    })

    expect(listItem2).toEqual([
        {
            GSI2: 'org_1234',
            SK: 'item_1234',
            GSI1: 'team_1234',
            PK: 'user_1234'
        },
        {
            GSI2: 'org_1234',
            SK: 'item_1235',
            GSI1: 'team_1234',
            PK: 'user_1235'
        }
    ])

    const listItem3 = await listDbItems({
        GSI2: 'org_1234',
        SK: 'item_'
    })

    expect(listItem3).toEqual([
        {
            GSI2: 'org_1234',
            SK: 'item_1234',
            GSI1: 'team_1234',
            PK: 'user_1234'
        },
        {
            GSI2: 'org_1234',
            SK: 'item_1235',
            GSI1: 'team_1234',
            PK: 'user_1235'
        },
        {
            GSI2: 'org_1234',
            SK: 'item_1236',
            GSI1: 'team_1235',
            PK: 'user_1236'
        }
    ])

    /**
     * Testing Remove
     *
     */
    const removedItem = await removeDbItem({
        PK: 'user_1234',
        SK: 'item_1234'
    })

    await removeDbItem({
        PK: 'user_1235',
        SK: 'item_1235'
    })

    await removeDbItem({
        PK: 'user_1236',
        SK: 'item_1236'
    })

    expect(removedItem).toEqual({ PK: 'user_1234', SK: 'item_1234' })

    /**
     * Testing Get Empty
     *
     */
    const noItem = await getDbItem({
        PK: 'user_1234',
        SK: 'item_1234'
    })

    expect(noItem).toEqual(false)

    /**
     * Testing @id
     *
     */
    const idTestItem = await setDbItem({
        PK: 'user_1235',
        SK: 'item_@id'
    })

    await removeDbItem(idTestItem)
})

test('db pagination works', async () => {
    const item = await setDbItem({
        PK: 'team_1234',
        SK: 'item_1234'
    })

    const item2 = await setDbItem({
        PK: 'team_1234',
        SK: 'item_1235'
    })

    const item3 = await setDbItem({
        PK: 'team_1234',
        SK: 'item_1236'
    })

    const item4 = await setDbItem({
        PK: 'team_1234',
        SK: 'item_1237'
    })

    const list1 = await listDbItems({
        PK: 'team_1234',
        SK: 'item',
        limit: 2
    })

    expect(list1).toEqual([
        { PK: 'team_1234', SK: 'item_1234' },
        { PK: 'team_1234', SK: 'item_1235' }
    ])

    const list2 = await listDbItems({
        PK: 'team_1234',
        SK: 'item',
        limit: 2,
        startAt: list1[1]
    })

    expect(list2).toEqual([
        { PK: 'team_1234', SK: 'item_1236' },
        { PK: 'team_1234', SK: 'item_1237' }
    ])

    await removeDbItem(item)
    await removeDbItem(item2)
    await removeDbItem(item3)
    await removeDbItem(item4)
})
