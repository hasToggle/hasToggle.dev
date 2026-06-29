import {
  type FileModel,
  INITIAL_FILE,
  type Suggestion,
  SUGGESTION,
} from "./suggestions";

export { INITIAL_FILE, SUGGESTION };
export type { FileModel, Suggestion };

export function applySuggestion(
  file: FileModel,
  s: Suggestion
): { file: FileModel; hasMismatch: boolean; mismatchRef: string } {
  const lines = [...file.lines];
  lines.splice(s.insertAfterLine + 1, 0, ...s.code);
  const defined = file.lines.join("\n").includes(s.missingRef);
  return {
    file: { lines },
    hasMismatch: !defined,
    mismatchRef: s.missingRef,
  };
}

export function resolveMismatch(file: FileModel, s: Suggestion): FileModel {
  return { lines: [s.fixLine, "", ...file.lines] };
}
