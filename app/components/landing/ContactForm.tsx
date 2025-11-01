import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';

export const ContactForm: React.FC = () => {
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
    <>
    <div className="mb-8">

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
               <option value="bug">Bug Report</option>
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
            placeholder="Describe the bug you encountered..."
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
    </>
  );
};