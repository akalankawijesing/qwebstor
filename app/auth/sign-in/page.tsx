import { getCurrentSession, loginUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { z as zod } from "zod";
import SignInForm from "@/components/auth/SignInForm";

const SignInSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

const SignInPage = async () => {
     const { user } = await getCurrentSession();

    if (user) {
        return redirect('/');
    }

    const action = async (prevState: unknown, formData: FormData) => {
        "use server";

        const parsed = SignInSchema.safeParse(Object.fromEntries(formData));

        if(!parsed.success) {
            return {
                message: "Invalid form data",
            };
        }

        const { email, password } = parsed.data;
        const { user, error } = await loginUser(email, password);
        
        if(error) {
            return { message: error};
        } else if(user) {
            return redirect("/");
        }
    }
  return (
    <>
      <div>
       <SignInForm action={action} />
      </div>
    </>
  );
};

export default SignInPage;
