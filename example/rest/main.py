def handler(event, context):
    return {
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": "This is python api example that supports AWS API Gateway, on payloadFormatVersion \"1.0\", proxy integration."
    }
