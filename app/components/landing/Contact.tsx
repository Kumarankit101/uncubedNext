'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';

export const Contact: React.FC = () => {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', company: '', subject: '', message: '' });
        }, 3000);
      } else {
        console.error('Contact form error:', res.statusText);
      }
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-32 px-4 sm:px-6 relative">
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${
          theme === 'dark' ? 'from-black' : 'from-light-50'
        } to-transparent`} />

        {/* Main contact background */}
        <div className={`absolute inset-0 ${
          theme === 'dark' ? 'bg-black' : 'bg-light-50'
        }`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent_70%)]" />
        
        {/* End with black for CTA transition */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent ${
          theme === 'dark' ? 'to-black' : 'to-light-50'
        }`} />
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          
          
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>
            Let's build something
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              amazing together
            </span>
          </h2>
          
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-light-600'
          }`}>
            Have questions, feedback, or want to explore partnership opportunities? 
            We'd love to hear from you and help bring your startup vision to life.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className={`backdrop-blur-sm p-6 sm:p-8 border shadow-xl transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-white/[0.03] border-white/[0.08]'
              : 'bg-light-100/50 border-light-300/20'
          }`} style={{ borderRadius: '20px sm:rounded-[30px]', boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.15)' : undefined }}>
            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-light-900'
              }`}>Send us a message</h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-light-600'
              }`}>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-light-900'
                }`}>Message Sent!</h4>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                }`}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                    }`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                       className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 ${
                         theme === 'dark'
                           ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 hover:bg-white/[0.08]'
                           : 'bg-white/70 border border-gray-200/60 text-gray-900 placeholder-gray-500 hover:bg-white/90 hover:border-gray-300/80 shadow-sm'
                       }`}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                    }`}>
                      Email *
                    </label>
                     <input
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       required
                       className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 ${
                         theme === 'dark'
                           ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 hover:bg-white/[0.08]'
                           : 'bg-white/70 border border-gray-200/60 text-gray-900 placeholder-gray-500 hover:bg-white/90 hover:border-gray-300/80 shadow-sm'
                       }`}
                       placeholder="your@email.com"
                     />
                  </div>
                 </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                   <div>
                     <label className={`block text-sm font-medium mb-2 ${
                       theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                     }`}>
                       Company
                     </label>
                     <input
                       type="text"
                       name="company"
                       value={formData.company}
                       onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 ${
                            theme === 'dark'
                              ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 hover:bg-white/[0.08]'
                              : 'bg-white/70 border border-gray-200/60 text-gray-900 placeholder-gray-500 hover:bg-white/90 hover:border-gray-300/80 shadow-sm'
                          }`}
                       placeholder="Your company name"
                     />
                   </div>

                   <div>
                     <label className={`block text-sm font-medium mb-2 ${
                       theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                     }`}>
                       Subject *
                     </label>
                     <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                         className={`w-full pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 appearance-none ${
                           theme === 'dark'
                             ? 'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.08]'
                             : 'bg-white/70 border border-gray-200/60 text-gray-900 hover:bg-white/90 hover:border-gray-300/80 shadow-sm'
                         }`}
                      >
                        
                        <option disabled value="" style={{ color: '#f3f4f6' }}>Select a subject</option>
                       <option value="general">General Inquiry</option>
                       <option value="sales">Sales & Pricing</option>
                       <option value="support">Technical Support</option>
                       <option value="partnership">Partnership</option>
                       <option value="feedback">Feedback</option>
                       
                     </select>
                     <ChevronDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                       theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                     }`} />
                     </div>
                   </div>
                 </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                  }`}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                     className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 transition-colors resize-none ${
                       theme === 'dark'
                         ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400'
                         : 'bg-light-100/50 border border-gray-300 text-light-900 placeholder-light-500'
                     }`}
                    placeholder="Tell us about your project, questions, or how we can help..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};