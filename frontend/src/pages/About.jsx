import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../services/api';

const About = () => {
    const [content, setContent] = useState(null);
    const [homeContent, setHomeContent] = useState(null);
    const [education, setEducation] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aboutRes, homeRes, eduRes, svcRes] = await Promise.all([
                    api.get('/content/about'),
                    api.get('/content/home'),
                    api.get('/education'),
                    api.get('/services')
                ]);
                setContent(aboutRes.data);
                setHomeContent(homeRes.data);
                setEducation(eduRes.data);
                setServices(svcRes.data);
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        };
        fetchData();
    }, []);

    if (!content) return null;

    return (
        <div className="container mx-auto px-6 pb-20">
            {/* Bio Section */}
            <section className="min-h-[calc(100vh-6rem)] flex flex-col md:flex-row items-center justify-center gap-12 pt-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 space-y-8"
                >
                    <div>
                        <h2 className="text-sky-400 font-medium tracking-widest uppercase text-sm mb-2">Discovery</h2>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            <Typewriter text="Professional Narrative" />
                        </h1>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {content.fullBio}
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-gray-500 text-sm uppercase tracking-wider">Location</p>
                            <p className="text-white font-medium">{content.personalInfo.location}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500 text-sm uppercase tracking-wider">Availability</p>
                            <p className="text-white font-medium">{content.personalInfo.availability}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 relative max-w-sm md:max-w-md"
                >
                    <div className="w-full aspect-square relative">
                        {/* Animated Background Orbs inside About (matching Home) */}
                        <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full animate-pulse" />

                        <img
                            src={homeContent?.heroImage || 'https://via.placeholder.com/600x600'}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-[3rem] relative z-10 glass-card p-0"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Services Section */}
            <section className="space-y-12 pt-32">
                <h2 className="text-3xl font-bold text-center">What I Offer</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card"
                        >
                            <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6 text-sky-400 overflow-hidden">
                                {isServiceIconImage(service.icon) ? (
                                    <img
                                        src={getServiceIconSrc(service.icon)}
                                        alt=""
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <span className="text-2xl">{service.icon || '🚀'}</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-gray-400">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section className="space-y-12 pt-32">
                <h2 className="text-3xl font-bold text-center">Education</h2>
                <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-8 before:w-0.5 before:bg-white/10">
                    {education.map((edu, index) => (
                        <motion.div
                            key={edu._id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-10 sm:pl-20"
                        >
                            <div className="absolute left-2 sm:left-6 top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-dark" />
                            <div className="glass-card">
                                <span className="text-sky-400 text-sm font-medium">{edu.period}</span>
                                <h3 className="text-xl font-bold mt-1">{edu.degree} in {edu.field}</h3>
                                <h4 className="text-gray-300 font-medium">{edu.institution}</h4>
                                <p className="text-gray-400 mt-4">{edu.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const isServiceIconImage = (icon) =>
    !!icon && (icon.startsWith('http') || icon.startsWith('/uploads'));

const getServiceIconSrc = (icon) =>
    icon.startsWith('http') ? icon : `${BACKEND_URL}${icon}`;

const Typewriter = ({ text }) => {
    const letters = Array.from(text);
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            x: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <motion.div
            style={{ display: "inline-flex", overflow: "hidden" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap"
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} className={letter === ' ' ? 'mr-3' : ''}>
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default About;
