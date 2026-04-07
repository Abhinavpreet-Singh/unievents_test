"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "voltaze:favourite-event-ids";

function parseStoredFavorites(raw: string | null): Set<string> {
	if (!raw) {
		return new Set<string>();
	}

	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return new Set<string>();
		}

		return new Set(parsed.filter((value) => typeof value === "string"));
	} catch {
		return new Set<string>();
	}
}

export function useFavoriteEvents() {
	const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		setFavoriteIds(
			parseStoredFavorites(localStorage.getItem(FAVORITES_STORAGE_KEY)),
		);
	}, []);

	const toggleFavorite = useCallback((eventId: string) => {
		setFavoriteIds((prev) => {
			const next = new Set(prev);

			if (next.has(eventId)) {
				next.delete(eventId);
			} else {
				next.add(eventId);
			}

			localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
			return next;
		});
	}, []);

	const isFavorite = useCallback(
		(eventId: string) => favoriteIds.has(eventId),
		[favoriteIds],
	);

	return useMemo(
		() => ({ favoriteIds, isFavorite, toggleFavorite }),
		[favoriteIds, isFavorite, toggleFavorite],
	);
}
