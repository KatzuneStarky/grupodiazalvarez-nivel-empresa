"use client"

import RootServices from "@/modules/root/components/services";
import RootCoverage from "@/modules/root/components/coverage";
import RootFleet from "@/modules/root/components/fleet";
import RootAbout from "@/modules/root/components/about";
import RootHero from "@/modules/root/components/hero";
import { useEffect, useRef } from "react";
import { animate } from "animejs"

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(".animate-on-scroll", {
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            delay: 100,
            easing: "easeOutQuart",
          })
        }
      })
    }, observerOptions)

    const sections = pageRef.current?.querySelectorAll("section")
    sections?.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen">
      <RootHero />
      <RootAbout />
      <RootServices />
      <RootFleet />
      <RootCoverage />
    </div>
  );
}