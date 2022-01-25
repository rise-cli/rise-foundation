import { makeLambda } from './cf/makeLambda'
import { deployStack } from '../cloudformation/deployStack'
import aws from 'aws-sdk'

const STACK_NAME = 'RiseFoundationTestStepFunction'
// test('cf.makeStepFunction CloudFormation is valid', async () => {
//     const x = makeLambda({
//         appName: 'risefoundationtest',
//         name: 'lambda',
//         stage: 'dev'

//         // bucketArn: string
//         // bucketKey: string
//         // permissions: any[]
//     })
// })
