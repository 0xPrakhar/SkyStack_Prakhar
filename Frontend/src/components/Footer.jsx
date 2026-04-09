export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 py-14 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-white">
              <span className="text-mint-400">EVENT</span> HUB
            </h3>
            <p className="text-slate-400 mb-4 leading-7">
              Connecting people through amazing experiences. Discover, create, and attend events that matter to you.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="/" className="hover:text-mint-400 transition">Browse Events</a></li>
              <li><a href="/about" className="hover:text-mint-400 transition">About Us</a></li>
              <li><a href="/register" className="hover:text-mint-400 transition">Get Started</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-mint-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-mint-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-mint-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
          <p>&copy; 2024 Event Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}