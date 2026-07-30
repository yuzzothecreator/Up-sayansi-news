"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/motion";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Stories that{" "}
            <span className="text-gradient">move the world</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="rounded-xl px-8 shadow-elevated">
              <Link href="/blog">
                Start reading
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8">
              <Link href="/register">Become a writer</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
          >
            <span><strong className="text-foreground">50K+</strong> readers</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span><strong className="text-foreground">200+</strong> writers</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span><strong className="text-foreground">1M+</strong> stories read</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
