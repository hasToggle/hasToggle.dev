interface CodeSnippet {
  code: string;
  id: number;
}

const CODE_ANIMATION_STEPS = {
  STATE_UPDATE: 3,
  RENDER_UPDATE: 7,
} as const;

export const getCounterSnippets = (internalCount: number): CodeSnippet[] => {
  const base = `
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You collected {count} hazelnuts 🌰.</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}`.trim();

  const stateUpdate = `
function Counter() {
  const [count, setCount] = useState(0); // count = ${internalCount}
  return (
    <div>
      <p>You collected {count} hazelnuts 🌰.</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}`.trim();

  const renderUpdate = `
function Counter() {
  const [count, setCount] = useState(0); // count = ${internalCount}
  return (
    <div>
      <p>You collected {count} hazelnuts 🌰.</p> {/* count = ${internalCount} */}
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}`.trim();

  return [
    { id: 1, code: base },
    ...new Array(CODE_ANIMATION_STEPS.STATE_UPDATE).fill({
      id: 2,
      code: stateUpdate,
    }),
    ...new Array(CODE_ANIMATION_STEPS.RENDER_UPDATE).fill({
      id: 3,
      code: renderUpdate,
    }),
  ];
};
