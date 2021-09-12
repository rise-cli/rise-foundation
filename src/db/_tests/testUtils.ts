const AWS = require('aws-sdk')
AWS.config = {
    region: 'us-east-1'
}
const db = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

export const testUtils = {
    createTable: async () => {
        await db
            .createTable({
                AttributeDefinitions: [
                    {
                        AttributeName: 'PK',
                        AttributeType: 'S'
                    },
                    {
                        AttributeName: 'SK',
                        AttributeType: 'S'
                    },
                    {
                        AttributeName: 'GSI1',
                        AttributeType: 'S'
                    },
                    {
                        AttributeName: 'GSI2',
                        AttributeType: 'S'
                    }
                ],
                KeySchema: [
                    {
                        AttributeName: 'PK',
                        KeyType: 'HASH'
                    },
                    {
                        AttributeName: 'SK',
                        KeyType: 'RANGE'
                    }
                ],
                GlobalSecondaryIndexes: [
                    {
                        IndexName: 'GSI1',
                        KeySchema: [
                            {
                                AttributeName: 'GSI1',
                                KeyType: 'HASH'
                            },
                            {
                                AttributeName: 'SK',
                                KeyType: 'RANGE'
                            }
                        ],
                        Projection: {
                            ProjectionType: 'ALL'
                        }
                    },
                    {
                        IndexName: 'GSI2',
                        KeySchema: [
                            {
                                AttributeName: 'GSI2',
                                KeyType: 'HASH'
                            },
                            {
                                AttributeName: 'SK',
                                KeyType: 'RANGE'
                            }
                        ],
                        Projection: {
                            ProjectionType: 'ALL'
                        }
                    }
                ],
                BillingMode: 'PAY_PER_REQUEST',
                TableName: process.env.TABLE
            })
            .promise()
    },

    removeTable: async () => {
        await db.deleteTable({
            TableName: process.env.TABLE
        })
    }
}
