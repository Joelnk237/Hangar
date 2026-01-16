import { NextResponse } from "next/server";

const menuItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Blog", href: "/#blog" },
];

const features = [
    {
        id: 1,
        imgSrc: "/images/features/rating.svg",
        title: "Great Experience",
        description: "Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing Variou"
    },
    {
        id: 2,
        imgSrc: "/images/features/Give-Women's-Rights.svg",
        title: "Great Experience",
        description: "Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing Variou"
    },
    {
        id: 3,
        imgSrc: "/images/features/live-chat.svg",
        title: "Great Experience",
        description: "Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing Variou"
    }
];

const searchOptions = {
    keywords: [
        { value: '', label: 'Keyword', placeholder: 'Keyword' },
        // Add more keyword options as needed
    ],
    locations: [
        { value: '', label: 'Ort', placeholder: 'location' },
    ],
    Flugzeugtyp : [
        { value:'', label: 'Flugzeugtyp' },
        { value:'SEP', label: 'SEP' },
        { value:'MEP', label: 'MEP' },
        { value:'Helikopter', label: 'Helikopter' },
        { value:'Jet', label: 'Jet' },
        { value:'Turboprop', label: 'Turboprop' },
        { value:'Ultraleicht', label: 'Ultraleicht' },
    ],
    Flugzeuggroesse: [
        { value: '', label: 'Flugzeuggröße' },
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
        // Add more bed options as needed
    ],
    
    // Define other options similarly
};

const data = [
    {
        src: "https://svgshare.com/i/187L.svg",
        src1: "https://svgshare.com/i/183P.svg",
        alt: "Image 1",
        name: "Apartment",
        count: 35,
    },
    {
        src: "https://svgshare.com/i/188i.svg",
        src1: "https://svgshare.com/i/185B.svg",
        alt: "Image 2",
        name: "Villa",
        count: 15,
    },
    {
        src: "https://svgshare.com/i/186r.svg",
        src1: "https://svgshare.com/i/185n.svg",
        alt: "Image 3",
        name: "Office",
        count: 26,
    },
    {
        src: "https://svgshare.com/i/187Z.svg",
        src1: "https://svgshare.com/i/184b.svg",
        alt: "Image 4",
        name: "Shop",
        count: 43,
    },
    {
        src: "https://svgshare.com/i/1881.svg",
        src1: "https://svgshare.com/i/183k.svg",
        alt: "Image 5",
        name: "House",
        count: 95,
    },
    {
        src: "https://svgshare.com/i/188C.svg",
        src1: "https://svgshare.com/i/184d.svg",
        alt: "Image 6",
        name: "Warehouse",
        count: 18,
    },
];

export const GET = async () => {
  return NextResponse.json({
    menuItems,
    features,
    searchOptions,
    data
  });
};