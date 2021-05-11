const mysql  = require('mysql');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host :process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
  });
exports.register = (req,res)=>{
    console.log(req.body);

    const id = Date.now().toString()
    const name = req.body.name;
    const email= req.body.email;
    const password = req.body.password;
    const wallet = req.body.account;

    db.query('SELECT email from users WHERE email = ?',[email],async (error,results) => {
        if(error){
            console.log(error)
        }
        if(results.length >0){
            return res.render('register',{
                message: 'email already in use'
            })
        } 

        let hashedPassword = await bcrypt.hash(password,8);

        db.query('INSERT INTO users SET ?',{id:id,name :name,email:email,password:hashedPassword,wallet:wallet},(error,results) => {
            if(error){
                console.log(error)
            } else{
               
                return res.render('login',{
                    message: 'User registered'
                })
            }
        })
    })

}


exports.login = async (req,res)=>{
    try{
        const{email,password} = req.body;

        if(!email || !password){
        return res.status(400).render('login',{
            message : 'please provide an email and password'
        })
    }

    db.query('SELECT * FROM users WHERE email = ?',[email],async(error,results) =>{
        if(!results || !(await bcrypt.compare(password,results[0].password))){
            res.status(401).render('login',{
                message: 'Email or password is incorrect'
            })
        } else{
            const id = results[0].id;
            const token = jwt.sign({id:id}, process.env.JWT_SECRET,{
                expiresIn: process.env.JWT_EXPIRES_IN
            })
            console.log("the toke is " + token);
            
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES *24*60*60*1000
                ),
                httpOnly:true
            }

            res.cookie('jwt',token,cookieOptions);
            res.status(200).render('index',{
                name:results[0].name
            });
        }
    })


    }catch (error){
        console.log(error);
    }
}