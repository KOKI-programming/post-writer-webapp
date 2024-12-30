import { buttonVariants } from "@/components/ui/button";
import UserAuthForm from "@/components/user-auth-form";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Register(){
    return (
    <div className="container grid flex-col lg:grid-cols-2 h-screen w-screen items-center justify-center lg:max-w-none lg:px-0 relative">
        <Link
        href ={"/login"}
        className={cn(buttonVariants({variant:"ghost"}) ,
        "absolute left-4  top-4 md:left-8 md:top-8"
         )}
     >
        ログイン
        </Link>
        <div className="h-full bg-muted lg:block hidden "/>
            <div className="mx-auto w-full sm:w-[350px] flex-col justify-center space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        アカウントの作成
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        メールアドレスを入力してアカウントを作成してください。
                    </p>
                </div>
                <UserAuthForm/>

                <p className="text-muted-foreground px-8 text-center text-sm">
                    続けてクリックすれば私達の
                    <Link href ={"/terms"} className="underline underline-offset-4">
                        利用規約
                    </Link>
                    および
                    <Link href ={"/privacy"} className="underline underline-offset-4">
                        プライバシーポリシー
                    </Link>
                    に同意したものとみなされます。
                </p>
          </div>
     </div>
    )
}