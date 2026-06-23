import bcrypt from "bcrypt"
import { getEnv } from "../../../../config/env.service.js"

export const HashGenerate = async (Data)=>{
    if(!Data)
    {
    throw new Error("Password is required for hashing");
    }
    return await bcrypt.hash(Data,Number(getEnv("SALT")))
}

export const CompareHash = async(Data ,UserData)=>{
    const Compare = await bcrypt.compare(Data,UserData)
    return Compare;
}