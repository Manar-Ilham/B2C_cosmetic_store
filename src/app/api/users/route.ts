
import { NextResponse } from "next/server";
import {connect} from "../../../lib/mongoose"
import { User}  from "../../../lib/models/users";



export const GET = async () => {
 try{
  await connect();
  const allUsers = await User.find({});
  return  new NextResponse(JSON.stringify(allUsers), {status: 200} );
 }
  catch(error){
    console.log('Error fetching users:', error);
}
};