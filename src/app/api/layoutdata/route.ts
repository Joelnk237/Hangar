import { NextResponse } from "next/server";


const headerDataHAnbieter = [
  { label: "Home", href: "/" },
  {
    label: "Stellplätze",
    href: "#",
    submenu: [
      { label: "Stellplätze verwalten", href: "/stellplaetze/stellplaetzeDashboard" },
      { label: "Zum Flugzeuge verwalten", href: "/stellplaetze/flugzeuge" },
    ],
  },
  { label: "Services", href: "/services " },
  {
    label: "Anfragen",
    href: "#",
    submenu: [
      { label: "Reparaturanfragen", href: "/properties/properties-list" },
      { label: "Wartungsanfragen", href: "/properties/properties-list/modern-apartment" },
    ],
  },
  {
    label: "Termine",
    href: "#",
    submenu: [
      { label: "Abhol-/ Rückgabe Termine", href: "/blogs" },
      { label: "Werkstatt-termin", href: "/blogs/blog_1" },
    ],
  },
  
  { label: "Nachrichten", href: "/nachrichte" },
  { label: "Profil", href: "/nachrichte" },
];
const headerDataFBesitzer = [
  { label: "Home", href: "/" },
  { label: "Stellplatzsuche", href: "/properties/properties-list" },
  { label: "Flugzeuge", href: "/flugzeuge" },
  { label: "Anfragen", href: "#" },
  { label: "Angebote", href: "#" },
  { label: "Nachrichten", href: "/nachrichten" }, 
];

export const GET = async () => {
  return NextResponse.json({
    headerDataHAnbieter,
    headerDataFBesitzer,
  });
};

