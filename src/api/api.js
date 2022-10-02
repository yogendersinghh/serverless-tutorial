const mysql = require("serverless-mysql")({
    config:{
        host:process.env.HOST,
        database:process.env.DB,
        user:process.env.USER,
        password:process.env.PSWD
    }
})
module.exports.testing = async(event)=>{
    console.log("connection established",process.env.HOST)
    let value = "select * from student"
    const sql =  await mysql.query(value)
    const response = {
        statusCode : 200,
        body:JSON.stringify(sql,
        null,
        2)
    }
    return response
}

module.exports.postApi = async(event)=>{
    console.log("post api",event)
      const data =   JSON.parse(event.body)
      const {name,age,number,country,id} = data;
    let createQuery = "insert into student values(?,?,?,?,?)"
    let sql = await mysql.query(createQuery,[name,age,number,country,id])
    const response = {
        statuscCode:200,
        body:JSON.stringify({
            message:"hey this is post api calling function",
            input:event
        },
        null,
        2)
    }
    return response
}

module.exports.updateApi = async(event)=>{
    const paramsID = event.pathParameters
    const data = JSON.parse(event.body)
    console.log("🚀 ~ file: api.js ~ line 43 ~ module.exports.updateApi=async ~ data", data)
    const {name,age,number,country,id} = data
    console.log("🚀 ~ file: api.js ~ line 45 ~ module.exports.updateApi=async ~ age",name)
    let updateQuery  = 'update student set name="'+name+'",age="'+age+'",number="'+number+'",country="'+country+'",id="'+id+'" where id=?';
    await mysql.query(updateQuery,[paramsID],(err,result)=>{
        if (err) throw err
        console.log("result",result)
        let response = {
            statusCode:200,
            body:JSON.stringify({
                message:"data is updated",
                input:result
            })
        }
        return response
    })
    // console.log("🚀 ~ file: api.js ~ line 46 ~ module.exports.updateApi=async ~ sql", sql)
}

module.exports.getOne = async(event)=>{
    // console.log("evenet",)
    let {id} = event.pathParameters
    let getOneQuery = "select * from student where id= ?"
    let sql =  await mysql.query(getOneQuery,[id])
    let response = {
        statusCode:200,
        body:JSON.stringify(sql,null,2)
    }
    console.log("🚀 ~ file: api.js ~ line 63 ~ module.exports.getOne=async ~ response", response)
    return response
}


module.exports.deleteOne = async(event)=>{
    const {id} = event.pathParameters;
    let query = "delete from student where id=?";
    let sql = await mysql.query(query,[id])
    console.log("🚀 ~ file: api.js ~ line 80 ~ module.exports.deleteOne ~ sql", sql)
    let response = {
        statusCode:200,
        body:JSON.stringify({
            message:"user is deleted",
            input:sql
        },null,2)
    }
    return response
    
}