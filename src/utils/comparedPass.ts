import bcrypt from 'bcrypt'

export const comparedPass=async(inputPassword:string,dbPassword:string)=>{

    const validPassword=await bcrypt.compare(inputPassword,dbPassword)
    // console.log(validPassword);
    
    return validPassword
}