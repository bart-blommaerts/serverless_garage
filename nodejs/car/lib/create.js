var dynamo = require('./dynamo');
var uuid = require('uuid');

module.exports.respond = function (event, callback) {
  var data = event.car;
  data.id = uuid.v1();
  data.updatedAt = new Date().getTime();
  var params = {
    TableName: dynamo.tableName,
    Item: data
};
  return dynamo.doc.put(params, function (error, data) {
    if (error) {
      callback(error);
      } else {
      var newData = { 'car' : params.Item };
      callback(error, newData);
} });
};
