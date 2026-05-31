
const Footer = () => {
    return (
        <footer className="py-12 border-t border-white/5 bg-darker/50">
            <div className="container mx-auto px-6 text-center">
                <p className="text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} My Portfolio. Built with React & Node.js.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
