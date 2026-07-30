"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { staggerContainer, staggerItem } from "@/lib/motion";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
};

type TestimonialsSectionProps = {
  items: Testimonial[];
};

export function TestimonialsSection({ items }: TestimonialsSectionProps) {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="Loved by readers & writers"
          description="Join thousands who've made Pulse their home for great stories"
          align="center"
          className="mb-12"
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="relative rounded-2xl border border-border/50 bg-card p-6 shadow-soft"
            >
              <Quote className="size-8 text-primary/20" />
              <p className="mt-4 text-base leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt={item.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized={item.avatar.includes("dicebear.com")}
                />
                <div>
                  <p className="text-sm font-medium">{item.author}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
