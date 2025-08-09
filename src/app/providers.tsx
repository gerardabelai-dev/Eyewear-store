"use client";

import type * as React from "react";
import { useEffect } from "react";
import { z } from "zod";

export function QueryProvider(props: { children: React.ReactNode }) {
	// Initialize Zod with user-friendly Portuguese messages
	useEffect(() => {
		try {
			// Configure custom Portuguese error messages that override the default locale
			z.config({
				customError: (issue) => {
					switch (issue.code) {
						case "too_small":
							if (issue.origin === "string") {
								return `Mínimo ${issue.minimum} caracteres`;
							}
							if (issue.origin === "number") {
								return `Valor mínimo: ${issue.minimum}`;
							}
							if (issue.origin === "array") {
								return `Mínimo ${issue.minimum} item(s)`;
							}
							break;

						case "too_big":
							if (issue.origin === "string") {
								return `Máximo ${issue.maximum} caracteres`;
							}
							if (issue.origin === "number") {
								return `Valor máximo: ${issue.maximum}`;
							}
							if (issue.origin === "array") {
								return `Máximo ${issue.maximum} item(s)`;
							}
							break;
						case "invalid_type":
							if (issue.input === undefined) {
								return "Campo obrigatório";
							}
							return "Valor inválido";
					}

					// Use Portuguese locale as fallback for other cases
					return undefined;
				},
			});

			// Load Portuguese locale after custom error map for fallback cases
			z.config(z.locales.pt());

			console.log("Loaded user-friendly Portuguese error messages for Zod");
		} catch (error) {
			console.error("Failed to setup Zod locale:", error);
		}
	}, []);

	return <>{props.children}</>;
}
