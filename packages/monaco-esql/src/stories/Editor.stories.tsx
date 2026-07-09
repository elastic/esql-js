/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Editor from "@monaco-editor/react";
import example from "../../example.esql?raw";
import { language } from "../monarch-shared";
import { promLanguageDefinition } from "monaco-promql";

const meta: Meta = {
	title: "Editor",
};

export default meta;
const promqlLanguageId = promLanguageDefinition.id;
export const Primary: StoryObj<typeof meta> = {
	render: () => (
		<div>
			<Editor
				height="90vh"
				defaultLanguage="esql"
				language="esql"
				defaultValue={example}
				onMount={(_, monaco) => {
					monaco.languages.register({ id: "esql" });
					monaco.languages.register(promLanguageDefinition);
					monaco.languages.setMonarchTokensProvider("esql", language);
					promLanguageDefinition.loader().then((mod) => {
						monaco.languages.setMonarchTokensProvider(
							promqlLanguageId,
							mod.language,
						);
						monaco.languages.setLanguageConfiguration(
							promqlLanguageId,
							mod.languageConfiguration,
						);
					});
				}}
			/>
		</div>
	),
};
