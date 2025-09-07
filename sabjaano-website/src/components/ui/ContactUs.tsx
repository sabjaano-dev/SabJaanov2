"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// MODIFICATION: Added ChevronDown for the FAQ accordion
import { Send, TrendingUp, HelpCircle, Building, ChevronDown } from "lucide-react";

// Helper component for contact info cards
const InfoCard = ({ icon, title, content, href }: { icon: React.ReactNode; title: string; content: string; href?: string; }) => (
    <motion.a
        href={href || "#"}
        className="block bg-gray-800/50 p-6 rounded-2xl border border-gray-700"
        whileHover={{ scale: 1.05, y: -8, boxShadow: "0 0 25px rgba(34, 211, 238, 0.3)" }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-cyan-900/50 p-3 rounded-lg">{icon}</div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-cyan-400 font-medium">{content}</p>
    </motion.a>
);

// --- NEW FAQ COMPONENT ---
const faqs = [
    {
        question: "How does the AI screen matching work?",
        answer: "Our system analyzes your business category, services, and target audience to identify 'sister businesses'—places where your ideal customers are likely to be. It then automatically suggests and schedules your ads on the most relevant screens in those locations."
    },
    {
        question: "What are the payment options?",
        answer: "We accept all major credit cards, debit cards, and net banking. For enterprise plans, we also support invoicing and bank transfers. All payments are processed securely."
    },
    {
        question: "Can I change my plan later?",
        answer: "Absolutely. You can upgrade, downgrade, or cancel your plan at any time directly from your dashboard. Changes will be reflected in the next billing cycle."
    },
];

const FAQItem = ({ faq, isOpen, onClick }: { faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }) => (
    <div className="border-b border-gray-700 last:border-b-0">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center py-4 text-left text-lg font-medium text-white"
        >
            <span>{faq.question}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown size={20} />
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <p className="pb-4 text-gray-400">{faq.answer}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


export default function ContactUs() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        company: '',
        inquiryType: 'sales',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
    const [openFAQ, setOpenFAQ] = useState<number | null>(0); // Keep the first FAQ open by default

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Form submitted:", formData);
        if (formData.email.includes('@')) {
            setSubmitStatus('success');
            setFormData({ fullName: '', email: '', company: '', inquiryType: 'sales', message: '' });
        } else {
            setSubmitStatus('error');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-gray-900 text-white">
            <style jsx global>{`
                .aurora-bg-contact {
                    position: absolute; inset: 0; width: 100%; height: 100%;
                    z-index: 0; overflow: hidden;
                }
                .aurora-bg-contact::after {
                    content: ""; position: absolute; inset: -200px;
                    background-image: var(--stripes), var(--rainbow);
                    background-size: 300% 300%, 200% 200%;
                    background-position: 50% 50%, 50% 50%;
                    animation: smoothBg 40s linear infinite;
                    filter: blur(25px);
                    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
                    --stripes: repeating-linear-gradient(100deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 4%, transparent 8%, transparent 12%, rgba(255, 255, 255, 0.05) 16%);
                    --rainbow: repeating-linear-gradient(100deg, hsla(212,100%,50%,0.4) 10%, hsla(289,100%,50%,0.4) 25%, hsla(169,100%,50%,0.4) 40%);
                }
                @keyframes smoothBg {
                    from { background-position: 50% 50%, 50% 50%; }
                    to { background-position: 350% 50%, 350% 50%; }
                }
            `}</style>

            <div className="relative text-center py-24 lg:py-32 px-6 overflow-hidden">
                <div className="aurora-bg-contact" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Get in Touch
                    </h1>
                    <p className="mt-6 text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
                        We're here to help you grow. Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                    </p>
                </motion.div>
            </div>

            <div className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-2 bg-gray-800/50 p-8 rounded-2xl border border-gray-700"
                    >
                        <h2 className="text-3xl font-bold mb-6 text-white">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                <input type="email" name="email" placeholder="Work Email" required value={formData.email} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div>
                                <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div>
                                <select name="inquiryType" required value={formData.inquiryType} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500">
                                    <option value="sales">Contact Sales</option>
                                    <option value="support">Technical Support</option>
                                    <option value="general">General Inquiry</option>
                                </select>
                            </div>
                            <div>
                                <textarea name="message" placeholder="Your Message" rows={5} required value={formData.message} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                            </div>
                            <div>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isSubmitting ? 'Sending...' : <>Send Message <Send size={18} /></>}
                                </motion.button>
                            </div>
                            {submitStatus === 'success' && <p className="text-green-400">Message sent! We'll be in touch soon.</p>}
                            {submitStatus === 'error' && <p className="text-red-400">Something went wrong. Please try again.</p>}
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                             <div className="flex items-center gap-4 mb-3">
                                <div className="bg-cyan-900/50 p-3 rounded-lg"><HelpCircle className="text-cyan-400" /></div>
                                <h3 className="text-xl font-semibold text-white">FAQs</h3>
                            </div>
                            <div>
                                {faqs.map((faq, i) => (
                                    <FAQItem 
                                        key={i} 
                                        faq={faq} 
                                        isOpen={openFAQ === i} 
                                        onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                    />
                                ))}
                            </div>
                        </div>

                        <InfoCard icon={<TrendingUp className="text-cyan-400" />} title="Contact Sales" content="sales@sabjaano.com" href="mailto:sales@sabjaano.com" />
                        
                        {/* MODIFICATION: Replaced InfoCard with a detailed address block */}
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="bg-cyan-900/50 p-3 rounded-lg"><Building className="text-cyan-400" /></div>
                                <h3 className="text-xl font-semibold text-white">Our Office</h3>
                            </div>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                123 Tech Avenue, Innovation Park<br />
                                New Delhi, 110001, India
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

