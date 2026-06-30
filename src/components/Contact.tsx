/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CursorState } from '../types';
import { audioEngine } from '../utils/audio';
import { Send, CheckCircle2, MapPin, Mail, MessageSquare } from 'lucide-react';

interface ContactProps {
  setCursor: (state: CursorState) => void;
  darkMode: boolean;
}

export default function Contact({ setCursor, darkMode }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Play micro-synthesized clicking on mechanical keystrokes
  const handleKeyDown = () => {
    // Highly organic high-pitch tick sound on keypress
    try {
      audioEngine.triggerHover(0.7); // standard high-range feedback
    } catch (e) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    audioEngine.triggerTransition();
    setIsSubmitting(true);

    // Simulate cryptographic packet sending
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      audioEngine.triggerClick();
    }, 2000);
  };

  const handleHoverElement = (e: React.MouseEvent, type: 'magnetic' | 'hover' = 'hover') => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    audioEngine.triggerHover(normalizedX);
    setCursor({ type });
  };

  return (
    <div id="contact-signal-layout" className="w-full flex flex-col pt-24 pb-16 px-6 sm:px-16 select-none relative z-10">
      {/* Page Header */}
      <div className={`flex flex-col mb-16 border-b pb-6 ${darkMode ? 'border-white/5' : 'border-bg-dark/10'}`}>
        <span className="font-mono text-xs text-accent-rose font-bold tracking-widest uppercase mb-1">
          // SIGNAL_EMISSION
        </span>
        <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tighter uppercase leading-none">
          THE SIGNAL
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 w-full">
        {/* Left info column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="flex flex-col mb-8">
            <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest mb-3">
              [ESTABLISH CONNECTION]
            </span>
            <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tighter uppercase leading-none mb-6">
              LET'S BUILD RADICAL DIGITAL PRODUCTS TOGETHER.
            </h3>
            <p className="font-sans text-xs sm:text-sm opacity-60 leading-relaxed uppercase">
              HAVE A WEBSITE, MOBILE APP, OR BRAND IDENTITY NEED? DROP US A SIGNAL PACKET. WE CRAFT AND STRATEGIZE FROM SCRATCH.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <div className={`flex gap-4 p-5 rounded-2xl border ${
              darkMode ? 'bg-white/3 border-white/5' : 'bg-bg-dark/3 border-bg-dark/5 text-bg-dark'
            }`}>
              <MapPin size={18} className="text-accent-rose flex-shrink-0 mt-0.5" />
              <div className="flex flex-col font-mono text-[11px] uppercase">
                <span className="opacity-40">COORDINATE CORE</span>
                <span className="font-bold">LONDON, UK [GLOBAL REMOTE]</span>
              </div>
            </div>

            <div className={`flex gap-4 p-5 rounded-2xl border ${
              darkMode ? 'bg-white/3 border-white/5' : 'bg-bg-dark/3 border-bg-dark/5 text-bg-dark'
            }`}>
              <Mail size={18} className="text-accent-rose flex-shrink-0 mt-0.5" />
              <div className="flex flex-col font-mono text-[11px] uppercase">
                <span className="opacity-40">DIRECT PORT</span>
                <span className="font-bold">hello@qolab.agency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form column */}
        <div className={`lg:col-span-7 p-8 rounded-3xl border relative ${
          darkMode ? 'bg-white/3 border-white/5' : 'bg-bg-dark/3 border-bg-dark/5 text-bg-dark'
        }`}>
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-between h-full gap-8"
              >
                <div className="flex flex-col gap-6">
                  {/* Name field */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] uppercase opacity-50 mb-2 tracking-wider">
                      IDENTIFIER_NAME *
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="ENTER YOUR IDENTIFIER"
                      value={formData.name}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                      onMouseEnter={(e) => handleHoverElement(e, 'hover')}
                      onMouseLeave={() => setCursor({ type: 'default' })}
                      className={`w-full py-3 px-4 bg-transparent border-b outline-none font-mono text-xs uppercase tracking-wider cursor-none transition-colors ${
                        darkMode ? 'border-white/10 focus:border-accent-rose text-white' : 'border-bg-dark/10 focus:border-accent-rose text-bg-dark'
                      }`}
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] uppercase opacity-50 mb-2 tracking-wider">
                      DIRECT_PORT_EMAIL *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="ENTER PORT ADDRESS"
                      value={formData.email}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                      onMouseEnter={(e) => handleHoverElement(e, 'hover')}
                      onMouseLeave={() => setCursor({ type: 'default' })}
                      className={`w-full py-3 px-4 bg-transparent border-b outline-none font-mono text-xs uppercase tracking-wider cursor-none transition-colors ${
                        darkMode ? 'border-white/10 focus:border-accent-rose text-white' : 'border-bg-dark/10 focus:border-accent-rose text-bg-dark'
                      }`}
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] uppercase opacity-50 mb-2 tracking-wider">
                      SIGNAL_MESSAGE_BRIEF *
                    </label>
                    <textarea
                      required
                      rows={4}
                      name="message"
                      placeholder="DESCRIBE THE DESIGN ANOMALY"
                      value={formData.message}
                      onKeyDown={handleKeyDown}
                      onChange={handleInputChange}
                      onMouseEnter={(e) => handleHoverElement(e, 'hover')}
                      onMouseLeave={() => setCursor({ type: 'default' })}
                      className={`w-full py-3 px-4 bg-transparent border-b outline-none font-mono text-xs uppercase tracking-wider cursor-none resize-none transition-colors ${
                        darkMode ? 'border-white/10 focus:border-accent-rose text-white' : 'border-bg-dark/10 focus:border-accent-rose text-bg-dark'
                      }`}
                    />
                  </div>
                </div>

                <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between border-t pt-6 mt-4 ${darkMode ? 'border-white/10' : 'border-bg-dark/10'}`}>
                  <span className="font-mono text-[9px] opacity-40 uppercase tracking-wider text-center sm:text-left">
                    *FIELDS MARKED REQUISITE STREAM DIRECTLY*
                  </span>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    onMouseEnter={(e) => handleHoverElement(e, 'magnetic')}
                    onMouseLeave={() => setCursor({ type: 'default' })}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full bg-accent-rose text-white font-mono text-xs font-bold uppercase tracking-widest shadow-xl transition-all duration-300 ${
                      isSubmitting ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                        STREAMING_PACKET
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        EMIT_SIGNAL
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              /* --- STATE 2: SUCCESS TICKET CERTIFICATE --- */
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[350px]"
              >
                <div className="w-16 h-16 rounded-full bg-accent-rose/10 border border-accent-rose flex items-center justify-center text-accent-rose mb-6 animate-bounce">
                  <CheckCircle2 size={36} />
                </div>

                <h4 className="font-display font-black text-2xl uppercase tracking-tighter text-accent-rose mb-2">
                  SIGNAL EMITTED!
                </h4>
                
                <p className="font-mono text-xs opacity-75 max-w-sm mb-6 uppercase leading-relaxed">
                  YOUR PACKET ENCRYPTED SECURELY AND EMITTED TO COORDINATE BASE LONDON.
                </p>

                {/* Submited encryption ticket details */}
                <div className={`p-4 rounded-xl border font-mono text-[10px] text-left uppercase flex flex-col gap-1.5 w-full max-w-xs ${
                  darkMode ? 'bg-white/5 border-white/10' : 'bg-bg-dark/5 border-bg-dark/10'
                }`}>
                  <span className="text-accent-rose font-bold">// TRANSMISSION_TICKET</span>
                  <div className="flex justify-between">
                    <span>TICKET_ID:</span>
                    <span className="font-semibold text-accent-rose">KNTK_9281X0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PORT_STATUS:</span>
                    <span className="font-semibold">SECURE_STREAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RESP_LATENCY:</span>
                    <span className="font-semibold">&lt; 12_HOURS</span>
                  </div>
                </div>

                <button
                  onClick={() => { audioEngine.triggerClick(); setIsSent(false); setFormData({ name: '', email: '', message: '' }); }}
                  onMouseEnter={(e) => handleHoverElement(e, 'hover')}
                  onMouseLeave={() => setCursor({ type: 'default' })}
                  className="font-mono text-[10px] text-accent-rose font-bold uppercase tracking-widest border-b border-accent-rose mt-8 hover:text-white hover:border-transparent transition-all duration-200"
                >
                  SEND_ANOTHER_PACKET
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
