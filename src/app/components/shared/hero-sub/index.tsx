import React, { FC } from "react";

interface HeroSubProps {
    title: string;
    description: string;

}

const HeroSub: FC<HeroSubProps> = ({ title, description }) => {

    return (
        <>
            <section className=" text-center bg-cover pt-36 pb-10 relative bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden" >
                <h2 className="text-midnight_text text-[50px] leading-[1.2] relative font-bold dark:text-white capitalize">{title}</h2>
                <p className="text-lg text-gray font-normal max-w-md w-full mx-auto mt-7 mb-12 sm:px-0 px-4">
                    {description}
                </p>
            </section>
        </>
    );
};

export default HeroSub;