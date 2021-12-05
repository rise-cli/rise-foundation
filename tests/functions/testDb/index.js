const foundation = require('/opt/node_modules/rise-foundation')
const db = foundation.default.db
process.env.TABLE = 'RiseFoundationIntegrationTestTable'

module.exports.handler = async (event, context) => {
    try {
        /**
         * Testing Set
         *
         */
        const item = await db.set({
            pk: 'user_1234',
            sk: 'item_1234',
            pk2: 'team_1234',
            pk3: 'org_1234'
        })

        if (
            item.pk !== 'user_1234' ||
            item.sk !== 'item_1234' ||
            item.pk2 !== 'team_1234' ||
            item.pk3 !== 'org_1234'
        ) {
            console.log(item)
            throw new Error('Set Error')
        }

        await db.set({
            pk: 'user_1235',
            sk: 'item_1235',
            pk2: 'team_1234',
            pk3: 'org_1234'
        })
        await db.set({
            pk: 'user_1236',
            sk: 'item_1236',
            pk2: 'team_1235',
            pk3: 'org_1234'
        })

        /**
         * Testing Get
         *
         */
        const getItem = await db.get({
            pk: 'user_1234',
            sk: 'item_1234'
        })

        if (
            getItem.pk !== 'user_1234' ||
            getItem.sk !== 'item_1234' ||
            getItem.pk2 !== 'team_1234' ||
            getItem.pk3 !== 'org_1234'
        ) {
            console.log(getItem)
            throw new Error('Get Error')
        }

        /**
         * Testing List
         *
         */
        const listItem = await db.list({
            pk: 'user_1234',
            sk: 'item_'
        })
        if (
            listItem[0].pk !== 'user_1234' ||
            listItem[0].sk !== 'item_1234' ||
            listItem[0].pk2 !== 'team_1234' ||
            listItem[0].pk3 !== 'org_1234'
        ) {
            console.log(listItem)
            throw new Error('List1 Error')
        }

        const listItem2 = await db.list({
            pk2: 'team_1234',
            sk: 'item_'
        })

        if (listItem2.length !== 2) {
            throw new Error('Error')
        }
        const listItem3 = await db.list({
            pk3: 'org_1234',
            sk: 'item_'
        })

        if (listItem3.length !== 3) {
            throw new Error('Error')
        }

        await foundation.default.codestar.putJobSuccess({
            event,
            context
        })

        return 2
    } catch (e) {
        console.log(e.message)
        await foundation.default.codestar.putJobFailure({
            event,
            context,
            message: e.message
        })
    }
}
