import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-background-dark py-16 border-t border-primary/20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 justify-items-start">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-primary">rocket_launch</span>
                        <h1 className="text-xl font-bold tracking-tighter text-slate-100">LUXE<span className="text-primary">DRIVE</span></h1>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Setting the standard for luxury mobility worldwide. Experience the pinnacle of automotive excellence and service.
                    </p>
                    <div className="flex gap-4">
                        <Link className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all" href="#"><span className="material-symbols-outlined text-sm">public</span></Link>
                        <Link className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all" href="#"><span className="material-symbols-outlined text-sm">alternate_email</span></Link>
                        <Link className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all" href="#"><span className="material-symbols-outlined text-sm">phone_iphone</span></Link>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Explore</h4>
                    <ul className="space-y-4 text-slate-500 text-sm">
                        <li><Link className="hover:text-primary transition-colors" href="/catalog">Our Fleet</Link></li>
                        <li><Link className="hover:text-primary transition-colors" href="/transfers">VIP Transfers</Link></li>
                        <li><Link className="hover:text-primary transition-colors" href="/excursions">Luxury Excursions</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Company</h4>
                    <ul className="space-y-4 text-slate-500 text-sm">
                        <li><Link className="hover:text-primary transition-colors" href="#">About Us</Link></li>
                        <li><Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link></li>
                        <li><Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link></li>
                        <li><Link className="hover:text-primary transition-colors" href="#">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Locations</h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 text-sm text-slate-500">
                            <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                            <span>Monaco, Place du Casino <br />Monte-Carlo 98000</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-500">
                            <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                            <span>Dubai, Downtown <br />Burj Khalifa District</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 text-center md:text-left">
                <p>© 2024 LUXE DRIVE. All Rights Reserved.</p>
                <div className="flex gap-6">
                    <Link className="hover:text-primary" href="#">Cookie Settings</Link>
                    <Link className="hover:text-primary" href="#">Legal Notices</Link>
                </div>
            </div>
        </footer>
    );
}
