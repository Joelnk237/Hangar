
import SignUp from "@/app/components/auth/signupClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign Up | Property-pro",
};

const SignupPage = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default SignupPage;
