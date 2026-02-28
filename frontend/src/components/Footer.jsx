import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Newsletter */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Subscribe to our newsletter</h3>
          <p className="text-gray-500 text-sm mb-4">Get daily news on upcoming offers from many suppliers all over the world</p>
          <form className="flex justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-blue-500 font-bold text-xl">Brand</span>
            </Link>
            <p className="text-sm text-gray-500 mb-4">Best information about the company goes here but now lorem ipsum is used.</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-colors">
                <FiFacebook size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-colors">
                <FiTwitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-colors">
                <FiLinkedin size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-colors">
                <FiInstagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-colors">
                <FiYoutube size={14} />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">About</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500">Find Store</a></li>
              <li><a href="#" className="hover:text-blue-500">Categories</a></li>
              <li><a href="#" className="hover:text-blue-500">Blogs</a></li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Partnership</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500">Find Store</a></li>
              <li><a href="#" className="hover:text-blue-500">Categories</a></li>
              <li><a href="#" className="hover:text-blue-500">Blogs</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Information</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-500">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-500">Money Refund</a></li>
              <li><a href="#" className="hover:text-blue-500">Shipping</a></li>
              <li><a href="#" className="hover:text-blue-500">Contact Us</a></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">For Users</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/login" className="hover:text-blue-500">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-500">Register</Link></li>
              <li><Link to="/cart" className="hover:text-blue-500">My Cart</Link></li>
              <li><Link to="/products" className="hover:text-blue-500">Shop</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-500">&copy; 2026 Brand. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <img src="https://img.icons8.com/color/32/usa.png" alt="US" className="w-5 h-5" />
            <span className="text-sm text-gray-500">English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
