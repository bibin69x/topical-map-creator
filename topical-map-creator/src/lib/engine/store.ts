// Persistent in-memory generation job store attached to globalThis
// This prevents Next.js route bundling and serverless isolate partition from dropping active generation state.

const globalStore = globalThis as unknown as {
  __tac_generations?: Map<string, any>;
};

if (!globalStore.__tac_generations) {
  globalStore.__tac_generations = new Map<string, any>();
}

export const activeGenerations = globalStore.__tac_generations;

