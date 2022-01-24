import aws from 'aws-sdk'
const region = process.env.AWS_REGION || 'us-east-1'
const ssm = new aws.SSM({
    region: region
})

export async function setParameter(props: { key: string; value: string }) {
    await ssm
        .putParameter({
            Name: props.key,
            Value: props.value,
            Type: 'String'
        })
        .promise()

    return true
}
