"use client";

import {
	ChevronLeft,
	ChevronRight,
	GraduationCap,
	Laptop,
	Music,
	Palette,
	UserPlus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
	{
		id: "tech-dev",
		title: "Tech & Dev",
		count: "234 events",
		Icon: Laptop,
		bg: "bg-slate-100",
		color: "text-slate-900",
	},
	{
		id: "music",
		title: "Music",
		count: "187 events",
		Icon: Music,
		bg: "bg-slate-100",
		color: "text-slate-900",
	},
	{
		id: "college-fests",
		title: "College Fests",
		count: "40 events",
		Icon: GraduationCap,
		bg: "bg-orange-50",
		color: "text-orange-500",
	},
	{
		id: "workshops",
		title: "Workshops",
		count: "158 events",
		Icon: Users,
		bg: "bg-gray-100",
		color: "text-gray-600",
	},
	{
		id: "art-culture",
		title: "Art & Culture",
		count: "80 events",
		Icon: Palette,
		bg: "bg-pink-50",
		color: "text-pink-500",
	},
	{
		id: "meetups",
		title: "Meetups",
		count: "108 events",
		Icon: UserPlus,
		bg: "bg-yellow-50",
		color: "text-yellow-600",
	},
];

export function EventCategories() {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const offset = window.innerWidth < 640 ? 240 : 280; // card width + gap
			const scrollAmount = direction === "left" ? -offset : offset;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<section className="w-full bg-[#EBF3FF] py-20">
			<div className="mx-auto max-w-[1280px] px-6">
				<div className="mb-8 flex flex-col items-center justify-between gap-6 md:mb-12 md:flex-row">
					<h2 className="text-center font-extrabold text-4xl text-black tracking-tight md:text-left md:text-5xl">
						What are you into?
					</h2>
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="icon"
							onClick={() => scroll("left")}
							aria-label="Scroll left"
							className="h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:scale-105 hover:bg-gray-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => scroll("right")}
							aria-label="Scroll right"
							className="h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:scale-105 hover:bg-gray-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<ChevronRight className="h-6 w-6" />
						</Button>
					</div>
				</div>

				<div
					ref={scrollRef}
					className="-mx-6 -mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pt-6 pb-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{CATEGORIES.map((category) => (
						<Link
							key={category.id}
							href={`/events?category=${category.id}`}
							className="group flex aspect-square w-56 shrink-0 snap-center flex-col items-center justify-center rounded-[32px] border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl sm:w-64"
						>
							<div
								className={`mb-4 rounded-2xl p-5 transition-transform duration-300 group-hover:scale-110 ${category.bg}`}
							>
								<category.Icon
									className={`h-10 w-10 stroke-[1.5] sm:h-12 sm:w-12 ${category.color}`}
								/>
							</div>
							<h3 className="mb-1 text-center font-bold text-black text-lg sm:text-xl">
								{category.title}
							</h3>
							<span className="text-center font-semibold text-gray-400 text-xs sm:text-sm">
								{category.count}
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
