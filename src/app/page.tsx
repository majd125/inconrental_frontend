import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to right, rgba(10, 10, 12, 0.9) 20%, rgba(10, 10, 12, 0.4) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxTlLd4jt5UM0mlvA5NxAaj6khYkXJinjy0QkiMF92mMSamHrKsp7z_QK8FzAAMC3FkXJkN5ok2LiBhvRHhit0CSSCwZsowNvg-7g3wwa0Jq-r8CpatfBdZXZrfCgkYCDCzybhV43QUwd-bMfAH7zYDbuDzioVCwpjjPHq7kBb3GIMta7JpS-EbiyBWTQNfq3YLKnidG-mdXv2H6QepZLuTi7pZuaH9MBbUVw9BiBv1UCBiU0eWaAGngGJ0q_lSKGkMOe_vIVbUNmN')" }}></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block py-1 px-3 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest">Premium Experience</span>
            <h2 className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter text-white">
              Drive the <span className="text-primary">Future</span> of Luxury
            </h2>
            <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
              Unrivaled performance meets absolute elegance. Access the world's most exclusive fleet with bespoke concierge service.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(215,4,39,0.4)] transition-all">
                View Collection <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                Our Heritage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Module */}
      <section className="relative mt-12 z-10 max-w-5xl mx-auto px-4">
        <div className="bg-background-dark/80 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            <button className="flex-1 py-4 flex items-center justify-center gap-2 bg-primary text-white font-bold">
              <span className="material-symbols-outlined">directions_car</span> Rental
            </button>
            <button className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">local_taxi</span> Transfer
            </button>
            <button className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">map</span> Excursion
            </button>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-tighter">Pick-up Location</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">location_on</span>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Airport or Hotel" type="text" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-tighter">Pick-up Date</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">calendar_today</span>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Select Date" type="text" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-tighter">Car Category</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">category</span>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-primary focus:border-primary appearance-none">
                  <option>Supercar</option>
                  <option>Luxury SUV</option>
                  <option>Executive Sedan</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-primary/20">
                Search Available
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h3 className="text-primary font-bold tracking-widest uppercase text-sm">Elite Fleet</h3>
            <h2 className="text-4xl md:text-5xl font-bold">Featured <span className="text-primary italic">Vehicles</span></h2>
          </div>
          <div className="flex gap-2">
            <button className="size-12 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary transition-all text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-12 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary transition-all text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vehicle Card 1 */}
          <div className="group bg-[#0a192f]/40 border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500">
            <div className="relative h-64 overflow-hidden">
              <img alt="Car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8w4sHQjO2dtSwjV2YwM_yzvLDCQxKS46t6x4bDrN0ibxDXS_7jrXWRPVogr5WwhXGc5QinKEQOc49kLHoEtie-rCzMDLgYGjTyu88ohUP_XCBABHK3cZq1HfBe5dZWVtuq8uEMiuk7vtStocVLe2oLNvpmyzxsI3stPCwe3jfTPR-VbahAFy3Qrxj4OI4AnoHmgClg5AOgim_XdioEQfsF44xJdsdsZguIVvo7MvC0oy59_zSR9qJ32ag5CjPG4M1qABxQ81OTo8t" />
              <div className="absolute top-4 right-4 bg-background-dark/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">Daily $850</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold">Ferrari 488 Spider</h4>
                  <p className="text-slate-400 text-sm italic">Italian Masterpiece</p>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-300 border-y border-white/5 py-3">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">speed</span> 330 km/h</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">bolt</span> 670 HP</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">settings_input_component</span> Auto</span>
              </div>
              <button className="w-full py-3 rounded-lg border border-primary text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">Rent Now</button>
            </div>
          </div>

          {/* Vehicle Card 2 */}
          <div className="group bg-[#0a192f]/40 border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500">
            <div className="relative h-64 overflow-hidden">
              <img alt="Car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbDiG9Lis1YGfLcNE4dU2vTwLSSuucomTPhn3h3ENK0BCByFk2AgE-piU8-yC5tyV4KHKPFaFSx6kHMgJxqwnJIwuPWiZrkXHYLz3Qt_fqtGrkMngLv1-M2HImYGhAq0k32Ue6hc274RCgpkpcmEQTfBtWTLHiNZQ9dhc5ElkQccFk7OIc_fhxLr7n9jfVrskfd3sJEqUZFKcDx1g1sTmUW7jxwc6af_nKeqLIV7BRaW1XeVYuZReLtioxgfkgfAVY4ZyUMxFJTue_" />
              <div className="absolute top-4 right-4 bg-background-dark/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">Daily $420</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold">Porsche 911 Turbo S</h4>
                  <p className="text-slate-400 text-sm italic">Precision Engineering</p>
                </div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-300 border-y border-white/5 py-3">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">speed</span> 320 km/h</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">bolt</span> 640 HP</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">settings_input_component</span> PDK</span>
              </div>
              <button className="w-full py-3 rounded-lg border border-primary text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">Rent Now</button>
            </div>
          </div>

          {/* Vehicle Card 3 */}
          <div className="group bg-[#0a192f]/40 border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-500">
            <div className="relative h-64 overflow-hidden">
              <img alt="Car" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhLOqpTb8xiz97JOUWtv2e7P9yHj2m-lhR0Q8G6VBEyPn6b0DK1_ekZkX_01FxTa5_fjufe34t3KhK98u5eD3vZeILWhvoo3CNOWClWSVEDP2UHyN7PgxnHI5EF3rwX_mtKkF0rhQPudWovzYBF7adn8oCJqRfm_r3du2I9DwK0zw3gtvMAHIUo1EXEr2ocTkWJnJOT6x99dn-4pL1G5lwT9pvYTQXxaXvQAfqecIG1v8wafT198uFzBgyJo7xJ7Jzjbwo-mU_fH3t" />
              <div className="absolute top-4 right-4 bg-background-dark/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">Daily $1200</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold">Lamborghini Urus</h4>
                  <p className="text-slate-400 text-sm italic">Ultimate Performance SUV</p>
                </div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-300 border-y border-white/5 py-3">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">speed</span> 305 km/h</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">bolt</span> 650 HP</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm">settings_input_component</span> 4WD</span>
              </div>
              <button className="w-full py-3 rounded-lg border border-primary text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">Rent Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Experience Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 flex flex-col justify-center">
            <h2 className="text-5xl font-bold leading-tight">Elevating Every <br /><span className="underline decoration-slate-900 underline-offset-8">Mile You Travel</span></h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Beyond just rentals, we offer curated travel experiences. From VIP airport transfers to guided excursions in luxury coaches, our commitment to excellence remains unmatched.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-4xl">verified_user</span>
                <div>
                  <h5 className="font-bold">Fully Insured</h5>
                  <p className="text-sm text-white/70">Total peace of mind with premium coverage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-4xl">support_agent</span>
                <div>
                  <h5 className="font-bold">24/7 Concierge</h5>
                  <p className="text-sm text-white/70">Personal assistant for your entire trip.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="aspect-video w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl rotate-3 scale-105 border-4 border-white/20">
              <img alt="Image" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2EKq_3sxvA89Z1nkP9L-mHXo945qBuhvASGmKNCHP-WM7dsoa7rN9lf7UssdcMW_bFHqs_Uz7u9UiYYVGQJOmiiAylVAncjM7bVe2NPBODL-SRgQrzqEjF68qdhX100iTstqGuTkZZo1vlJHjqdSHnq77UGmTYQFkppIaq4ISziC66K-lJkI0ZQqDSX4Hrbj6XXATZhjA44cBN2t56JoTscTWEYAqDSOIwpRoqgXeVIrNkiJLERZFJc9z3v2JbpwBjXeNUYy9VEH1" />
            </div>
            <div className="absolute -bottom-6 -left-6 lg:left-0 bg-slate-900 p-6 rounded-xl shadow-xl flex items-center gap-4 border border-white/10">
              <div className="size-12 bg-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Award Winning</p>
                <p className="font-bold">Service Excellence 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-primary font-bold tracking-widest uppercase text-sm">Client Stories</h3>
          <h2 className="text-4xl font-bold">What Our <span className="italic">Elite Members</span> Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 relative">
            <span className="material-symbols-outlined absolute top-6 right-6 text-primary/20 text-6xl">format_quote</span>
            <div className="space-y-4 relative z-10">
              <div className="flex text-primary">
                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-300 italic leading-relaxed">
                "The Ferrari 488 was in pristine condition. The delivery to my hotel was punctual and the staff were incredibly professional. Truly a 5-star experience."
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="size-12 rounded-full overflow-hidden bg-[#0a192f] bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtR9Q3sBv73AgZmh1hsbyjNYxLG07-_1jY0plWX7-aH6Vxg7RIedKS3Q8sPOFFvvpXoexzoL4eWjkDfXbP8qBFq2xng_c74TSoZMA569g9j09ipiKlz88ufg6ly7gS1VcKCE1oS2CYtcmHT4Eml4TeOTdOlm6x_r2xMpzriwCbpqFHVG8asg5ls451GGAMpmFz_ekkrZyghiF7vkQ-hL_PIF6p9wPw-om9kPpP_o9ibdk4u_wtJqvrs3jqXEB-Bz5LkrK9hqBmSc2r')" }}></div>
                <div>
                  <p className="font-bold">Julian Vercetti</p>
                  <p className="text-xs text-slate-500 uppercase">Entrepreneur</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-primary/30 relative transform lg:-translate-y-4">
            <span className="material-symbols-outlined absolute top-6 right-6 text-primary/20 text-6xl">format_quote</span>
            <div className="space-y-4 relative z-10">
              <div className="flex text-primary">
                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-300 italic leading-relaxed">
                "LUXEDRIVE transformed our anniversary trip. The excursion service with a private chauffeur allowed us to enjoy the coastal views without any stress."
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="size-12 rounded-full overflow-hidden bg-[#0a192f] bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDynUuNc_bX7hxX_dK-_saTApCFtYztT-d5E4907FNTwMf9cxjkwIn74WUH3_-UTpaY4Ouz5L5z0qGNIcVjUusl3U8FhUdZPdvJNtPNiEu47U_OzvLjb0iU05IUGyQNELShLf8HiRN4clRip5iDK-PfQGuKy7E_tZgKNUuApcwN0nacr_oObzYQXez-5VzTnf8V1AbrzTihZUCL9YJSb9L5WqtBD-dlST7G5J9ECQnyo0j5YDL8etQTa9KCGNU-lgPoCHQJEAx-oQcl')" }}></div>
                <div>
                  <p className="font-bold">Elena Rodriguez</p>
                  <p className="text-xs text-slate-500 uppercase">Lifestyle Blogger</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 relative">
            <span className="material-symbols-outlined absolute top-6 right-6 text-primary/20 text-6xl">format_quote</span>
            <div className="space-y-4 relative z-10">
              <div className="flex text-primary">
                <span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span><span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-300 italic leading-relaxed">
                "As a business traveler, reliability is key. Their transfer service is always on time, cars are spotless, and the chauffeurs are discreet and polite."
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="size-12 rounded-full overflow-hidden bg-[#0a192f] bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqbWHtDyEX0XvpiBEe5DC_OvuSkm_DI04C79qV6S3XGHtxdjcK_HlUSz0j1PdEycOVxm6iTccpX3fzhvpcPSIsdXOdrXTxob6BtFcrgFLEEgR3mnAoDh3FfUtlc7O9Hfs-6flJ4TMYkNOMMmBwLpKN9Ag7AogH3qktU9FQ1FLnPMQbSVTnYMwT9fI7McealUHQpeCnwfZRstYiliLgKicsrQPlUv9N4xZUaLTkuXmVvXq_K0HcFcohQ9lKkw9h3NXtVHV-MVe0BR')" }}></div>
                <div>
                  <p className="font-bold">Marcus Sterling</p>
                  <p className="text-xs text-slate-500 uppercase">CEO, Sterling Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold">Join the <span className="text-primary">Inner Circle</span></h2>
          <p className="text-slate-400">Subscribe to get early access to new fleet additions and exclusive member-only events.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input className="flex-1 bg-white/5 border border-white/10 rounded-lg px-6 py-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white" placeholder="Your Email Address" type="email" />
            <button className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg transition-all">Subscribe Now</button>
          </form>
        </div>
      </section>
    </>
  );
}
