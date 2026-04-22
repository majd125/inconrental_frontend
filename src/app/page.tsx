'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LOCATIONS = [
  "Aéroport international de Tunis-Carthage (TUN)",
  "Aéroport international de Djerba-Zarzis (DJE)",
  "Aéroport international d'Enfidha-Hammamet (NBE)",
  "Aéroport international de Monastir Habib-Bourguiba (MIR)",
  "Notre bureau local à Hammamet Nabeul",
  "Autre emplacement"
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

  const [activeDropdown, setActiveDropdown] = useState<'depart' | 'arrivee' | null>(null);

  const LocationDropdown = ({
    value,
    onChange,
    label,
    icon,
    isOpen,
    onToggle
  }: {
    value: string,
    onChange: (val: string) => void,
    label: string,
    icon: string,
    isOpen: boolean,
    onToggle: () => void
  }) => (
    <div className="relative group">
      <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1 mb-2 block">{label}</label>
      <div
        onClick={onToggle}
        className={`w-full bg-white border ${isOpen ? 'border-black ring-1 ring-black' : 'border-gray-200'} rounded-xl py-2 pl-11 pr-10 text-gray-900 text-sm font-bold shadow-sm cursor-pointer transition-all flex items-center h-[46px]`}
      >
        <span className="material-symbols-outlined absolute left-4 text-gray-400 group-hover:text-black transition-colors text-[20px]">{icon}</span>
        <span className="truncate">{value}</span>
        <span className={`material-symbols-outlined absolute right-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`}>expand_more</span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => onToggle()}></div>
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 pr-3 space-y-1">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc}
                  onClick={() => {
                    onChange(loc);
                    onToggle();
                  }}
                  className={`px-3 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer flex items-center justify-between ${value === loc ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-900'}`}
                >
                  <span className="truncate pr-4">{loc}</span>
                  {value === loc && <span className="material-symbols-outlined text-sm">check_circle</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPickup = searchData.lieu_depart === "Autre emplacement"
      ? searchData.lieu_depart_autre
      : searchData.lieu_depart;

    const finalReturn = searchData.lieu_arrivee === "Autre emplacement"
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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 w-full overflow-hidden bg-gray-50 border-b border-gray-100">
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-8">
            <span className="inline-block py-1.5 px-3 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold tracking-wide">Expérience de Mobilité Premium</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              La nouvelle référence en matière de <span className="text-gray-400">voyage de luxe.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Des performances inégalées alliées à une élégance absolue. Accédez à la flotte la plus exclusive du monde grâce à une réservation moderne et fluide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Link href="/catalog" className="px-8 py-4 bg-black text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-sm">
                Voir la Collection <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <button className="px-8 py-4 bg-white text-gray-900 font-medium rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                Notre Héritage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Module */}
      <section className="relative -mt-20 z-10 max-w-6xl mx-auto px-4">
        <div className="bg-white border-2 border-black/5 rounded-3xl distinguished-form-shadow overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50/30">
            <button className="flex-1 py-5 flex items-center justify-center gap-2 bg-white border-t-4 border-black text-black font-black text-xs uppercase tracking-[0.2em]">
              <span className="material-symbols-outlined text-[20px]">directions_car</span> Location
            </button>
            <Link href="/transfers" className="flex-1 py-5 flex items-center justify-center gap-2 text-gray-400 hover:text-black transition-all text-xs font-black uppercase tracking-[0.2em] border-t-4 border-transparent">
              <span className="material-symbols-outlined text-[20px]">local_taxi</span> Transfert
            </Link>
            <Link href="/excursions" className="flex-1 py-5 flex items-center justify-center gap-2 text-gray-400 hover:text-black transition-all text-xs font-black uppercase tracking-[0.2em] border-t-4 border-transparent">
              <span className="material-symbols-outlined text-[20px]">map</span> Excursion
            </Link>
          </div>

          <form onSubmit={handleSearch} className="p-10 bg-gradient-to-b from-white to-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Pick-up Location */}
              <div className="space-y-3">
                <LocationDropdown
                  label="Lieu de Prise en Charge"
                  icon="location_on"
                  value={searchData.lieu_depart}
                  isOpen={activeDropdown === 'depart'}
                  onToggle={() => setActiveDropdown(activeDropdown === 'depart' ? null : 'depart')}
                  onChange={(val) => setSearchData({ ...searchData, lieu_depart: val })}
                />
                {searchData.lieu_depart === "Autre emplacement" && (
                  <input
                    required
                    type="text"
                    placeholder="Spécifiez le lieu de prise en charge"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-gray-900 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm font-bold h-[46px]"
                    value={searchData.lieu_depart_autre}
                    onChange={(e) => setSearchData({ ...searchData, lieu_depart_autre: e.target.value })}
                  />
                )}
              </div>

              {/* Return Location */}
              <div className="space-y-3">
                <LocationDropdown
                  label="Lieu de Restitution"
                  icon="near_me"
                  value={searchData.lieu_arrivee}
                  isOpen={activeDropdown === 'arrivee'}
                  onToggle={() => setActiveDropdown(activeDropdown === 'arrivee' ? null : 'arrivee')}
                  onChange={(val) => setSearchData({ ...searchData, lieu_arrivee: val })}
                />
                {searchData.lieu_arrivee === "Autre emplacement" && (
                  <input
                    required
                    type="text"
                    placeholder="Spécifiez le lieu de restitution"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm font-bold"
                    value={searchData.lieu_arrivee_autre}
                    onChange={(e) => setSearchData({ ...searchData, lieu_arrivee_autre: e.target.value })}
                  />
                )}
              </div>

              {/* Pick-up Date & Time */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1 mb-2 block">Date & Heure de Prise en Charge</label>
                <div className="relative group text-[#ffffff00]">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors text-[20px] z-10 pointer-events-none">calendar_today</span>
                  <input
                    required
                    type="datetime-local"
                    value={searchData.date_debut}
                    onChange={(e) => setSearchData({ ...searchData, date_debut: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-11 pr-4 text-gray-900 text-sm font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all shadow-sm cursor-pointer h-[46px]"
                  />
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1 mb-2 block">Date & Heure de Restitution</label>
                <div className="relative group text-[#ffffff00]">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors text-[20px] z-10 pointer-events-none">event_repeat</span>
                  <input
                    required
                    type="datetime-local"
                    value={searchData.date_fin}
                    onChange={(e) => setSearchData({ ...searchData, date_fin: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-11 pr-4 text-gray-900 text-sm font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all shadow-sm cursor-pointer h-[46px]"
                  />
                </div>
              </div>

              {/* Baby Seats */}
            </div>

            <div className="mt-10 flex flex-col lg:flex-row justify-between items-center gap-10 pt-10 border-t border-gray-100">
              <div className="flex gap-8">
                <div className="flex items-center gap-3 text-gray-900 text-[11px] font-black uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-black text-[20px]">verified</span>
                  <span>Annulation Gratuite</span>
                </div>
                <div className="flex items-center gap-3 text-gray-900 text-[11px] font-black uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-black text-[20px]">payments</span>
                  <span>Paiement à l'Arrivée</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">
                <div className="flex flex-col items-center w-full sm:w-auto">
                  <span className="text-[11px] font-black text-black uppercase tracking-widest mb-3 bg-black/5 px-3 py-1 rounded-full">Préférence pour Sièges Bébé</span>
                  <div className="flex items-center gap-5 p-1 bg-white border border-gray-200 rounded-2xl shadow-inner">
                    <button
                      type="button"
                      onClick={() => setSearchData({ ...searchData, nb_sieges_bebe: Math.max(0, searchData.nb_sieges_bebe - 1) })}
                      className="size-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white text-gray-900 transition-all shadow-sm active:scale-90"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <div className="flex flex-col items-center min-w-20">
                      <span className="text-[10px] text-gray-400 font-black uppercase">Quantité</span>
                      <span className="text-gray-900 text-lg font-black">{searchData.nb_sieges_bebe}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchData({ ...searchData, nb_sieges_bebe: searchData.nb_sieges_bebe + 1 })}
                      className="size-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white text-gray-900 transition-all shadow-sm active:scale-90"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full lg:w-[280px] h-[64px] bg-black hover:bg-black/90 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-black/40 flex items-center justify-center gap-4 group active:scale-95">
                  VOIR LA FLOTTE
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-3">
            <h3 className="text-black font-semibold text-sm uppercase tracking-wide">Flotte Exquise</h3>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Véhicules en Vedette</h2>
          </div>
          <div className="flex gap-3">
            <button className="size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-black transition-all shadow-sm">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-black transition-all shadow-sm">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vehicle Card 1: Clio 5 */}
          <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative h-64 overflow-hidden bg-gray-50">
              <img alt="Clio 5" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" src="/renault-clio5.jpg" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-black px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">40 TND<span className="text-gray-500 font-medium text-[10px] ml-1">/DAY</span></div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-gray-900">Renault Clio 5</h4>
                  <p className="text-gray-500 text-xs font-medium mt-1">Économie Moderne</p>
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-gray-600 border-y border-gray-100 py-3 uppercase">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">speed</span> 180 km/h</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">bolt</span> 100 CH</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">settings</span> Manuelle</span>
              </div>
              <Link href="/catalog" className="block w-full py-3 rounded-xl bg-gray-50 border border-gray-200 text-black font-semibold text-sm text-center group-hover:bg-black group-hover:text-white transition-all">Sélectionner le Véhicule</Link>
            </div>
          </div>

          {/* Vehicle Card 2: Seat Leon */}
          <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative h-64 overflow-hidden bg-gray-50">
              <img alt="Seat Leon" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" src="/seat-leon.jpg" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-black px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">60 TND<span className="text-gray-500 font-medium text-[10px] ml-1">/DAY</span></div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-gray-900">Seat Leon</h4>
                  <p className="text-gray-500 text-xs font-medium mt-1">Sport Dynamique</p>
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-gray-600 border-y border-gray-100 py-3 uppercase">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">speed</span> 210 km/h</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">bolt</span> 150 CH</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">settings</span> Manuelle</span>
              </div>
              <Link href="/catalog" className="block w-full py-3 rounded-xl bg-gray-50 border border-gray-200 text-black font-semibold text-sm text-center group-hover:bg-black group-hover:text-white transition-all">Sélectionner le Véhicule</Link>
            </div>
          </div>

          {/* Vehicle Card 3: VW Golf */}
          <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative h-64 overflow-hidden bg-gray-50">
              <img alt="VW Golf" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" src="/golf-gti.jpg" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-black px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">55 TND<span className="text-gray-500 font-medium text-[10px] ml-1">/DAY</span></div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-gray-900">Volkswagen Golf</h4>
                  <p className="text-gray-500 text-xs font-medium mt-1">Fiabilité Allemande</p>
                </div>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-gray-600 border-y border-gray-100 py-3 uppercase">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">speed</span> 200 km/h</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">bolt</span> 130 CH</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">settings</span> Auto</span>
              </div>
              <Link href="/catalog" className="block w-full py-3 rounded-xl bg-gray-50 border border-gray-200 text-black font-semibold text-sm text-center group-hover:bg-black group-hover:text-white transition-all">Sélectionner le Véhicule</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Experience Section */}
      <section className="py-32 bg-black text-white relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">Sublimer Chaque <br /><span className="text-gray-400">Kilomètre Parcouru</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
              Au-delà des simples locations, nous proposons des expériences de voyage sur mesure. Des transferts aéroport VIP aux excursions guidées en autocars de luxe, notre engagement envers l'excellence reste inégalé.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
                <div className="space-y-1">
                  <h5 className="font-semibold text-sm">Entièrement Assuré</h5>
                  <p className="text-sm text-gray-500 leading-relaxed">Tranquillité d'esprit totale avec une couverture premium.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-3xl">support_agent</span>
                <div className="space-y-1">
                  <h5 className="font-semibold text-sm">Conciergerie 24/7</h5>
                  <p className="text-sm text-gray-500 leading-relaxed">Assistant personnel pour l'intégralité de votre voyage.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="aspect-video w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img alt="Image" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2EKq_3sxvA89Z1nkP9L-mHXo945qBuhvASGmKNCHP-WM7dsoa7rN9lf7UssdcMW_bFHqs_Uz7u9UiYYVGQJOmiiAylVAncjM7bVe2NPBODL-SRgQrzqEjF68qdhX100iTstqGuTkZZo1vlJHjqdSHnq77UGmTYQFkppIaq4ISziC66K-lJkI0ZQqDSX4Hrbj6XXATZhjA44cBN2t56JoTscTWEYAqDSOIwpRoqgXeVIrNkiJLERZFJc9z3v2JbpwBjXeNUYy9VEH1" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-20">
          <h3 className="text-black font-semibold text-sm uppercase tracking-wide">Histoires de Clients</h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Ce Que Disent Nos Clients</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-gray-200 relative group hover:shadow-lg transition-all">
            <div className="space-y-6">
              <div className="flex text-black">
                <span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span>
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                "La voiture était dans un état impeccable. La livraison à mon hôtel a été ponctuelle et le personnel incroyablement professionnel. Une expérience véritablement 5 étoiles."
              </p>
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-100">
                <div className="size-12 rounded-full overflow-hidden bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/32.jpg')" }}></div>
                <div>
                  <p className="font-bold tracking-tight text-sm text-gray-900">Julian Vercetti</p>
                  <p className="text-xs text-gray-500 font-medium">Entrepreneur</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 relative shadow-sm z-10 scale-[1.02]">
            <div className="space-y-6">
              <div className="flex text-black">
                <span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span>
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                "ICONRENTAL a transformé notre voyage d'anniversaire. Le service d'excursion avec un chauffeur privé nous a permis de profiter des vues côtières sans aucun stress."
              </p>
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200">
                <div className="size-12 rounded-full overflow-hidden bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/women/44.jpg')" }}></div>
                <div>
                  <p className="font-bold tracking-tight text-sm text-gray-900">Elena Rodriguez</p>
                  <p className="text-xs text-gray-500 font-medium">Lifestyle Artist</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-gray-200 relative group hover:shadow-lg transition-all">
            <div className="space-y-6">
              <div className="flex text-black">
                <span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span><span className="material-symbols-outlined text-[18px]">star</span>
              </div>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                "En tant que voyageur d'affaires, la fiabilité est essentielle. Leur service de transfert est toujours à l'heure, les voitures sont impeccables et les chauffeurs sont discrets."
              </p>
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-100">
                <div className="size-12 rounded-full overflow-hidden bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/86.jpg')" }}></div>
                <div>
                  <p className="font-bold tracking-tight text-sm text-gray-900">Marcus Sterling</p>
                  <p className="text-xs text-gray-500 font-medium">CEO, Sterling Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">Rejoignez le Cercle Privé</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">Abonnez-vous pour obtenir un accès anticipé aux nouveaux ajouts de la flotte et aux événements exclusifs réservés aux membres.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto pt-4">
            <input className="flex-1 bg-white border border-gray-200 rounded-xl px-6 py-4 focus:ring-1 focus:ring-black focus:border-black outline-none text-gray-900 font-medium transition-all shadow-sm" placeholder="Votre Adresse Email" type="email" />
            <button className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-sm">S'abonner</button>
          </form>
        </div>
      </section>
    </div>
  );
}
