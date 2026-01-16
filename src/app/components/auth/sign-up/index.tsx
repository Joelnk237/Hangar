"use client";
import Link from "next/link";
import SocialSignUp from "../social-button/SocialSignUp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../shared/Loader";
import Logo from "../../layout/header/logo";
const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
    strasse: "",
    hNr: "",
    plz: "",
    ort: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (!/^[a-zA-Z\s]{3,}$/.test(name)) return "Name must be at least 3 characters and contain only letters";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    setErrors((prev) => ({
      ...prev,
      [name]: name === "name"
        ? validateName(value)
        : name === "email"
          ? validateEmail(value)
          : validatePassword(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submitting
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ name: nameError, email: emailError, password: passwordError });
    if (nameError || emailError || passwordError) {
      return;
    }

    setLoading(true);
    try {

      //Bereite das JSON für das Backend vor
    const payload = {
      rolle: "flugzeugbesitzer",
      name: formData.name,
      email: formData.email,
      tel: formData.tel,
      password: formData.password,
      adresse: {
        strasse: formData.strasse,
        hausnummer: formData.hNr,
        plz: formData.plz,
        ort: formData.ort
      },
    };

    //POST-Request zum Vert.x Backend
    const res = await fetch("http://localhost:8888/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Registration failed");
    }

    const data = await res.json();
      router.push("/");
    } catch (error: any) {
      console.error("Registration Error:", error);
    alert(error.message || "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
        <div className="max-w-lg w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
          <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
            <Logo />
          </div>


          

          <form onSubmit={handleSubmit}>
            {/*<h3 className="text-base text-midnight_text font-semibold mb-4">Persönliche Daten</h3>*/}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Telefonnummer"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Straße"
                name="strasse"
                value={formData.strasse}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Hausnummer"
                name="hNr"
                value={formData.hNr}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Postleitzahl"
                name="plz"
                value={formData.plz}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Ort"
                name="ort"
                value={formData.ort}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-9">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary hover:bg-DarkPrimary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:!bg-darkprimary dark:hover:!bg-darkprimary"
              >
                Sign Up {loading && <Loader />}
              </button>
            </div>
          </form>


          <p className="text-midnight_text dark:text-white text-base">
            Already have an account?
            <Link
              href="/signin"
              className="pl-2 text-midnight_text dark:text-white hover:text-primary dark:hover:text-primary"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
