import DynamoDB, { ScanOutput } from "aws-sdk/clients/dynamodb";

const TableName = `showers-prod`;

export default class Devices {
  static getAll({ state = "active", LastEvaluatedKey = null } = {}) {
    const ddb = new DynamoDB.DocumentClient({
      region: "eu-west-1",
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName,
      IndexName: "state-index",
      KeyConditionExpression: "#state = :state",
      ExpressionAttributeNames: {
        "#state": "state",
      },
      ExpressionAttributeValues: {
        ":state": state,
      },
    };

    return ddb.query(params).promise();
  }
}
