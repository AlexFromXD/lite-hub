def handler(event, context):
    return {
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": "This is python api v1"
    }
