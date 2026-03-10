export default function Excursions() {
    return (
        <div className="flex-1">
            {/* Hero Section */}
            <section className="px-6 lg:px-20 py-8">
                <div className="relative overflow-hidden rounded-xl h-[400px] flex flex-col justify-end bg-slate-900">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to top, rgba(10, 25, 47, 0.9) 0%, rgba(10, 25, 47, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrJ_cacbtidQe2mxuUAewN3mijI69fGeq7-k7G4ur9VcOzrS1DBL3nUNJZtMUWtKdDWjrNt0m0-h1GT44dpPjtts5K70KR6A9A4LFiQ9RoOrq--G8D-YSvGC0okUCbN7K_XwB-wmz230KxD59LBsPOhJVVE8ereRSQ0LoOkRmldcWnpP25Sv1LRxGRQ7uzb0kx5bLB1KD0FEMDzZ3JI9wpG19C--6ncaFBFIKfZUFAdgkryhigZK1uL6wqv_KAzr38r4DgD5A9Ki2l")' }}></div>
                    <div className="relative p-8 lg:p-12 z-10 max-w-3xl">
                        <h1 className="text-slate-100 text-4xl lg:text-6xl font-bold leading-tight mb-4">Discover Your Next Extraordinary Adventure</h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-light">Hand-picked excursions guided by local experts that go beyond the guidebook.</p>
                    </div>
                </div>
            </section>

            {/* Booking Bar */}
            <section className="px-6 lg:px-20 -mt-12 relative z-20">
                <div className="bg-white dark:bg-[#112240] rounded-xl shadow-2xl p-6 lg:p-8 border border-slate-700/50">
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">location_on</span> Destination
                            </label>
                            <select className="form-select rounded-lg bg-slate-900/50 border-slate-700 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 w-full">
                                <option>Bali, Indonesia</option>
                                <option>Santorini, Greece</option>
                                <option>Amalfi Coast, Italy</option>
                                <option>Kyoto, Japan</option>
                                <option>Reykjavik, Iceland</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">calendar_month</span> Preferred Date
                            </label>
                            <input className="form-select rounded-lg bg-slate-900/50 border-slate-700 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 w-full" type="date" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">group</span> Guests
                            </label>
                            <div className="form-select rounded-lg bg-slate-900/50 border-slate-700 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 w-full flex items-center">
                                <button className="text-primary hover:bg-primary/10 p-1 rounded" type="button"><span className="material-symbols-outlined">remove</span></button>
                                <span className="flex-1 text-center font-medium">2 Guests</span>
                                <button className="text-primary hover:bg-primary/10 p-1 rounded" type="button"><span className="material-symbols-outlined">add</span></button>
                            </div>
                        </div>
                        <div>
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-lg transition-all flex items-center justify-center gap-2" type="submit">
                                <span className="material-symbols-outlined">search_check</span>
                                Search Excursions
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Destination Grid */}
            <section className="px-6 lg:px-20 py-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Curated for you</h3>
                        <h2 className="text-3xl lg:text-4xl font-bold">Trending Destinations</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="size-10 rounded-full border border-primary/30 flex items-center justify-center hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-primary">chevron_left</span>
                        </button>
                        <button className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                            <img alt="Destination" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNNVNynjVlj054CUzFVSdp7VZADt1_kaJhtjYt3ddDh5rkpT1ypy5G44FmsEkcDrETwi8bJt5dxtlhvjuEYzvrKh98wMsW4I_5X-vsM-25aSHyieYgwSqzSZpskW8hAm1fG4UG5K_MkoIxH85LW929PBR68saGCBQ1qBQvrCMb0v02eAjVfwhBfOhcMpAHPqey8FAOIr4Vkp3OKDqct-BNANXBeO8zquX2VbDBgV-F0JaxHi31CBmAqH5LbtZo1TIVZqShWioDT5tg" />
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 text-white text-xs font-bold">
                                <span className="material-symbols-outlined text-sm fill-current">star</span> 4.9
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-60"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Indonesia</p>
                                <h4 className="text-white text-2xl font-bold">Ubud Spiritual Journey</h4>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-slate-300 text-sm flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 6 hours</span>
                                    <span className="text-white font-bold text-lg">From $85</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                            <img alt="Destination" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJUs-pw4J3cA1m25nNFTGpVscTDETHaZQc3AH_X9noSFJrFFAccih_lpGmPVRAJUUbAYg06qORXB2XT6t6koE0sx2StfOo7bxSq3bLKKQK5c90cX5N6NWrU_Jdg1Kzq19IH4cTktLExvjTOkHwMA_BG3r-gRncgqu95IrDmzgzvpY8z9KmjbOA8c1OYKturouMPEm4IioSuOkmRTAS0VgUXA9dnbeaM4eKb490j4lGpPZI4EivsJaXj3_8uSRMe7kumB2gvgqGUyQZ" />
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 text-white text-xs font-bold">
                                <span className="material-symbols-outlined text-sm fill-current">star</span> 4.8
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-60"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Greece</p>
                                <h4 className="text-white text-2xl font-bold">Sunset Catamaran Cruise</h4>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-slate-300 text-sm flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 5 hours</span>
                                    <span className="text-white font-bold text-lg">From $120</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                            <img alt="Destination" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9lMuQXQwE731S_LYBONwDVXn_mlGF7pi4ZPbFRvTM5bzVcBzLn_31NCssVPcEbEEZ10IaVP2t3n72JQj4F70JJuPCIuWL3ih46PeW7nQ3DeE_BRwwovpOhcasbuvUViezdPdbNnDsl0H0pjKEU5Z7kxTi5iJrk2R4-Kw-WEP6Od5IiWGdp9_HL8LcjaXbbpPuDVDgymz6JDbDD1KjfzWAJypEJuqLVpG6mH88dB45rm8EkC_Zx_Tiuf6ysOTLEvc7MPzMegEMSnx_" />
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 text-white text-xs font-bold">
                                <span className="material-symbols-outlined text-sm fill-current">star</span> 5.0
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-60"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Japan</p>
                                <h4 className="text-white text-2xl font-bold">Hidden Tea House Walk</h4>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-slate-300 text-sm flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 4 hours</span>
                                    <span className="text-white font-bold text-lg">From $95</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="px-6 lg:px-20 py-16 bg-[#112240]/50 mb-10 border-y border-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Want 15% off your first excursion?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Join our community of over 50,000 travelers and get exclusive deals delivered to your inbox weekly.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <input className="h-14 px-6 rounded-lg bg-background-light dark:bg-slate-800 border-primary/20 focus:ring-primary min-w-[300px]" placeholder="Enter your email" type="email" />
                        <button className="h-14 px-10 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all">Subscribe Now</button>
                    </div>
                    <p className="mt-4 text-sm text-slate-500 italic">No spam, just inspiration. Unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    );
}
