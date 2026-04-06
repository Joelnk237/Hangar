import { NextResponse } from "next/server";


const headerDataHAnbieter = [
  { label: "Home", href: "/" },
  {
    label: "Stellplätze",
    href: "#",
    submenu: [
      { label: "Stellplätze verwalten", href: "/stellplaetze/stellplaetzeDashboard" },
      { label: "Kundenflugzeuge verwalten", href: "/stellplaetze/flugzeuge" },
    ],
  },
  { label: "Services", href: "/services " },
  {
    label: "Anfragen",
    href: "#",
    submenu: [
      { label: "Angebotsanfragen", href: "/angebote/hangaranbieter" },
      { label: "Kundenanfragen", href: "/anfragen" },
      { label: "Reparatur-/Wartungsanfragen", href: "#" },
    ],
  },
  {
    label: "Termine",
    href: "#",
    submenu: [
      { label: "Abhol-/ Rückgabe Termine", href: "/termine" },
      { label: "Werkstatt-termin", href: "#" },
    ],
  },
  
  { label: "Reservierungen", href: "/reservierungen" },
  { label: "Profil", href: "/profil" },
];
const headerDataFBesitzer = [
  { label: "Home", href: "/" },
  { label: "Stellplatzsuche", href: "/properties/properties-list" },
  { label: "Flugzeuge", href: "/flugzeuge" },
  { label: "Anfragen", href: "#" },
  { label: "Angebote", href: "/angebote/flugzeugbesitzer" },
  { label: "Termine", href: "/termine" },
  { label: "Nachrichten", href: "/nachrichten" },
  { label: "Profil", href: "/profil" },  
];

export const GET = async () => {
  return NextResponse.json({
    headerDataHAnbieter,
    headerDataFBesitzer,
  });
};

