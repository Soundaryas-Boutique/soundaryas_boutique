import User from "@/app/(models)/User";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options = {
    providers:[
        
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{
                    label:"email:",
                    type:"text",
                    placeholder:"your-email"},

                password:{
                    label:"password:",
                    type:"password",
                    placeholder:"your-password"},
            },
            async authorize(credentials){
                try{
                    const foundUser = await User.findOne({email: credentials.email})
                    .lean()
                    .exec();

                if(foundUser){
                    console.log("Found User: ",foundUser)
                    const match = await bcrypt.compare(credentials.password, foundUser.password);
                    
                    if(match){
                        console.log("Good password...")
                        delete foundUser.password;
                     
    
                        foundUser["role"] ="unverified Email"
                        return foundUser;
                    }
                
                };
                

                
                }
                catch(error){
                    return null
                }
            }
        })

    ],

    callbacks:{
        async jwt({token,user}){
            if(user) token.role = user.role;
            return token;
        },
        async session({session,token}){
            if(session?.user) session.user.role = token.role;
            return session;
        }
    },
    pages:{
        signIn:"/signin"
    }

}