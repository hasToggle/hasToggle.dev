import { codeToHtml } from "shiki";

export async function CodeBlock() {
  const highlighted = await codeToHtml(
    `"use client";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You collected {count} hazelnuts \u{1F330}.</p>
      <button onClick={() => setCount(count + 1)}>
        +1 \u{1F330}
      </button>
    </div>
  );
}`,
    {
      lang: "jsx",
      theme: "ayu-dark",
    }
  );

  // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki outputs HTML for syntax highlighting — input is a static code string
  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
}
