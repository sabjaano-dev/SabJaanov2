'use client'

import { useRef, useEffect, useState, FormEvent } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate
} from 'framer-motion'
import Slide from './Slide'

const slides = [
  {
    heading: "Your Ads Deserve Better Than a Billboard",
    sub: "Get seen inside",
    rotatingWords: ["cafés", "gyms", "salons", "malls", "more"],
    bg: "bg-sabYellow"
  },
  {
    heading: "",
    sub: "Elegantly placed, hyper-targeted, built for real results.",
    bg: "bg-white"
  },
  {
    heading: "Maximum Attention. Minimal Waste.",
    sub: "50% lower marketing cost",
    bg: "bg-sabYellow"
  },
  {
    heading: "",
    sub: "20x more qualified real estate leads.",
    bg: "bg-white"
  },
  {
    heading: "",
    sub: "How will my Ad look like?",
    bg: "bg-white"
  },
  {
    heading: "Coming Soon",
    sub: "We're cooking up something amazing.",
    bg: "bg-sabYellow"
  }
]

export default function Hero() {
  const ref = useRef(null)

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const [enquiry, setEnquiry] = useState({ name: '', email: '', message: '' })
  const [enquiryStatus, setEnquiryStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleEmailSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmailStatus('loading')
    try {
      const res = await fetch('https://sheetdb.io/api/v1/lqhy15saokhn0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [{ Email: email }] })
      })
      if (res.ok) setEmailStatus('success')
    } catch {
      setEmailStatus('idle')
    }
    setEmail('')
    setTimeout(() => setEmailStatus('idle'), 2000)
  }

  const handleEnquirySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnquiryStatus('loading')
    try {
      const res = await fetch('https://sheetdb.io/api/v1/lqhy15saokhn0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              Name: enquiry.name,
              Email: enquiry.email,
              Message: enquiry.message
            }
          ]
        })
      })
      if (res.ok) setEnquiryStatus('success')
    } catch {
      setEnquiryStatus('idle')
    }
    setEnquiry({ name: '', email: '', message: '' })
    setTimeout(() => setEnquiryStatus('idle'), 2000)
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  const totalSlides = slides.length
  const scrollPoints = []
  const colors = []

  for (let i = 0; i < totalSlides; i++) {
    const base = i / totalSlides
    scrollPoints.push(base, base + 0.001, base + 0.099)
    const color = slides[i].bg === 'bg-white' ? '#ffffff' : '#FFDE59'
    colors.push(color, color, color)
  }

  const bgColorRaw = useTransform(scrollYProgress, scrollPoints, colors)
  const bgColor = useMotionValue(colors[0])

  useEffect(() => {
    return bgColorRaw.onChange((latest) => {
      animate(bgColor, latest, {
        duration: 0.6,
        ease: 'easeInOut'
      })
    })
  }, [bgColorRaw, bgColor])

  return (
    <div ref={ref} className="relative">
      {/* Background Transition Layer */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen -z-10"
        style={{ backgroundColor: bgColor }}
      />

      {/* Slide Content */}
      <div className={`h-[${totalSlides * 100}vh]`}>
        {slides.map((slide, i) => (
          <section
            key={i}
            className={`relative h-screen w-full flex items-center justify-center text-center px-4`}
          >
            {i === 0 && (
              <img
                src="/sabjaano-logo.png"
                alt="SabJaano Logo"
                className="absolute top-0.5 left-1/2 -translate-x-1/2 w-32"
              />
            )}
            <Slide {...slide} />
          </section>
        ))}

        {/* Footer */}
        <footer className="bg-black text-white py-12 px-6 text-center flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold">Stay Updated</h2>

          {/* Email Signup */}
          <form onSubmit={handleEmailSignup} className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="px-4 py-2 rounded text-black"
            />
            <button
              type="submit"
              className="bg-sabPurple text-white px-6 py-2 rounded hover:opacity-80 transition"
              disabled={emailStatus === 'loading'}
            >
              {emailStatus === 'loading' ? 'Sending...' : 'Sign Up'}
            </button>
          </form>
          {emailStatus === 'success' && <p className="text-green-400">✅ Sent successfully!</p>}

          {/* Enquiry Form */}
          <div className="mt-10 max-w-xl w-full text-left">
            <h3 className="text-lg font-medium mb-4">Enquiry Form</h3>
            <form onSubmit={handleEnquirySubmit} className="grid gap-4">
              <input
                type="text"
                value={enquiry.name}
                onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                placeholder="Your name"
                className="px-4 py-2 rounded text-black"
              />
              <input
                type="email"
                value={enquiry.email}
                onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                placeholder="Your email"
                className="px-4 py-2 rounded text-black"
              />
              <textarea
                value={enquiry.message}
                onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                placeholder="Your message"
                rows={4}
                className="px-4 py-2 rounded text-black"
              />
              <button
                type="submit"
                className="bg-sabPurple text-white px-6 py-2 rounded hover:opacity-80 transition"
                disabled={enquiryStatus === 'loading'}
              >
                {enquiryStatus === 'loading' ? 'Sending...' : 'Submit'}
              </button>
              {enquiryStatus === 'success' && <p className="text-green-400">✅ Message sent!</p>}
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-10 text-sm text-white/80">
            <p>contact@sabjaano.com</p>
            <p>© {new Date().getFullYear()} SabJaano Ads LLP</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
