'use client';
import { PropertyContext } from '@/context-api/PropertyContext';
import Image from 'next/image';
import Link from 'next/link';
import { HangaranbieterTyp } from '@/app/types/property/hangaranbieter';

export default function DiscoverProperties({ hangaranbieter }: { hangaranbieter: HangaranbieterTyp }) {
    
    return (
        <section className='dark:bg-darkmode'>
            <div className="container lg:max-w-screen-xl md:max-w-screen-md mx-auto px-4">
                <h2 className="text-4xl font-bold mb-12 text-midnight_text dark:text-white" data-aos="fade-left">Übersicht</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-4 gap-8">
                   
                    <div key={1} className="image-item block" data-aos="fade-up" data-aos-delay={`${1 * 100}`}>
                            <Link href={`/properties/properties-list`} className='group'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid-icon lucide-layout-grid p-4 border-2 rounded-lg border-border dark:border-dark_border mb-6 group-hover:-translate-y-1 group-hover:duration-500"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                                <p className="text-[22px] leading-[1.2] font-semibold mt-2 text-midnight_text text-opacity-80 group-hover:text-opacity-100 dark:text-white dark:group-hover:text-white dark:group-hover:text-opacity-100 dark:text-opacity-70 mb-1 capitalize">Gesamtzahl</p>
                                <p className="text-base text-gray">{hangaranbieter.stellplaetze.total}</p>
                            </Link>
                    </div>
                    <div key={2} className="image-item block" data-aos="fade-up" data-aos-delay={`${2 * 100}`}>
                            <Link href={`/properties/properties-list`} className='group'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-vote-icon lucide-vote p-4 border-2 rounded-lg border-border dark:border-dark_border mb-6 group-hover:-translate-y-1 group-hover:duration-500"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>
                                <p className="text-[22px] leading-[1.2] font-semibold mt-2 text-midnight_text text-opacity-80 group-hover:text-opacity-100 dark:text-white dark:group-hover:text-white dark:group-hover:text-opacity-100 dark:text-opacity-70 mb-1 capitalize">
                                    Frei</p>
                                <p className="text-base text-gray">{hangaranbieter.stellplaetze.frei}</p>
                            </Link>
                    </div>
                    <div key={3} className="image-item block" data-aos="fade-up" data-aos-delay={`${3 * 100}`}>
                            <Link href={`/properties/properties-list`} className='group'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-door-closed-locked-icon lucide-door-closed-locked p-4 border-2 rounded-lg border-border dark:border-dark_border mb-6 group-hover:-translate-y-1 group-hover:duration-500"><path d="M10 12h.01"/><path d="M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h8"/><path d="M20 17v-2a2 2 0 1 0-4 0v2"/><rect x="14" y="17" width="8" height="5" rx="1"/></svg>
                                <p className="text-[22px] leading-[1.2] font-semibold mt-2 text-midnight_text text-opacity-80 group-hover:text-opacity-100 dark:text-white dark:group-hover:text-white dark:group-hover:text-opacity-100 dark:text-opacity-70 mb-1 capitalize">
                                    belegt</p>
                                <p className="text-base text-gray">{hangaranbieter.stellplaetze.belegt}</p>
                            </Link>
                    </div>
                    <div key={4} className="image-item block" data-aos="fade-up" data-aos-delay={`${4 * 100}`}>
                            <Link href={`/properties/properties-list`} className='group'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mailbox-icon lucide-mailbox p-4 border-2 rounded-lg border-border dark:border-dark_border mb-6 group-hover:-translate-y-1 group-hover:duration-500"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><polyline points="15,9 18,9 18,11"/><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2"/><line x1="6" x2="7" y1="10" y2="10"/></svg>
                                <p className="text-[22px] leading-[1.2] font-semibold mt-2 text-midnight_text text-opacity-80 group-hover:text-opacity-100 dark:text-white dark:group-hover:text-white dark:group-hover:text-opacity-100 dark:text-opacity-70 mb-1 capitalize">
                                    Anfragen</p>
                                <p className="text-base text-gray">{hangaranbieter.anfragen.anzahl}</p>
                            </Link>
                    </div>
                    <div key={5} className="image-item block" data-aos="fade-up" data-aos-delay={`${5 * 100}`}>
                            <Link href={`/properties/properties-list`} className='group'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text p-4 border-2 rounded-lg border-border dark:border-dark_border mb-6 group-hover:-translate-y-1 group-hover:duration-500"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                                <p className="text-[22px] leading-[1.2] font-semibold mt-2 text-midnight_text text-opacity-80 group-hover:text-opacity-100 dark:text-white dark:group-hover:text-white dark:group-hover:text-opacity-100 dark:text-opacity-70 mb-1 capitalize">
                                    Termine</p>
                                <p className="text-base text-gray">{hangaranbieter.termine.anzahl}</p>
                            </Link>
                    </div>
                    <div key={6} className="image-item block" data-aos="fade-up" data-aos-delay={`${6 * 100}`}>
                            <Link href={`/properties/properties-list`} className='group'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-icon lucide-bell p-4 border-2 rounded-lg border-border dark:border-dark_border mb-6 group-hover:-translate-y-1 group-hover:duration-500"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
                                <p className="text-[22px] leading-[1.2] font-semibold mt-2 text-midnight_text text-opacity-80 group-hover:text-opacity-100 dark:text-white dark:group-hover:text-white dark:group-hover:text-opacity-100 dark:text-opacity-70 mb-1 capitalize">
                                    Reservierungen</p>
                                <p className="text-base text-gray">{hangaranbieter.reservierungen.anzahl}</p>
                            </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}