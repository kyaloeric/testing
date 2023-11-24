import Jwt   from "jsonwebtoken";

import * as dotenv from 'dotenv';
const SECRET_KEY=process.env.SECRET as string

dotenv.config();

export const tokenGenerator=(userID:string,fullName:string,email:string,cohortNumber:string):string=>{
    return Jwt.sign(
        {userID,fullName,email,cohortNumber},
        SECRET_KEY,
        {expiresIn: "48hrs"}
        );
};