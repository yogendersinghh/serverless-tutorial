const mysql = require("serverless-mysql")({
  config: {
    host: process.env.HOST,
    database: process.env.DB,
    user: process.env.USER,
    password: process.env.PSWD,
  },
});
module.exports.testing = async (event) => {
  let value = "select * from Contacts";
  const sql = await mysql.query(value);
  const response = {
    statusCode: 200,
    body: JSON.stringify(sql, null, 2),
  };
  return response;
};

module.exports.createApi = async (event) => {
  const data = JSON.parse(event.body);
 
  const { fname, mname, lname, country } = data;
  let createQuery = "insert into Contacts SET ?";
  let sql = await mysql.query(createQuery, data);
 
  const response = {
    statuscCode: 200,
    body: JSON.stringify(
      {
        message: "hey this is post api calling function",
        input: event,
      },
      null,
      2
    ),
  };
  return response;
};

module.exports.createOrg = async (event) => {
  let data = await JSON.parse(event.body);
  let query = "insert into Organization SET ?";
  await mysql.query(query, data);
  let response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Org is creted",
      input: event,
    }),
  };
  return response;
};

module.exports.updateApi = async (event) => {
  const paramsID = event.pathParameters;
  const data = JSON.parse(event.body);
  let updateQuery = "update Contacts SET ? where ?";
  const result = await mysql.query(updateQuery, [data,paramsID])
    let response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "data is updated",
        input: result,
      }),
    };
      mysql.end();
    return response;
};

module.exports.getOne = async (event) => {
  let { id } = event.pathParameters;
  let getOneQuery = "select * from Contacts where idContacts= ?";
  let sql = await mysql.query(getOneQuery, [id]);
  let response = {
    statusCode: 200,
    body: JSON.stringify(sql, null, 2),
  };
  
  return response;
};

module.exports.deleteOne = async (event) => {
  const paramsID= event.pathParameters;
  let query = "delete from Contacts where ?";
  let sql = await mysql.query(query, paramsID);
  let response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "user is deleted",
        input: sql,
      },
      null,
      2
    ),
  };
  return response;
};
