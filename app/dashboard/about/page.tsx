'use client'

import { useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'

export default function AboutPage() {
    const containerRef = useRef<any>(null)

    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (!containerRef.current) return
            containerRef.current.style.setProperty('--x', `${e.clientX}px`)
            containerRef.current.style.setProperty('--y', `${e.clientY}px`)
        }

        window.addEventListener('mousemove', move)
        return () => window.removeEventListener('mousemove', move)
    }, [])

    const handleMove = (e: any, ref: any) => {
        const rect = ref.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const rotateX = (y / rect.height - 0.5) * 15
        const rotateY = (x / rect.width - 0.5) * -15

        ref.current.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `
    }

    const handleLeave = (ref: any) => {
        ref.current.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `
    }

    const refs = [useRef<any>(null), useRef<any>(null)]

    const data = [
        {
            name: "Shakirov Mirjalol",
            role: "CEO / Founder",
            image: "/ceo.png",
        },
        {
            name: "Xojiakbar Abdurahimov",
            role: "CTO / Creator",
            image: "/public/creator.jpg",
        }
    ]

    return (
        <div ref={containerRef} className="relative min-h-screen p-6 space-y-16 overflow-hidden">

            {/* 🌌 BACKGROUND */}
            <div className="absolute inset-0 -z-20 animate-gradient bg-[linear-gradient(270deg,#eef2ff,#e0f2fe,#f5f3ff,#eef2ff)] bg-[length:600%_600%]" />

            {/* 🧠 CURSOR LIGHT */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background: `radial-gradient(600px at var(--x) var(--y), rgba(0,0,0,0.08), transparent 40%)`
                }}
            />

            {/* 🚀 HERO (ELITE TEXT) */}
            <div className="max-w-3xl space-y-6">

                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    MX SUITE — ichki boshqaruv tizimi
                </h1>

                <p className="text-gray-700 text-lg leading-relaxed">
                    Ushbu platforma ommaviy foydalanish uchun emas.
                    U faqat MX SUITE  ichki menejerlari va rahbariyati uchun ishlab chiqilgan
                    yopiq boshqaruv tizimidir.
                </p>

                <p className="text-gray-600 text-lg leading-relaxed">
                    Bu yerda har bir vazifa nazorat ostida, har bir harakat qayd etiladi
                    va har bir natija aniq o‘lchanadi.
                    Tizim boshqaruvni tartibga soladi, inson omilini kamaytiradi
                    va maksimal samaradorlikni ta’minlaydi.
                </p>

                <div className="flex gap-3 flex-wrap pt-2">
                    <span className="px-4 py-1 bg-white border rounded-full text-sm">🔒 Yopiq tizim</span>
                    <span className="px-4 py-1 bg-white border rounded-full text-sm">📊 To‘liq nazorat</span>
                    <span className="px-4 py-1 bg-white border rounded-full text-sm">⚡ Real vaqt monitoring</span>
                </div>

            </div>

            {/* 👑 FOUNDERS */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Asoschilar</h2>

                <div className="grid md:grid-cols-2 gap-10">

                    {data.map((item, i) => (
                        <div
                            key={i}
                            ref={refs[i]}
                            onMouseMove={(e) => handleMove(e, refs[i])}
                            onMouseLeave={() => handleLeave(refs[i])}
                            className="group transition-all duration-300 animate-float"
                            style={{ transformStyle: 'preserve-3d' }}
                        >

                            <Card className="rounded-[32px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.2)] bg-white">

                                <div className="relative w-full h-96 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    {/* OVERLAY */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* BRAND */}
                                    <div className="absolute top-4 left-4 text-white/80 text-xs tracking-widest">
                                        MX SUITE
                                    </div>

                                    {/* TEXT */}
                                    <div className="absolute bottom-5 left-5 text-white">
                                        <h3 className="text-xl font-bold">{item.name}</h3>
                                        <p className="text-sm opacity-80">{item.role}</p>
                                    </div>
                                </div>

                            </Card>

                        </div>
                    ))}

                </div>
            </div>

            {/* 🎬 ANIMATIONS */}
            <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradient 12s ease infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

        </div>
    )
}