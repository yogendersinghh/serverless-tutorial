const mysql = require("serverless-mysql")({
  config: {
    host: process.env.HOST,
    database: process.env.DB,
    user: process.env.USER,
    password: process.env.PSWD,
  },
});
module.exports.getAll = async (event) => {
  let value = "select * from Contacts";
  const sql = await mysql.query(value);
  const response = {
    statusCode: 200,
    body: JSON.stringify(sql, null, 2),
    data: sql,
  };
  return response;
};

module.exports.getAllOrg = async (event) => {
  let value = "select * from Organization";
  const sql = await mysql.query(value);
  const response = {
    statusCode: 200,
    body: JSON.stringify(sql, null, 2),
    data: sql,
  };
  return response;
};

module.exports.createContact = async (event, context) => {
  const data = JSON.parse(event.body);
  let { FirstName, Organizatin_idOrganization } = data;
  let response = {
    statusCode: 0,
    body: "",
  };
  if (!FirstName && !Organizatin_idOrganization) {
    (response.statusCode = 400),
      (response.body = JSON.stringify(
        { message: "please fill ateast First Name And Org ID" },
        null,
        2
      ));
    return response;
  }
  let query = "select * from Organization where idOrganization = ?";
  let res = await mysql.query(query, [data.Organizatin_idOrganization]);
  if (!res.length) {
    (response.statusCode = 404),
      (response.body = JSON.stringify(
        { message: "No Org Id Exists. Please Create a Org ID first" },
        null,
        2
      ));
    return response;
  }
  let ContactsQuery =
    "select * from Contacts where Organizatin_idOrganization = ?";
  let result = await mysql.query(ContactsQuery, [
    data.Organizatin_idOrganization,
  ]);
  if (result.length) {
    (response.statusCode = 403),
      (response.body = JSON.stringify(
        { message: `Contact with This Org ID ${Organizatin_idOrganization} is already exists`},
        null,
        2
      ));

    return response;
  }
  let createQuery = "insert into Contacts SET ?";
  let sql = await mysql.query(createQuery, data);
  (response.statusCode = 200),
    (response.body = JSON.stringify(
      {
        message: "Contact Created Successfully",
        input: sql,
      },
      null,
      2
    ));

  return response;
};

module.exports.createOrg = async (event) => {
  let data = await JSON.parse(event.body);
  let { OrganizationName, Email } = data;
  let response = {
    statusCode: 0,
    body: "",
  };
  if (!OrganizationName && !Email) {
    response.statusCode = 400;
    response.body = JSON.stringify(
      { message: "please fill ateast Email And OrganizationName" },
      null,
      2
    );
    return response
  }
  let EmailQuery = "select * from Organization where Email = ?";
  let result = await mysql.query(EmailQuery, [Email]);
    console.log("🚀 ~ file: api.js ~ line 94 ~ module.exports.createOrg= ~ result", result)
    if (result.length) {
    (response.statusCode = 403),
      (response.body = JSON.stringify(
        { message: `Organization with This Email ${Email} is already exists` },
        null,
        2
      ));

    return response;
  }
  let query = "insert into Organization SET ?";
  let sql = await mysql.query(query, data);
  mysql.end();
  (response.statusCode = 200),
    (response.body = JSON.stringify({
      message: "Org is creted",
      input: sql,
    }));
  return response;
};

module.exports.updateApi = async (event) => {
  const paramsID = event.pathParameters;
  const data = JSON.parse(event.body);
  let updateQuery = "update Contacts SET ? where ?";
  const result = await mysql.query(updateQuery, [data, paramsID]);
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

module.exports.deleteUser = async (event) => {
  const paramsID = event.pathParameters;
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

module.exports.deleteOrg = async (event) => {
  const paramsID = event.pathParameters;
  let query = "delete from Organization where ?";
  let response = {
    statusCode:0,
    body:""
  }
  mysql.query(query, paramsID,(err,res)=>{
    if(err){
      console.log("🚀 ~ file: api.js ~ line 183 ~ mysql.query ~ err", err.sqlMessage)
      response.statusCode = 400,
      response.body = JSON.stringify(err,null,2);
      return response
    }
    console.log("🚀 ~ file: api.js ~ line 195 ~ mysql.query ~ res", res)
    
      response.statusCode =200,
      response.body=JSON.stringify(
        {
          message: "Organization is deleted",
          input: res,
        },
        null,
        2
      )
    return response;
  });
  // console.log("🚀 ~ file: api.js ~ line 178 ~ module.exports.deleteOrg ~ sql", sql)
  
};