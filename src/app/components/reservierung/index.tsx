"use client";

import React, { useEffect, useState } from 'react';
import Services from '@/app/components/services/Services';
import { useRouter } from "next/navigation";
import { allServicesTyp } from '@/app/types/property/allServices';
import Loader from '@/app/components/shared/Loader';
import { Row, Column, Hr, Tailwind } from "@react-email/components";


const Reservierungen = () => {




    return(
    <>
        <Tailwind>
            <>
                <Row>
                <Column>Stellplatz</Column>
                <Column>Flugzeug</Column>
                <Column>Kundenname</Column>
                <Column>Von</Column>
                <Column>Bis</Column>
                <Column>Aktion</Column>
                </Row>
                <Hr className="my-[16px] border-gray-300" />
                <Row>
                <Column>First column</Column>
                <Column>Second column</Column>
                </Row>
            </>  
        </Tailwind>
    
    
    </>
    );
};

export default Reservierungen;