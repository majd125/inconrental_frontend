'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

export default function Transfers() {
    const [transferState, setTransferState] = useState({
        pickup: '',
        destination: '',
        datetime: '',
        adults: 1,
        children: 0,
        babies: 0,
        tripType: 'simple', // 'simple', 'same_day', 'diff_days'
        waitDuration: 'half', // 'half' or 'full'
        returnDatetime: '',
    });

    const { showNotification } = useNotification();
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            showNotification('You must be logged in to request a transfer.', 'error');
            router.push('/login');
            return;
        }

        try {
            const token = authService.getToken();
            const response = await fetch(`${API_URL}/transfer-reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transferState)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send request');
            }

            showNotification('Your transfer request has been sent! An admin will review it and provide a quote soon.', 'success');
            router.push('/reservations');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    return (
        <div className="flex-1">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] w-full flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLgiRI61M0kg4AkMIDh9ZfQujbepPhlqSt00pwUzvGJgbK6sOWIkCTh5WpyPhEosZcmjfIO1Dv1eL6xlm6sCtSrYJ4-3S-ZzA4LeMrL_4bEae0zrNJcxJtFvaI1KFP2PFfSy8dfHIzZPTH2fIgUzTMniYymICrpGkPMfnmCkbH9DTKM6USiM0tf_RQuV4-YBFtti6nWqtH2haIlhCNx5Xar9DUZKAR-1rOM4L1sj2uppN4cxCltFaJJjn2xOh46lNYZBMJSZHaYDkT')" }}></div>
                <div className="relative z-10 px-6 md:px-20 max-w-4xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-black text-xs font-bold uppercase tracking-widest mb-4">World-Class Excellence</span>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">Exclusivity in Every Mile</h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-light">Experience unparalleled comfort and professional service tailored to your schedule. Premium private transfers for those who value time and luxury.</p>
                </div>
            </section>

            {/* Booking Section */}
            <section className="relative z-20 -mt-20 px-6 md:px-20 pb-20">
                <div className="bg-background-light rounded-xl shadow-2xl border border-gray-200 p-8 dark:bg-white">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-black text-3xl">calendar_month</span>
                        <h2 className="text-2xl font-bold">Reserve Your Transfer</h2>
                    </div>
                    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                        {/* Top inputs: Pickup, Dest, Date */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Pickup */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Pick-up Location</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors text-2xl">location_on</span>
                                    <input required value={transferState.pickup} onChange={e => setTransferState({...transferState, pickup: e.target.value})} className="w-full pl-12 pr-4 h-[52px] rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none text-gray-900 font-bold placeholder:text-gray-500 placeholder:font-medium shadow-sm" placeholder="Airport, Hotel, or Address" type="text" />
                                </div>
                            </div>
                            {/* Destination */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Destination</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors text-2xl">navigation</span>
                                    <input required value={transferState.destination} onChange={e => setTransferState({...transferState, destination: e.target.value})} className="w-full pl-12 pr-4 h-[52px] rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none text-gray-900 font-bold placeholder:text-gray-500 placeholder:font-medium shadow-sm" placeholder="Where are you going?" type="text" />
                                </div>
                            </div>
                            {/* Date & Time */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Date & Time</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors text-2xl">event</span>
                                    <input required value={transferState.datetime} onChange={e => setTransferState({...transferState, datetime: e.target.value})} className="w-full pl-12 pr-4 h-[52px] rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none text-gray-900 font-bold shadow-sm" type="datetime-local" />
                                </div>
                            </div>
                        </div>

                        {/* Trip Options */}
                        <div className="flex flex-col gap-6 bg-gray-50/50 p-8 rounded-2xl border border-gray-200 shadow-inner">
                            <h3 className="text-gray-900 text-[11px] font-black uppercase tracking-widest mb-2 px-3 py-1 bg-white inline-block w-fit rounded-full border border-gray-100">Trip Journey</h3>
                            <div className="flex flex-wrap gap-10 lg:gap-16">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <input type="radio" name="tripType" value="simple" checked={transferState.tripType === 'simple'} onChange={(e) => setTransferState({...transferState, tripType: e.target.value})} className="accent-black h-5 w-5 cursor-pointer" />
                                    <span className="text-gray-900 text-sm font-bold group-hover:text-black transition-colors">Aller simple</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <input type="radio" name="tripType" value="same_day" checked={transferState.tripType === 'same_day'} onChange={(e) => setTransferState({...transferState, tripType: e.target.value})} className="accent-black h-5 w-5 cursor-pointer" />
                                    <span className="text-gray-900 text-sm font-bold group-hover:text-black transition-colors">Aller et retour (Même jour)</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <input type="radio" name="tripType" value="diff_days" checked={transferState.tripType === 'diff_days'} onChange={(e) => setTransferState({...transferState, tripType: e.target.value})} className="accent-black h-5 w-5 cursor-pointer" />
                                    <span className="text-gray-900 text-sm font-bold group-hover:text-black transition-colors">Aller et retour (Dates différentes)</span>
                                </label>
                            </div>
                            
                            {/* Conditional Inputs */}
                            {transferState.tripType === 'same_day' && (
                                <div className="mt-4 pl-6 border-l-4 border-black/10 flex flex-col sm:flex-row gap-8 animate-in fade-in slide-in-from-left-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="waitDuration" value="half" checked={transferState.waitDuration === 'half'} onChange={(e) => setTransferState({...transferState, waitDuration: e.target.value})} className="accent-black h-4 w-4" />
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wide group-hover:text-black transition-colors">Half Day (Less than 6h)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="waitDuration" value="full" checked={transferState.waitDuration === 'full'} onChange={(e) => setTransferState({...transferState, waitDuration: e.target.value})} className="accent-black h-4 w-4" />
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wide group-hover:text-black transition-colors">Full Day (More than 8h)</span>
                                    </label>
                                </div>
                            )}

                            {transferState.tripType === 'diff_days' && (
                                <div className="mt-4 pl-6 border-l-4 border-black/10 flex flex-col gap-3 max-w-md animate-in fade-in slide-in-from-left-4">
                                    <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Return Date & Time</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors text-2xl">event</span>
                                        <input required type="datetime-local" className="w-full pl-12 pr-4 h-[52px] rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all outline-none text-gray-900 font-bold shadow-sm" value={transferState.returnDatetime} onChange={(e) => setTransferState({...transferState, returnDatetime: e.target.value})} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Passengers listExactly like Excursions */}
                        <div className="flex flex-col gap-4">
                             <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Passengers Setup</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50/50 p-8 rounded-2xl border border-gray-200 shadow-inner">
                                {/* Adultes */}
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div>
                                        <span className="text-gray-900 text-base font-black block">Adultes</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Price</span>
                                    </div>
                                    <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                        <button type="button" className="text-gray-900 hover:bg-black hover:text-white rounded-md size-9 flex items-center justify-center transition-all shadow-sm active:scale-90" disabled={transferState.adults <= 1} onClick={() => setTransferState(p => ({...p, adults: p.adults - 1}))}><span className="material-symbols-outlined">remove</span></button>
                                        <span className="w-10 text-center text-lg font-black text-gray-900">{transferState.adults}</span>
                                        <button type="button" className="text-gray-900 hover:bg-black hover:text-white rounded-md size-9 flex items-center justify-center transition-all shadow-sm active:scale-90" onClick={() => setTransferState(p => ({...p, adults: p.adults + 1}))}><span className="material-symbols-outlined">add</span></button>
                                    </div>
                                </div>
                                {/* Enfants */}
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div>
                                        <span className="text-gray-900 text-base font-black block">Enfants</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">7 - 12 Years</span>
                                    </div>
                                    <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                        <button type="button" className="text-gray-900 hover:bg-black hover:text-white rounded-md size-9 flex items-center justify-center transition-all shadow-sm active:scale-90" disabled={transferState.children <= 0} onClick={() => setTransferState(p => ({...p, children: p.children - 1}))}><span className="material-symbols-outlined">remove</span></button>
                                        <span className="w-10 text-center text-lg font-black text-gray-900">{transferState.children}</span>
                                        <button type="button" className="text-gray-900 hover:bg-black hover:text-white rounded-md size-9 flex items-center justify-center transition-all shadow-sm active:scale-90" onClick={() => setTransferState(p => ({...p, children: p.children + 1}))}><span className="material-symbols-outlined">add</span></button>
                                    </div>
                                </div>
                                {/* Bébés */}
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div>
                                        <span className="text-gray-900 text-base font-black block">Bébés</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">0 - 6 Years</span>
                                    </div>
                                    <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                        <button type="button" className="text-gray-900 hover:bg-black hover:text-white rounded-md size-9 flex items-center justify-center transition-all shadow-sm active:scale-90" disabled={transferState.babies <= 0} onClick={() => setTransferState(p => ({...p, babies: p.babies - 1}))}><span className="material-symbols-outlined">remove</span></button>
                                        <span className="w-10 text-center text-lg font-black text-gray-900">{transferState.babies}</span>
                                        <button type="button" className="text-gray-900 hover:bg-black hover:text-white rounded-md size-9 flex items-center justify-center transition-all shadow-sm active:scale-90" onClick={() => setTransferState(p => ({...p, babies: p.babies + 1}))}><span className="material-symbols-outlined">add</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button type="submit" className="w-full md:w-auto bg-black hover:bg-black/90 text-white font-black text-xs uppercase tracking-[0.3em] py-6 px-16 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-black/20 group active:scale-95">
                                REQUEST QUOTE
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
                        <p className="text-gray-400 dark:text-gray-500">From luxury sedans to spacious executive vans, we provide the perfect vehicle for every occasion, maintained to the highest standards of safety and cleanliness.</p>
                    </div>
                    <a className="text-black font-bold flex items-center gap-1 hover:underline" href="#">
                        View All Vehicles <span className="material-symbols-outlined">chevron_right</span>
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Car 1 */}
                    <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-200 transition-all dark:bg-white">
                        <div className="aspect-[16/10] overflow-hidden">
                            <img alt="Car image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPYTReAD2cF7007ldMQoqKyLntlSOQyxb3lftP0wQ6rbedvBlCL7xlp-6Z0IrXjI3xiuntlCeO6NPiUehxOj02svwkIo7ZYL-u_uTsFnnVzVd9WGszbYwZXxHdbS6C4gOdNaXXNWEUXGpA3R_CfJhLP3rwY48styR73I2l3q5YdOL67pFd-UxKUFJXMeHbi5F6YolKD4PAecWWT0ip6N1GJeeVtx78kuQwKbOOWl0RBVEk3ZlOvWSr_AjDvFl2z5YZ8ADANvDXfSgV" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">First Class Sedan</h3>
                                <span className="text-black font-bold">120+ TND</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Mercedes S-Class or BMW 7 Series</p>
                            <div className="flex gap-4 text-gray-400 dark:text-gray-500 text-xs">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> 3 Max</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">luggage</span> 2 Bags</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">wifi</span> Free WiFi</span>
                            </div>
                        </div>
                    </div>
                    {/* Car 2 */}
                    <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-200 transition-all dark:bg-white">
                        <div className="aspect-[16/10] overflow-hidden">
                            <img alt="Car image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUBPd_kcCoQycPU7Dwc0Nl-REja69Icu_O3erPjcBgJAMwr6q7YWvz31Jv8CQ3C7hJCUIXagipPkVlBTZMh1a9E7n3O4d8NIVCiEzBozZ_qJEJLcEPkCr5sB0hYZ7qpqxk4WwadbUg50nZgY9ohqYHl3_fCeMYWeNnNQpl5y5G8K2lei1-1MoHQkSsug9QeQcB67YlHHffBL-4DrcX_MIWcIZCqY0jE1VW9lOvfk0wD3yry-I8tlecbp8BqgKXH0urtQUiNBSuvxNG" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">Business SUV</h3>
                                <span className="text-black font-bold">160+ TND</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Cadillac Escalade or Range Rover</p>
                            <div className="flex gap-4 text-gray-400 dark:text-gray-500 text-xs">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> 6 Max</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">luggage</span> 5 Bags</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">water_drop</span> Refreshments</span>
                            </div>
                        </div>
                    </div>
                    {/* Car 3: Mercedes V-Class */}
                    <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-200 transition-all dark:bg-white">
                        <div className="aspect-[16/10] overflow-hidden">
                            <img alt="Mercedes V-Class" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="/Mercedes_VClass.jpg" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">Mercedes V-Class</h3>
                                <span className="text-black font-bold">200+ TND</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Premium Executive Van</p>
                            <div className="flex gap-4 text-gray-400 dark:text-gray-500 text-xs">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> 7 Max</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">luggage</span> 6 Bags</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">tv</span> Entertainment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px-6 md:px-20 py-20 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                        </div>
                        <h4 className="text-lg font-bold">Licensed Chauffeurs</h4>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Professional, vetted drivers with extensive local knowledge and background checks.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-3xl">update</span>
                        </div>
                        <h4 className="text-lg font-bold">Real-time Tracking</h4>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Monitor your ride in real-time and get automated flight delay adjustments.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-3xl">sell</span>
                        </div>
                        <h4 className="text-lg font-bold">Fixed Pricing</h4>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">No hidden fees or surge pricing. The price you see is the price you pay.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-black">
                            <span className="material-symbols-outlined text-3xl">support_agent</span>
                        </div>
                        <h4 className="text-lg font-bold">24/7 Support</h4>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Dedicated concierge team available around the clock for any assistance.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
