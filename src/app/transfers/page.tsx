export default function Transfers() {
    return (
        <div className="flex-1">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] w-full flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLgiRI61M0kg4AkMIDh9ZfQujbepPhlqSt00pwUzvGJgbK6sOWIkCTh5WpyPhEosZcmjfIO1Dv1eL6xlm6sCtSrYJ4-3S-ZzA4LeMrL_4bEae0zrNJcxJtFvaI1KFP2PFfSy8dfHIzZPTH2fIgUzTMniYymICrpGkPMfnmCkbH9DTKM6USiM0tf_RQuV4-YBFtti6nWqtH2haIlhCNx5Xar9DUZKAR-1rOM4L1sj2uppN4cxCltFaJJjn2xOh46lNYZBMJSZHaYDkT')" }}></div>
                <div className="relative z-10 px-6 md:px-20 max-w-4xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">World-Class Excellence</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">Exclusivity in Every Mile</h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light">Experience unparalleled comfort and professional service tailored to your schedule. Premium private transfers for those who value time and luxury.</p>
                </div>
            </section>

            {/* Booking Section */}
            <section className="relative z-20 -mt-20 px-6 md:px-20 pb-20">
                <div className="bg-background-light rounded-xl shadow-2xl border border-primary/10 p-8 dark:bg-slate-800">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
                        <h2 className="text-2xl font-bold">Reserve Your Transfer</h2>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Pickup */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Pick-up Location</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">location_on</span>
                                <input className="w-full pl-10 pr-4 h-14 rounded-lg bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-800 dark:text-slate-100" placeholder="Airport, Hotel, or Address" type="text" />
                            </div>
                        </div>
                        {/* Destination */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Destination</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">navigation</span>
                                <input className="w-full pl-10 pr-4 h-14 rounded-lg bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-800 dark:text-slate-100" placeholder="Where are you going?" type="text" />
                            </div>
                        </div>
                        {/* Date & Time */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Date & Time</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">event</span>
                                <input className="w-full pl-10 pr-4 h-14 rounded-lg bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-800 dark:text-slate-100" type="datetime-local" />
                            </div>
                        </div>
                        {/* Passengers */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Passengers</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">group</span>
                                <select className="w-full pl-10 pr-4 h-14 rounded-lg bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-800 dark:text-slate-100 appearance-none">
                                    <option>1 Passenger</option>
                                    <option>2 Passengers</option>
                                    <option>3 Passengers</option>
                                    <option>4+ Passengers</option>
                                </select>
                            </div>
                        </div>
                        <div className="lg:col-span-4 flex justify-end mt-4">
                            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-12 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                                Check Availability
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Fleet Preview */}
            <section className="px-6 md:px-20 py-20 bg-background-light/50 dark:bg-background-dark/50">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Executive Fleet</h2>
                        <p className="text-slate-600 dark:text-slate-400">From luxury sedans to spacious executive vans, we provide the perfect vehicle for every occasion, maintained to the highest standards of safety and cleanliness.</p>
                    </div>
                    <a className="text-primary font-bold flex items-center gap-1 hover:underline" href="#">
                        View All Vehicles <span className="material-symbols-outlined">chevron_right</span>
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Car 1 */}
                    <div className="group bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/30 transition-all dark:bg-slate-800">
                        <div className="aspect-[16/10] overflow-hidden">
                            <img alt="Car image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPYTReAD2cF7007ldMQoqKyLntlSOQyxb3lftP0wQ6rbedvBlCL7xlp-6Z0IrXjI3xiuntlCeO6NPiUehxOj02svwkIo7ZYL-u_uTsFnnVzVd9WGszbYwZXxHdbS6C4gOdNaXXNWEUXGpA3R_CfJhLP3rwY48styR73I2l3q5YdOL67pFd-UxKUFJXMeHbi5F6YolKD4PAecWWT0ip6N1GJeeVtx78kuQwKbOOWl0RBVEk3ZlOvWSr_AjDvFl2z5YZ8ADANvDXfSgV" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">First Class Sedan</h3>
                                <span className="text-primary font-bold">$120+</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">Mercedes S-Class or BMW 7 Series</p>
                            <div className="flex gap-4 text-slate-600 dark:text-slate-400 text-xs">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> 3 Max</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">luggage</span> 2 Bags</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">wifi</span> Free WiFi</span>
                            </div>
                        </div>
                    </div>
                    {/* Car 2 */}
                    <div className="group bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/30 transition-all dark:bg-slate-800">
                        <div className="aspect-[16/10] overflow-hidden">
                            <img alt="Car image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUBPd_kcCoQycPU7Dwc0Nl-REja69Icu_O3erPjcBgJAMwr6q7YWvz31Jv8CQ3C7hJCUIXagipPkVlBTZMh1a9E7n3O4d8NIVCiEzBozZ_qJEJLcEPkCr5sB0hYZ7qpqxk4WwadbUg50nZgY9ohqYHl3_fCeMYWeNnNQpl5y5G8K2lei1-1MoHQkSsug9QeQcB67YlHHffBL-4DrcX_MIWcIZCqY0jE1VW9lOvfk0wD3yry-I8tlecbp8BqgKXH0urtQUiNBSuvxNG" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">Business SUV</h3>
                                <span className="text-primary font-bold">$160+</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">Cadillac Escalade or Range Rover</p>
                            <div className="flex gap-4 text-slate-600 dark:text-slate-400 text-xs">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> 6 Max</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">luggage</span> 5 Bags</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">water_drop</span> Refreshments</span>
                            </div>
                        </div>
                    </div>
                    {/* Car 3 */}
                    <div className="group bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-primary/30 transition-all dark:bg-slate-800">
                        <div className="aspect-[16/10] overflow-hidden">
                            <img alt="Car image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrgXkmwciKA1mMZZ0mCr-czvFbYsyI02g9DQuFHHFjOJEQzSOdT-REGQe6Y6yKJTc7YTJ6vdLuWGgtl6bczEzy7GaWgeL_2XIwpat5jyeDOx5bPc5yVyaeLt57FI-TfpV5I7PlFd0Optdr1yLLgQvFO75TF_XMY3Pnh4MWhCJ_lootSlqfh6fnhGjzk-36CZpY5whWrRZke74MH0-UwXrJXLvBUbB3cI9vZ9RILc0C5sU0mxt5ssDeYLKAxzXH8wcJSW_3o9IF213c" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">Executive Sprinter</h3>
                                <span className="text-primary font-bold">$250+</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">Mercedes-Benz Sprinter Executive</p>
                            <div className="flex gap-4 text-slate-600 dark:text-slate-400 text-xs">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> 14 Max</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">luggage</span> 12 Bags</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">tv</span> Entertainment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 md:px-20 py-20 border-t border-primary/10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                        </div>
                        <h4 className="text-lg font-bold">Licensed Chauffeurs</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Professional, vetted drivers with extensive local knowledge and background checks.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">update</span>
                        </div>
                        <h4 className="text-lg font-bold">Real-time Tracking</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Monitor your ride in real-time and get automated flight delay adjustments.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">sell</span>
                        </div>
                        <h4 className="text-lg font-bold">Fixed Pricing</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">No hidden fees or surge pricing. The price you see is the price you pay.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">support_agent</span>
                        </div>
                        <h4 className="text-lg font-bold">24/7 Support</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Dedicated concierge team available around the clock for any assistance.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
