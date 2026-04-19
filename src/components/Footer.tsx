import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-50 py-16 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 justify-items-start">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-black text-white p-1 rounded-md flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">rocket_launch</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-gray-900">ICON<span className="font-black">RENTAL</span></h1>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                        Setting the standard for luxury mobility worldwide. Experience the pinnacle of automotive excellence and service.
                    </p>
                    <div className="flex gap-4">
                        <Link className="size-10 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:border-black hover:text-black transition-all shadow-sm" href="#"><span className="material-symbols-outlined text-sm">public</span></Link>
                        <Link className="size-10 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:border-black hover:text-black transition-all shadow-sm" href="#"><span className="material-symbols-outlined text-sm">alternate_email</span></Link>
                        <Link className="size-10 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:border-black hover:text-black transition-all shadow-sm" href="#"><span className="material-symbols-outlined text-sm">phone_iphone</span></Link>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-6 tracking-tight">Explore</h4>
                    <ul className="space-y-4 text-gray-500 text-sm">
                        <li><Link className="hover:text-black transition-colors" href="/catalog">Our Fleet</Link></li>
                        <li><Link className="hover:text-black transition-colors" href="/transfers">VIP Transfers</Link></li>
                        <li><Link className="hover:text-black transition-colors" href="/excursions">Luxury Excursions</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-6 tracking-tight">Company</h4>
                    <ul className="space-y-4 text-gray-500 text-sm">
                        <li><Link className="hover:text-black transition-colors" href="#">About Us</Link></li>
                        <li><Link className="hover:text-black transition-colors" href="#">Privacy Policy</Link></li>
                        <li><Link className="hover:text-black transition-colors" href="#">Terms of Service</Link></li>
                        <li><Link className="hover:text-black transition-colors" href="#">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-6 tracking-tight">Location & Contact</h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-gray-400 text-lg">location_on</span>
                            <span>Imm. Sadok Bacha Avenue hédi Ouali <br />Hammamet, 8050, Tunisie</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-gray-400 text-lg">alternate_email</span>
                            <a href="mailto:iconrental123@gmail.com" className="hover:text-black transition-colors">iconrental123@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 text-center md:text-left">
                <p>© 2024 ICON RENTAL. All Rights Reserved.</p>
                <div className="flex gap-6">
                    <Link className="hover:text-gray-900 transition-colors" href="#">Cookie Settings</Link>
                    <Link className="hover:text-gray-900 transition-colors" href="#">Legal Notices</Link>
                </div>
            </div>
        </footer>
    );
}
