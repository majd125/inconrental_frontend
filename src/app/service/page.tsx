export default function ServiceDetail() {
    return (
        <div className="flex-1">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2wK_oOJjS-mYJ9AubhKsPf8sAKRRX9HOBLaN2jKvUH7LfEf2Ebzdw_cjeS71HBGHJgAS99FLcpnSlsFyfKtaSTKkd4oxBEy7FAllclQLQt0sNKule3dzfxK7daxf52f-hWRJP_isdpDyybomrEKnXNnCk7nOiqJPRF2a6nc2u9XerUG2htSx2NDSQ54WUjACflYuBaQroC23sWBIWFIjLweWXAiD6HmobQlPut-MZHUlz7lW91NFbGT9OZHBK-j4Pz24e48Wwlz2B')" }}>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest">Premium Collection</span>
                            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest">Available Now</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">Coastal Amalfi Grand Tour</h2>
                        <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-light">Experience the breath-taking Amalfi Coast in a custom-engineered masterpiece. Pure performance meets Mediterranean elegance.</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Quick Specs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1 p-5 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5">
                                <span className="material-symbols-outlined text-primary mb-2">timer</span>
                                <p className="text-xs uppercase tracking-tighter text-slate-500 dark:text-slate-400 font-bold">Duration</p>
                                <p className="text-xl font-bold">8 Hours</p>
                            </div>
                            <div className="flex flex-col gap-1 p-5 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5">
                                <span className="material-symbols-outlined text-primary mb-2">distance</span>
                                <p className="text-xs uppercase tracking-tighter text-slate-500 dark:text-slate-400 font-bold">Distance</p>
                                <p className="text-xl font-bold">145 km</p>
                            </div>
                            <div className="flex flex-col gap-1 p-5 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5">
                                <span className="material-symbols-outlined text-primary mb-2">group</span>
                                <p className="text-xs uppercase tracking-tighter text-slate-500 dark:text-slate-400 font-bold">Capacity</p>
                                <p className="text-xl font-bold">2 Persons</p>
                            </div>
                            <div className="flex flex-col gap-1 p-5 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5">
                                <span className="material-symbols-outlined text-primary mb-2">speed</span>
                                <p className="text-xs uppercase tracking-tighter text-slate-500 dark:text-slate-400 font-bold">Difficulty</p>
                                <p className="text-xl font-bold">Pro-Level</p>
                            </div>
                        </div>

                        {/* Description */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                The Experience
                            </h3>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                                <p>Embark on a journey that transcends ordinary travel. Our Coastal Amalfi Grand Tour is meticulously designed for those who demand the pinnacle of automotive excellence and natural beauty. You'll navigate the iconic winding roads of the Italian coastline, where every turn reveals a new masterpiece of nature.</p>
                                <p>Starting from our private lounge in Sorrento, you'll be briefed by our professional driving instructors before taking the helm of a vehicle engineered for precision. The itinerary includes curated stops at hidden viewpoints, a private lunch at a Michelin-starred terrace, and a return journey as the sun sets over the Tyrrhenian Sea.</p>
                            </div>
                        </section>

                        {/* Features List */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                What's Included
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                    <div>
                                        <p className="font-bold">Full Insurance Coverage</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Comprehensive protection for complete peace of mind.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                    <div>
                                        <p className="font-bold">Private Concierge Support</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">24/7 assistance throughout your journey.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                    <div>
                                        <p className="font-bold">Gourmet Catering</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Curated refreshments and lunch included.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                    <div>
                                        <p className="font-bold">Professional Photography</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Digital album of your coastal adventure.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Map Integration Placeholder */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                Route Overview
                            </h3>
                            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                                <div className="absolute inset-0 bg-cover bg-center opacity-70 grayscale" data-location="Amalfi Coast, Italy" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBc2fHqHoUURJMiqfJu7ukim-xKx5jQTR804uIKl2kLZsQiyzAmHGo9rLvPJr7iWzmZV8r0XKrhttX-L9bjCB5cRJ0r30CxtND6_rngN3xNCqXgtbuXaswv8INR6qwcDo1fDWBauAtlgHMIPVcBzdQSvQb3HG09MmZLWJKKkJHJYqlKNE2_2lCSeWxt4Mkxa7VAoubDDZwhmP7s0efrn0JF7s7kV2EkBFjMMyb13iQ3Nynq4NV8CfenfQFZDvp9I_jeZhLJGWXtzAE_')" }}>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-background-dark/80 backdrop-blur px-6 py-3 rounded-full text-white border border-white/20">
                                        <p className="text-sm font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">location_on</span>
                                            Explore the Route
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Booking Module */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                <div className="mb-6 flex items-end gap-2">
                                    <span className="text-4xl font-black text-primary">$1,250</span>
                                    <span className="text-slate-500 dark:text-slate-400 mb-1">/ per person</span>
                                </div>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Date</label>
                                        <div className="relative">
                                            <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-4 pr-10 text-sm focus:ring-primary focus:border-primary" type="date" />
                                            <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400">calendar_month</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Passengers</label>
                                            <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 text-sm focus:ring-primary focus:border-primary">
                                                <option>1 Adult</option>
                                                <option>2 Adults</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Transmission</label>
                                            <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 text-sm focus:ring-primary focus:border-primary">
                                                <option>Automatic</option>
                                                <option>Manual</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="py-4 border-t border-b border-slate-100 dark:border-slate-800 my-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Base Price (2 Adults)</span>
                                            <span>$2,500</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Insurance Waiver</span>
                                            <span className="text-green-500">Included</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <span>Total Amount</span>
                                            <span>$2,500</span>
                                        </div>
                                    </div>
                                    <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group" type="submit">
                                        Book Experience
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                    <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-4">Free cancellation up to 48h before start</p>
                                </form>
                            </div>
                            {/* Secondary CTA */}
                            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-6">
                                <p className="font-bold mb-2">Special Inquiry?</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Need a custom fleet or multi-day itinerary?</p>
                                <a className="text-sm font-bold text-primary flex items-center gap-1 hover:underline" href="#">
                                    Contact our VIP team
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Experiences */}
            <section className="bg-slate-100 dark:bg-primary/5 py-20 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-black mb-2">Similar Adventures</h2>
                            <p className="text-slate-500 dark:text-slate-400">Curated by our expert drive masters</p>
                        </div>
                        <button className="text-primary font-bold hover:underline flex items-center gap-1">
                            View All
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="group overflow-hidden rounded-2xl bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 transition-all hover:shadow-2xl">
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpouxLR8hSxYjo4aoxU5v0WGb3aGe-5rxcBo8vEH2B0sZDiZKmObgz4D1dzPOANQZPSszWvIZDEfYS6FjrkvnlL66gPpy1kzYxLjwHgrce5sz8JbHgPOraH2Y39CfjT11fEZmku0MNO-k9qQJ8O2rTS5jpjnulNYmvg9ZkT4Ie28HylwpLm3oPWoHMbhNygVJ1ANBUqc3L76Q9K-_Mi8RASClJRgd4Bxl67OjIn1_pbaQ5tB28JwMCloqhf921S_5zP8oR4aHBqTqP')" }}>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Pacific Highway Classic</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">Vintage roadster experience through the rolling hills of Big Sur.</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">$890</span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">schedule</span> 6h
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group overflow-hidden rounded-2xl bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 transition-all hover:shadow-2xl">
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUXdSLcoPqPAfw5llBo0WKw9dMmImQcF617sWkEJNzoh7CthBelmSeLpDaZPY29uWkAnHIlS7Y4tngNx5UJHZ8g2QBk1tCDM9vkqpyUB6_aOPdjTS93XbPoKlQwSisx9kxHdxVJyVOCah-of8XAqMb0ty9xjbgnscF4DMHO-xbHVFj0fbo8SKxHGU6Cok53s7TSaWqMQQSrtbYpeJ05BcqMqyy8wI6bSWrS3ivFmB30s4Mr01b4wIHMhNPAN8kIrWbmMaHrZKoPdgX')" }}>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Swiss Alpine Pass</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">Challenge your skills across the highest peaks in the Alps.</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">$1,450</span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">schedule</span> 2 Days
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group overflow-hidden rounded-2xl bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 transition-all hover:shadow-2xl">
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnhSZgrAzCL8We07XaTj5KLxSkLgFjyV_3rdvQKs4QJFPN8FT7jivCGRGic636hmrQVG4tURp0D0srv7dlTrLHq7mfsn75-xN9Vwvx-av8ZaPtR9pCRVt9J1-LCrDB1tTE-vuT6pkNSRuu5WzqhQulgwz-_FUGFmuGGyflBij9nXh_kQjMKD23M4QEyYbXarQTPqP7N-5wGH2851UqA4ZDJ1IodvRgS6BcWs4dvdi7UGmfnQHJBCdBAnkVtOBwhA20buCy_Fmk309i')" }}>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Dubai Desert Dash</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">Sunset dunes and ultra-luxury performance in the heart of UAE.</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">$2,100</span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">schedule</span> 4h
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
