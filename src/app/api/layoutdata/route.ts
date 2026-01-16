import { NextResponse } from "next/server";

const headerData = [
  { label: "Home", href: "/" },
  {
    label: "Properties",
    href: "#",
    submenu: [
      { label: "Property List", href: "/properties/properties-list" },
      { label: "Property Details", href: "/properties/properties-list/modern-apartment" },
    ],
  },
  {
    label: "Blogs",
    href: "#",
    submenu: [
      { label: "Blog Grid", href: "/blogs" },
      { label: "Blog Details", href: "/blogs/blog_1" },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Documentation", href: "/documentation" },
];
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
  { label: "Stellplatzsuche", href: "/suche" },
  { label: "Flugzeuge", href: "/flugzeuge" },
  { label: "Services", href: "/flugzeuge" },
  {
    label: "Anfragen",
    href: "#",
    submenu: [
      { label: "Property List", href: "/properties/properties-list" },
      { label: "Property Details", href: "/properties/properties-list/modern-apartment" },
    ],
  },
  { label: "Angebote", href: "/documentation" },
  { label: "Profil", href: "/profil" },
  
  
];

export const GET = async () => {
  return NextResponse.json({
    headerDataHAnbieter
  });
};

