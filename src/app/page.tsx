'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LOCATIONS = [
  "Aéroport international de Tunis-Carthage (TUN)",
  "Aéroport international de Djerba-Zarzis (DJE)",
  "Aéroport international d'Enfidha-Hammamet (NBE)",
  "Aéroport international de Monastir Habib-Bourguiba (MIR)",
  "Our local office in Hammamet Nabeul",
  "Other location"
];

export default function Home() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    lieu_depart: LOCATIONS[0],
    lieu_depart_autre: '',
    lieu_arrivee: LOCATIONS[0],
    lieu_arrivee_autre: '',
    date_debut: '',
    date_fin: '',
    nb_sieges_bebe: 0
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPickup = searchData.lieu_depart === "Other location" 
      ? searchData.lieu_depart_autre 
      : searchData.lieu_depart;
      
    const finalReturn = searchData.lieu_arrivee === "Other location" 
      ? searchData.lieu_arrivee_autre 
      : searchData.lieu_arrivee;

    const query = new URLSearchParams({
      pickup: finalPickup,
      return_loc: finalReturn,
      start: searchData.date_debut,
      end: searchData.date_fin,
      baby_seats: searchData.nb_sieges_bebe.toString()
    }).toString();
    router.push(`/catalog?${query}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to right, rgba(10, 10, 12, 0.9) 20%, rgba(10, 10, 12, 0.4) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxTlLd4jt5UM0mlvA5NxAaj6khYkXJinjy0QkiMF92mMSamHrKsp7z_QK8FzAAMC3FkXJkN5ok2LiBhvRHhit0CSSCwZsowNvg-7g3wwa0Jq-r8CpatfBdZXZrfCgkYCDCzybhV43QUwd-bMfAH7zYDbuDzioVCwpjjPHq7kBb3GIMta7JpS-EbiyBWTQNfq3YLKnidG-mdXv2H6QepZLuTi7pZuaH9MBbUVw9BiBv1UCBiU0eWaAGngGJ0q_lSKGkMOe_vIVbUNmN')" }}></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6 text-left">
            <span className="inline-block py-1 px-3 bg-primary/20 text-primary border border-primary/30 rounded-full text-[11px] font-black uppercase tracking-widest">Premium Experience</span>
            <h2 className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter text-white">
              Drive the <span className="text-primary">Future</span> of Luxury
            </h2>
            <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
              Unrivaled performance meets absolute elegance. Access the world's most exclusive fleet with bespoke concierge service.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/catalog" className="px-8 py-4 bg-primary text-white font-bold rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(215,4,39,0.4)] transition-all">
                View Collection <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                Our Heritage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Module */}
      <section className="relative mt-12 z-10 max-w-7xl mx-auto px-4">
        <div className="bg-background-dark/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            <button className="flex-1 py-4 flex items-center justify-center gap-2 bg-primary text-white font-bold text-[11px] tracking-widest uppercase">
              <span className="material-symbols-outlined text-lg">directions_car</span> Rental
            </button>
            <Link href="/transfers" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-[11px] tracking-widest uppercase bg-white/5">
              <span className="material-symbols-outlined text-lg">local_taxi</span> Transfer
            </Link>
            <Link href="/excursions" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-[11px] tracking-widest uppercase bg-white/5">
              <span className="material-symbols-outlined text-lg">map</span> Excursion
            </Link>
          </div>
          
          <form onSubmit={handleSearch} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Pick-up Location */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">Pick-up Location</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">location_on</span>
                    <select 
                      required
                      value={searchData.lieu_depart}
                      onChange={(e) => setSearchData({...searchData, lieu_depart: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-10 text-white text-[15px] font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all truncate"
                    >
                      {LOCATIONS.map(loc => <option key={loc} value={loc} className="bg-slate-900">{loc}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                  </div>
                  {searchData.lieu_depart === "Other location" && (
                    <input 
                      required
                      type="text"
                      placeholder="Specify pick-up location"
                      className="w-full bg-white/5 border border-primary/40 rounded-xl py-3 px-5 text-white text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-600"
                      value={searchData.lieu_depart_autre}
                      onChange={(e) => setSearchData({...searchData, lieu_depart_autre: e.target.value})}
                    />
                  )}
                </div>
              </div>

              {/* Return Location */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">Drop-off Location</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">near_me</span>
                    <select 
                      required
                      value={searchData.lieu_arrivee}
                      onChange={(e) => setSearchData({...searchData, lieu_arrivee: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-10 text-white text-[15px] font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all truncate"
                    >
                      {LOCATIONS.map(loc => <option key={loc} value={loc} className="bg-slate-900">{loc}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                  </div>
                  {searchData.lieu_arrivee === "Other location" && (
                    <input 
                      required
                      type="text"
                      placeholder="Specify drop-off location"
                      className="w-full bg-white/5 border border-primary/40 rounded-xl py-3 px-5 text-white text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-600"
                      value={searchData.lieu_arrivee_autre}
                      onChange={(e) => setSearchData({...searchData, lieu_arrivee_autre: e.target.value})}
                    />
                  )}
                </div>
              </div>

              {/* Pick-up Date & Time */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">Arrival Date & Time</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">calendar_today</span>
                  <input 
                    required
                    type="datetime-local" 
                    value={searchData.date_debut}
                    onChange={(e) => setSearchData({...searchData, date_debut: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-[15px] font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50" 
                  />
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">Return Date & Time</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">event_repeat</span>
                  <input 
                    required
                    type="datetime-local" 
                    value={searchData.date_fin}
                    onChange={(e) => setSearchData({...searchData, date_fin: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-[15px] font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50" 
                  />
                </div>
              </div>

              {/* Baby Seats */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">Baby Seats ($10/day)</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">child_care</span>
                  <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 flex items-center justify-between">
                    <span className="text-white text-[15px] font-semibold">{searchData.nb_sieges_bebe} Seats</span>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setSearchData({...searchData, nb_sieges_bebe: Math.max(0, searchData.nb_sieges_bebe - 1)})}
                        className="size-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSearchData({...searchData, nb_sieges_bebe: searchData.nb_sieges_bebe + 1})}
                        className="size-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-white/5">
                <div className="flex gap-8">
                    <div className="flex items-center gap-3 text-slate-400 group cursor-help">
                        <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">verified</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">Free Cancellation</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 group cursor-help">
                        <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">payments</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">Pay on Arrival</span>
                    </div>
                </div>
                <button type="submit" className="w-full sm:w-auto px-12 py-4.5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-xl transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group active:scale-95">
                    Check Availability
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 text-left">
            <h3 className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Exquisite Fleet</h3>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Featured <br /><span className="text-primary italic">Vehicles</span></h2>
          </div>
          <div className="flex gap-3">
            <button className="size-14 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary transition-all text-slate-400 hover:text-white shadow-lg">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-14 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary transition-all text-slate-400 hover:text-white shadow-lg">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Vehicle Card 1 */}
          <div className="group bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-700 shadow-2xl text-left">
            <div className="relative h-72 overflow-hidden">
              <img alt="Car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8w4sHQjO2dtSwjV2YwM_yzvLDCQxKS46t6x4bDrN0ibxDXS_7jrXWRPVogr5WwhXGc5QinKEQOc49kLHoEtie-rCzMDLgYGjTyu88ohUP_XCBABHK3cZq1HfBe5dZWVtuq8uEMiuk7vtStocVLe2oLNvpmyzxsI3stPCwe3jfTPR-VbahAFy3Qrxj4OI4AnoHmgClg5AOgim_XdioEQfsF44xJdsdsZguIVvo7MvC0oy59_zSR9qJ32ag5CjPG4M1qABxQ81OTo8t" />
              <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-xl text-sm font-black shadow-xl shadow-primary/30">$850<span className="text-white/70 font-bold text-[10px]">/DAY</span></div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-black tracking-tight">Ferrari 488 Spider</h4>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">Italian Performance</p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 border-y border-white/5 py-4 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">speed</span> 330 km/h</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">bolt</span> 670 HP</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">settings</span> Auto</span>
              </div>
              <Link href="/catalog" className="block w-full py-4 rounded-xl border border-primary text-primary font-black uppercase tracking-widest text-xs text-center group-hover:bg-primary group-hover:text-white transition-all">Rent Now</Link>
            </div>
          </div>

          {/* Vehicle Card 2 */}
          <div className="group bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-700 shadow-2xl text-left">
            <div className="relative h-72 overflow-hidden">
              <img alt="Car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbDiG9Lis1YGfLcNE4dU2vTwLSSuucomTPhn3h3ENK0BCByFk2AgE-piU8-yC5tyV4KHKPFaFSx6kHMgJxqwnJIwuPWiZrkXHYLz3Qt_fqtGrkMngLv1-M2HImYGhAq0k32Ue6hc274RCgpkpcmEQTfBtWTLHiNZQ9dhc5ElkQccFk7OIc_fhxLr7n9jfVrskfd3sJEqUZFKcDx1g1sTmUW7jxwc6af_nKeqLIV7BRaW1XeVYuZReLtioxgfkgfAVY4ZyUMxFJTue_" />
              <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-xl text-sm font-black shadow-xl shadow-primary/30">$420<span className="text-white/70 font-bold text-[10px]">/DAY</span></div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-black tracking-tight">Porsche 911 Turbo S</h4>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">German Precision</p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 border-y border-white/5 py-4 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">speed</span> 320 km/h</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">bolt</span> 640 HP</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">settings</span> PDK</span>
              </div>
              <Link href="/catalog" className="block w-full py-4 rounded-xl border border-primary text-primary font-black uppercase tracking-widest text-xs text-center group-hover:bg-primary group-hover:text-white transition-all">Rent Now</Link>
            </div>
          </div>

          {/* Vehicle Card 3 */}
          <div className="group bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-700 shadow-2xl text-left">
            <div className="relative h-72 overflow-hidden">
              <img alt="Car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhLOqpTb8xiz97JOUWtv2e7P9yHj2m-lhR0Q8G6VBEyPn6b0DK1_ekZkX_01FxTa5_fjufe34t3KhK98u5eD3vZeILWhvoo3CNOWClWSVEDP2UHyN7PgxnHI5EF3rwX_mtKkF0rhQPudWovzYBF7adn8oCJqRfm_r3du2I9DwK0zw3gtvMAHIUo1EXEr2ocTkWJnJOT6x99dn-4pL1G5lwT9pvYTQXxaXvQAfqecIG1v8wafT198uFzBgyJo7xJ7Jzjbwo-mU_fH3t" />
              <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-xl text-sm font-black shadow-xl shadow-primary/30">$1200<span className="text-white/70 font-bold text-[10px]">/DAY</span></div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-black tracking-tight">Lamborghini Urus</h4>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">Super SUV</p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 border-y border-white/5 py-4 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">speed</span> 305 km/h</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">bolt</span> 650 HP</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">settings</span> 4WD</span>
              </div>
              <Link href="/catalog" className="block w-full py-4 rounded-xl border border-primary text-primary font-black uppercase tracking-widest text-xs text-center group-hover:bg-primary group-hover:text-white transition-all">Rent Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Experience Section */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10 flex flex-col justify-center text-left">
            <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter">Elevating Every <br /><span className="underline underline-offset-8 decoration-slate-900">Mile Travelled</span></h2>
            <p className="text-white/80 text-xl font-light leading-relaxed max-w-xl">
              Beyond just rentals, we offer curated travel experiences. From VIP airport transfers to guided excursions in luxury coaches, our commitment to excellence remains unmatched.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="flex gap-5">
                <span className="material-symbols-outlined text-5xl">verified_user</span>
                <div className="space-y-1">
                  <h5 className="font-black uppercase tracking-widest text-sm">Fully Insured</h5>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">Total peace of mind with premium coverage.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <span className="material-symbols-outlined text-5xl">support_agent</span>
                <div className="space-y-1">
                  <h5 className="font-black uppercase tracking-widest text-sm">24/7 Concierge</h5>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">Personal assistant for your entire trip.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="aspect-video w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] rotate-3 scale-105 border-8 border-white/10">
              <img alt="Image" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2EKq_3sxvA89Z1nkP9L-mHXo945qBuhvASGmKNCHP-WM7dsoa7rN9lf7UssdcMW_bFHqs_Uz7u9UiYYVGQJOmiiAylVAncjM7bVe2NPBODL-SRgQrzqEjF68qdhX100iTstqGuTkZZo1vlJHjqdSHnq77UGmTYQFkppIaq4ISziC66K-lJkI0ZQqDSX4Hrbj6XXATZhjA44cBN2t56JoTscTWEYAqDSOIwpRoqgXeVIrNkiJLERZFJc9z3v2JbpwBjXeNUYy9VEH1" />
            </div>
            <div className="absolute -bottom-8 -left-8 lg:-left-4 bg-slate-950 p-8 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/10">
              <div className="size-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-4xl text-white">workspace_premium</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Global Award</p>
                <p className="font-black text-lg">Service Excellence 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6 mb-24">
          <h3 className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Client Stories</h3>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">What Our <span className="text-primary italic">Exclusive Clients</span> Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-10 rounded-3xl bg-slate-900/40 border border-white/5 relative group hover:border-primary/30 transition-all text-left">
            <span className="material-symbols-outlined absolute top-8 right-8 text-primary/10 text-8xl group-hover:text-primary/20 transition-colors">format_quote</span>
            <div className="space-y-6 relative z-10">
              <div className="flex text-primary">
                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-300 text-lg italic leading-relaxed font-light">
                "The Ferrari 488 was in pristine condition. The delivery to my hotel was punctual and the staff were incredibly professional. Truly a 5-star experience."
              </p>
              <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                <div className="size-14 rounded-2xl overflow-hidden bg-slate-800 bg-cover bg-center" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/32.jpg')" }}></div>
                <div>
                  <p className="font-black tracking-tight text-lg leading-none">Julian Vercetti</p>
                  <p className="text-[10px] text-primary uppercase font-black mt-2 tracking-widest">Entrepreneur</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-10 rounded-3xl bg-slate-900/60 border border-primary/40 relative shadow-2xl scale-105 z-10 text-left">
            <span className="material-symbols-outlined absolute top-8 right-8 text-primary/10 text-8xl">format_quote</span>
            <div className="space-y-6 relative z-10">
                <div className="flex text-primary">
                  <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
                </div>
                <p className="text-slate-300 text-lg italic leading-relaxed font-light">
                  "LUXEDRIVE transformed our anniversary trip. The excursion service with a private chauffeur allowed us to enjoy the coastal views without any stress."
                </p>
                <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                  <div className="size-14 rounded-2xl overflow-hidden bg-slate-800 bg-cover bg-center" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/women/44.jpg')" }}></div>
                  <div>
                    <p className="font-black tracking-tight text-lg leading-none">Elena Rodriguez</p>
                    <p className="text-[10px] text-primary uppercase font-black mt-2 tracking-widest">Lifestyle Artist</p>
                  </div>
                </div>
            </div>
          </div>
          <div className="p-10 rounded-3xl bg-slate-900/40 border border-white/5 relative group hover:border-primary/30 transition-all text-left">
            <span className="material-symbols-outlined absolute top-8 right-8 text-primary/10 text-8xl group-hover:text-primary/20 transition-colors">format_quote</span>
            <div className="space-y-6 relative z-10">
              <div className="flex text-primary">
                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-300 text-lg italic leading-relaxed font-light">
                "As a business traveler, reliability is key. Their transfer service is always on time, cars are spotless, and the chauffeurs are discreet."
              </p>
              <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                <div className="size-14 rounded-2xl overflow-hidden bg-slate-800 bg-cover bg-center" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/86.jpg')" }}></div>
                <div>
                  <p className="font-black tracking-tight text-lg leading-none">Marcus Sterling</p>
                  <p className="text-[10px] text-primary uppercase font-black mt-2 tracking-widest">CEO, Sterling Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 border-t border-white/5 bg-slate-950/30">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Join the <span className="text-primary italic underline underline-offset-8 decoration-white/10">Inner Circle</span></h2>
          <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">Subscribe to get early access to new fleet additions and exclusive member-only events.</p>
          <form className="flex flex-col sm:flex-row gap-5 max-w-2xl mx-auto pt-6">
            <input className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white font-medium transition-all" placeholder="Your Email Address" type="email" />
            <button className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-10 py-5 rounded-2xl transition-all shadow-xl shadow-primary/20">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
