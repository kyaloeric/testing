import mssql from 'mssql'
import { dbConfig } from '../config/sqlConfig'
import { request } from 'express'

export default class Connection{
    private pool:Promise<mssql.ConnectionPool>
    static default: any
    constructor(){
        this.pool=this.getConnection()
    };

    async getConnection():Promise<mssql.ConnectionPool>{
        const pool=mssql.connect(dbConfig) as Promise<mssql.ConnectionPool>
        return pool
    };

    createRequest(request:mssql.Request, data:{[c:string | number] :string | number}){
        const keys=Object.keys(data)
        keys.map((keyName)=>{
            const keyValue=data[keyName]
            request.input(keyName,keyValue)

        });
        return request
    };
    async query(query:string){
        const results=(await this.pool).request().query(query)
        return results
    };

    async execute(procedure: string,data:{[c:string | number]: string | number}={}){
        let pool=await this.pool
        let request=(await pool.request()) as mssql.Request;
        request=this.createRequest(request,data);
        const result= await request.execute(procedure)
        return result
    };

};