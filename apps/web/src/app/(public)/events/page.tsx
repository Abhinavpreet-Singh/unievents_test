import { MapPin, Search } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AllEventsList } from "@/features/events/components/all-events-list/all-events-list";

import { Navbar } from "@/shared/ui/navbar";

export default async function EventsPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string;
		location?: string;
		category?: string;
		mode?: string;
		type?: string;
	}>;
}) {
	const params = await searchParams;
	const mode =
		params.mode ??
		(params.location?.toLowerCase() === "online" ? "ONLINE" : undefined);

	const withParam = (key: string, value?: string) => {
		const query = new URLSearchParams();
		if (params.search) query.set("search", params.search);
		if (params.location) query.set("location", params.location);
		if (params.category) query.set("category", params.category);
		if (mode) query.set("mode", mode);
		if (params.type) query.set("type", params.type);

		if (!value) {
			query.delete(key);
		} else {
			query.set(key, value);
		}

		return `/events?${query.toString()}`;
	};

	return (
		<div className="min-h-screen bg-[#f8fbff]">
			<Navbar />
			<div className="container mx-auto px-4 pt-24 pb-12">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-2">
						<h1 className="font-bold text-3xl tracking-tight">
							Search Results
						</h1>
						<p className="text-muted-foreground">
							Showing events matching your criteria
						</p>
					</div>

					<Card className="p-4">
						<CardContent className="p-0">
							<div className="flex flex-wrap items-center gap-8">
								<div className="flex items-center gap-2">
									<Search className="h-5 w-5 text-muted-foreground" />
									<span className="font-semibold">Search:</span>
									<Badge variant="secondary" className="px-3 py-1">
										{params.search || "All Events"}
									</Badge>
								</div>

								<div className="flex items-center gap-2 md:border-l md:pl-8">
									<MapPin className="h-5 w-5 text-muted-foreground" />
									<span className="font-semibold">Location:</span>
									<Badge variant="secondary" className="px-3 py-1">
										{params.location || "Anywhere"}
									</Badge>
								</div>

								<div className="flex items-center gap-2 md:border-l md:pl-8">
									<span className="font-semibold">Mode:</span>
									<Badge variant="secondary" className="px-3 py-1">
										{mode || "Any"}
									</Badge>
								</div>

								<div className="flex items-center gap-2 md:border-l md:pl-8">
									<span className="font-semibold">Type:</span>
									<Badge variant="secondary" className="px-3 py-1">
										{params.type || "Any"}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex flex-wrap items-center gap-3">
						<Button asChild variant={mode === "ONLINE" ? "default" : "outline"}>
							<Link href={withParam("mode", "ONLINE") as Route}>Online</Link>
						</Button>
						<Button
							asChild
							variant={mode === "OFFLINE" ? "default" : "outline"}
						>
							<Link href={withParam("mode", "OFFLINE") as Route}>Offline</Link>
						</Button>
						<Button asChild variant={!mode ? "default" : "outline"}>
							<Link href={withParam("mode", undefined) as Route}>Any Mode</Link>
						</Button>

						<Button
							asChild
							variant={params.type === "FREE" ? "default" : "outline"}
						>
							<Link href={withParam("type", "FREE") as Route}>Free</Link>
						</Button>
						<Button
							asChild
							variant={params.type === "PAID" ? "default" : "outline"}
						>
							<Link href={withParam("type", "PAID") as Route}>Paid</Link>
						</Button>
						<Button asChild variant={!params.type ? "default" : "outline"}>
							<Link href={withParam("type", undefined) as Route}>Any Type</Link>
						</Button>
					</div>

					<AllEventsList searchParams={params} />
				</div>
			</div>
		</div>
	);
}
