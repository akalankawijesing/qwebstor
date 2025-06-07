import { getCurrentSession, loginUser, registerUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { z as zod } from "zod";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUpSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

const SignUpPage = async () => {
     const { user } = await getCurrentSession();

    if (user) {
        return redirect('/');
    }

    const action = async (prevState: unknown, formData: FormData) => {
        "use server";

        const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));

        if(!parsed.success) {
            return {
                message: "Invalid form data",
            };
        }

        const { email, password } = parsed.data;
        const { user, error } = await registerUser(email, password);
        
        if(error) {
            return { message: error};
        } else if(user) {
            await loginUser(email, password);
            return redirect("/");
        }
    }
  return (
    <>
      <div>
       <SignUpForm action={action} />
      </div>
    </>
  );
};

export default SignUpPage;
