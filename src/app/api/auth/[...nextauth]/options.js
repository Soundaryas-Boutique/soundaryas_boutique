
// https://github.com/settings/developers for github Oauth..








import User from "@/app/(models)/User";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options = {
    providers:[
        GithubProvider({
            profile(profile){
                console.log("Profile for Git: ",profile)

                let userRole = "GitHub User";
                if(profile?.email == "karthikvishal1506@gmail.com"){
                    userRole = "Admin";
                }
                return {
                    ...profile,
                    role: userRole,
                };
            },
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        GoogleProvider({
            profile(profile){
                console.log("Profile for Google: ",profile)

                let userRole = "Google User";
                return {
                    ...profile,
                    id: profile.sub,
                    role: userRole,
                };
            },
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
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