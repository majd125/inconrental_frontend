export default function Catalog() {
    return (
        <div className="flex-1 px-6 md:px-20 py-8 max-w-7xl mx-auto w-full">
            {/* Hero Section */}
            <div className="flex flex-col gap-4 mb-10">
                <h1 className="text-slate-900 dark:text-slate-100 text-5xl font-black leading-tight tracking-tighter">
                    The Elite <span className="text-primary">Collection</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                    Uncompromising performance meets absolute luxury. Select from our curated fleet of the world's most prestigious vehicles.
                </p>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 transition-all group">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Category</p>
                    <span className="material-symbols-outlined text-primary text-lg group-hover:rotate-180 transition-transform">expand_more</span>
                </button>
                <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 transition-all group">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Price Range</p>
                    <span className="material-symbols-outlined text-primary text-lg group-hover:rotate-180 transition-transform">expand_more</span>
                </button>
                <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 transition-all group">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Transmission</p>
                    <span className="material-symbols-outlined text-primary text-lg group-hover:rotate-180 transition-transform">expand_more</span>
                </button>
                <div className="h-6 w-px bg-primary/20 mx-2 hidden md:block"></div>
                <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-white px-6 transition-all shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-lg">tune</span>
                    <p className="text-sm font-bold">Advanced Search</p>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-primary/10 mb-8 overflow-x-auto">
                <div className="flex gap-10 min-w-max">
                    <a className="border-b-2 border-primary pb-4 text-primary font-bold text-sm tracking-wide" href="#">ALL VEHICLES</a>
                    <a className="border-b-2 border-transparent pb-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-bold text-sm tracking-wide transition-all" href="#">SEDANS</a>
                    <a className="border-b-2 border-transparent pb-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-bold text-sm tracking-wide transition-all" href="#">SUVS</a>
                    <a className="border-b-2 border-transparent pb-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-bold text-sm tracking-wide transition-all" href="#">SPORTS</a>
                    <a className="border-b-2 border-transparent pb-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-bold text-sm tracking-wide transition-all" href="#">CONVERTIBLES</a>
                </div>
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Car Card 1 */}
                <div className="car-card group flex flex-col bg-slate-50 dark:bg-primary/5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                    <div className="relative overflow-hidden aspect-[16/9]">
                        <div className="car-image w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRd3tP6z43TgKFSg4z9dxdefNJXm6YjEuzsHo9W7gFkWaAUP96pME8BPeFIFxMPqe-w-edJCXq8R8beBUtxR9npm9YxvY4usgvWKCwNlnh2P9q1dBmkWxfZOI3VTga9AKeHyZLKbM5OdozJc1zgt2C53TjEtqfe6NG2TYYGc6eqmkRBaGCxrkgHbwHbyjYpC9bv9hGKOb94ogqrQYjNicavi_jfNNZw09XgIgJUPYd6IfHaJfzFhUNFTmcJYswim-IZn1-pQ5enNMw")' }}></div>
                        <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Premium</div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Rolls-Royce Ghost</h3>
                                <p className="text-primary font-medium text-sm">Luxury Sedan</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-slate-100 text-xl font-black">$850</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ day</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-primary/10 pt-4">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                                <span>Automatic</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                                <span>V12</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">group</span>
                                <span>4 Seats</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Card 2 */}
                <div className="car-card group flex flex-col bg-slate-50 dark:bg-primary/5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                    <div className="relative overflow-hidden aspect-[16/9]">
                        <div className="car-image w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlHxgES_M5sbTLDzHfv0tKkRexXbXD8LG9REFNh4yTk9DOlOJ1fDN4x4lsD1VCtyH2oe6CHw28Yc6KOEvi2hjMhxy70dP8u2qAOAZ6ORbEFwLtEXdrsKstwawx4wRk5SS1atG2iFVBaU6RysrWMKsOXvdjqB0e7queJ0j4GYm2T5a7T_6SaFAdQ03_YF4ljuvbETfyYW-fR9r93D_7q0HE8O77OsVtNfDhendJE699GhV7PbrphJyjjeXYoug2ynuMNcpJu5LVhVb7")' }}></div>
                        <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Trending</div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Lamborghini Urus</h3>
                                <p className="text-primary font-medium text-sm">Super SUV</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-slate-100 text-xl font-black">$750</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ day</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-primary/10 pt-4">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                                <span>Automatic</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                                <span>V8 Turbo</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">group</span>
                                <span>5 Seats</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Card 3 */}
                <div className="car-card group flex flex-col bg-slate-50 dark:bg-primary/5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                    <div className="relative overflow-hidden aspect-[16/9]">
                        <div className="car-image w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB22Xdk_cRNk-mG5UDcZroYGAdSNh1hHEUrnxZMCiJFKungUub074K2Ker9saPM9Qpblkoa24fixj1M3pPAq-A_cxIDmcJ9Nmkrxw6facV7K_6yv48UVxywiGJD3Inmlxdjab2eLBX8DSNnV3q8yNbd6kd4fsTNwjMWnqkJR6eEULW7gr_BKPwA1oBlq-5CWCiSADV0BDNDPK5R6XOTELwvApBoUOuNbe-Ei-n1wHp4_kvJIF6bVlWmBdJFv7j74WaJsckAJOcIHJKo")' }}></div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Ferrari F8 Tributo</h3>
                                <p className="text-primary font-medium text-sm">Hyper Sports</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-slate-100 text-xl font-black">$950</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ day</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-primary/10 pt-4">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                                <span>DCT</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                                <span>V8 Twin</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">group</span>
                                <span>2 Seats</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Card 4 */}
                <div className="car-card group flex flex-col bg-slate-50 dark:bg-primary/5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                    <div className="relative overflow-hidden aspect-[16/9]">
                        <div className="car-image w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAXrRnh6pwryaAHwEdAOdlDXSxY_8hnWYWXqcOD1VpwLM76AvGfko4b8IWu4KIBvkACcyTilwXBZsUvLEY8SCitiurpvgS1JeOJ9FJuckbJwvjpK8z0nwpm2MY52RtWNAddaoE8h2O07gaW0--iF62GkeNHSqo20Vp1DIyu09wF86PD8pogNhCVSesU4d1tELT_nOGVivLryGaI9zU-HVjcrgxTuSXNNdBAaZsCXKuTPfRjS2rh74NKzSMQABmGLGcUee5Ik8omy1ho")' }}></div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Porsche 911 Carrera</h3>
                                <p className="text-primary font-medium text-sm">Modern Classic</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-slate-100 text-xl font-black">$600</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ day</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-primary/10 pt-4">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                                <span>PDK</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                                <span>Flat-6</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">group</span>
                                <span>4 Seats</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Card 5 */}
                <div className="car-card group flex flex-col bg-slate-50 dark:bg-primary/5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                    <div className="relative overflow-hidden aspect-[16/9]">
                        <div className="car-image w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6-MQ64B7KTCo9heS23z5qa4Er6_UESscJOvztzeWNYNdiUqOW0yiK0x8aShIJ3jnLa4XbuEZfMmtw5ZBfOujRxrSD_WS3YahgRJPq9DbSI1u9_AZBWiUhYCZYxoecgFb2pLQQoVPrzpk00-PqG9LSR9ZZ3BkLbQ3hmxFci3vR8JRcmYUV5ZedfHGnoWqvCVZssj8OfhmVBiVjaTUkuicGBbodujdtgPpNFb8WHRQaQPxiWgA7jlBp-LnDkBsK_h7rmiM18spsBh_w")' }}></div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Bentley GT</h3>
                                <p className="text-primary font-medium text-sm">Grand Tourer</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-slate-100 text-xl font-black">$700</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ day</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-primary/10 pt-4">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                                <span>Automatic</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                                <span>W12</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">group</span>
                                <span>4 Seats</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Card 6 */}
                <div className="car-card group flex flex-col bg-slate-50 dark:bg-primary/5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                    <div className="relative overflow-hidden aspect-[16/9]">
                        <div className="car-image w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPkYbxnyZ2sMi1CEc6GRRM7y2xbSyua4owi2PGhzb4KRAncPdYrA0XXW00AIhb7OWYyZFEVl4YuVYUzKh_br1cx8pnheha7c0lfU1CogGYx5tMFZzFHtYCvYOiDh7LZEBykb95Vbv3B7SIsTifG8BvK4BoaAB17xi4m47lyeDO38tsFQ-oZ27CSvp-DCKg0mFQ52X2HuaeNm4n-w3v0ZeqG4EGbl6kvb6WEtCqpKavu9uggnQg4j979W_Orgf4RjfLXUcO-JzVIibq")' }}></div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Range Rover</h3>
                                <p className="text-primary font-medium text-sm">Luxury SUV</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-slate-100 text-xl font-black">$500</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ day</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm border-t border-primary/10 pt-4">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                                <span>Automatic</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                                <span>V8 Super</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg">group</span>
                                <span>5 Seats</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Load More */}
            <div className="mt-12 flex justify-center">
                <button className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                    Load More Experiences
                </button>
            </div>
        </div>
    );
}
