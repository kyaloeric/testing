import {Request,Response, json} from 'express';
import Connection from '../dbHelpers/dbHelper';
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import { regUserValidation, userLoginValidationSchema} from "../validators/userValidator";
import { ExtendedUser, verifyToken } from '../middlewares/verifyToken';
import { tokenGenerator } from '../utils/generateToken';
import { dbConfig } from '../config/sqlConfig';

import mssql from 'mssql'


const dbhelpers=new Connection;

export const registerUser=async (req:Request,res:Response)=>{

try{
    const {fullName,email,password, cohortNumber}=req.body;
    let userID=v4()

    let hashedPassword=await bcrypt.hash(password , 5)


    const { error }=regUserValidation.validate(req.body)

    if(error){
        return res.status(421).send({
            error:"Use strong password, should be atleast 8 characters long with lowercase letters,symbols and uppercase"
        })
    }

    let checkIfEmailExistProc="getUserByEmail"
    const result=await dbhelpers.execute(checkIfEmailExistProc,{ email });
    const userExist=result.recordset[0];

    if(userExist){
        return res.status(404).send({
            error:"User with similar email exists"
        })
    }

   
    const results=await dbhelpers.execute('registerUser',{userID,fullName,email, cohortNumber,password:hashedPassword})

    return res.status(201).json({
        message:"User Registered Successfully",

    })

}catch(error){
    return res.json({
        error:error
    })
}
}





export const editUser = async (req: Request, res: Response) => {
    try {
        const userID = req.params.userID;
        let { fullName, cohortNumber, password } = req.body;

        const pool = await mssql.connect(dbConfig);

        await pool
            .request()
            .input('userID', mssql.VarChar, userID)
            .input('fullName', mssql.VarChar, fullName)
            .input('cohortNumber', mssql.VarChar, cohortNumber)
            .input('password', mssql.VarChar, password)
            .execute('editUser');

        return res.status(200).json({
            message: 'User updated successfully',
        });
    } catch (error) {
        return res.json({
            error: error,
        });
    }
};




export const loginUser = async (req: Request, res: Response) => {
    const { error } = userLoginValidationSchema.validate(req.body);
  
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
  
    const { email, password } = req.body;
  
    const checkEmailResult = await dbhelpers.execute('getUserByEmail', { email });
  
    const existingUserWithEmail = checkEmailResult.recordset;
    const user = existingUserWithEmail[0];
  
    if (user) {
      const validPass = await bcrypt.compare(password, user.password);
  
      if (validPass) {
        const token = tokenGenerator(
          user.userID,
          user.fullName,
          user.email,
          user.cohortNumber
        );
  
        return res.json({
          message: 'Logged in successfully',
          token,
        });
      } else {
        return res.status(401).json({
          error: 'Invalid password',
        });
      }
    } else {
      return res.status(404).json({
        error: 'Account does not exist',
      });
    }
  };


  


export const checkCredentials=(req:ExtendedUser,res:Response)=>{
    if(req.info){
        return res.json({
            info: req.info
        })
    }
}




export const getUserDetails=async(req:Request,res:Response)=>{

    try {

       const userID =req.params.userID
       console.log(userID);       
    
        const result = await dbhelpers.execute('GetUserDetails',{userID});
        const userDetails = result.recordset[0];

        console.log(userDetails);
        
        if (!userDetails) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.json(userDetails);

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

export const getAllUsers=async(req:Request, res:Response)=>{
    try{
        const users=(await dbhelpers.execute('fetchAllUsers')).recordset

        return res.status(201).json(users)
    }catch(error){
        return res.json({
            error:error
        })
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userID = req.params.userID;

        const pool = await mssql.connect(dbConfig);

        await pool.request().input('tourID', userID).execute('deleteUser');

        return res.status(200).json({
            message: 'User  deleted successfully',
        });
    } catch (error) {
        return res.json({
            error: error,
        })
    }
};