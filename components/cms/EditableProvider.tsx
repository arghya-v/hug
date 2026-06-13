import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getByPath,
  setByPath,
  type SiteContent,
} from "@/lib/content";

interface EditableContextValue {
  content: SiteContent;
  editing: boolean;
  isAdmin: boolean;
  updateField: (path: string, value: string) => void;
}

const EditableContext = createContext<EditableContextValue | null>(null);

export function useEditable(): EditableContextValue {
  const ctx = useContext(EditableContext);
  if (!ctx) {
    throw new Error("useEditable must be used within <EditableProvider>");
  }
  return ctx;
}

export function EditableProvider({
  initialContent,
  isAdmin,
  children,
}: {
  initialContent: SiteContent;
  isAdmin: boolean;
  children: ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [pristine, setPristine] = useState<SiteContent>(initialContent);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const dirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(pristine),
    [content, pristine]
  );

  function updateField(path: string, value: string) {
    setContent((prev) => setByPath(prev, path, value));
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      const saved: SiteContent = await res.json();
      setContent(saved);
      setPristine(saved);
      setStatus("saved");
      setEditing(false);
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  function cancel() {
    setContent(pristine);
    setEditing(false);
    setStatus("idle");
  }

  const value: EditableContextValue = { content, editing, isAdmin, updateField };

  return (
    <EditableContext.Provider value={value}>
      {children}

      {isAdmin && (
        <div className="fixed bottom-5 right-5 z-[10000] flex flex-col items-end gap-2">
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white/95 backdrop-blur-md border border-purple-100 rounded-xl shadow-lg px-4 py-3 text-xs text-gray-600 max-w-[230px]"
              >
                Click any highlighted text to edit it directly, then save.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-purple-100 rounded-full shadow-lg px-2 py-2">
            {editing ? (
              <>
                <span className="text-xs text-gray-500 px-2">
                  {status === "saving"
                    ? "Saving…"
                    : status === "error"
                    ? "Save failed"
                    : dirty
                    ? "Unsaved changes"
                    : "No changes"}
                </span>
                <button
                  onClick={cancel}
                  className="text-sm px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={save}
                  disabled={!dirty || status === "saving"}
                  className="text-sm px-4 py-1.5 rounded-full bg-[#6D5CAE] text-white font-medium shadow-sm disabled:opacity-50 transition"
                >
                  Save
                </motion.button>
              </>
            ) : (
              <>
                {status === "saved" && (
                  <span className="text-xs text-green-600 px-2">Saved ✓</span>
                )}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-[#6D5CAE] text-white font-medium shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                    />
                  </svg>
                  Edit Mode
                </motion.button>
              </>
            )}
          </div>
        </div>
      )}
    </EditableContext.Provider>
  );
}

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "div";

/**
 * Inline-editable text bound to a content field by dot-path.
 * Renders plain text for visitors; becomes contentEditable for an admin in
 * edit mode.
 */
export function Editable({
  field,
  as = "span",
  className = "",
}: {
  field: string;
  as?: Tag;
  className?: string;
}) {
  const { content, editing, isAdmin, updateField } = useEditable();
  const value = getByPath(content, field);
  const ref = useRef<HTMLElement | null>(null);
  const active = editing && isAdmin;

  // Keep the DOM text in sync with state when the node isn't being edited.
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = value;
    }
  }, [value, active]);

  const Tag = as;

  if (!active) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`${className} outline-none rounded-md ring-2 ring-[#6D5CAE]/40 ring-offset-2 ring-offset-[#f9f8ff] focus:ring-[#6D5CAE] focus:bg-purple-50/60 transition cursor-text`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => updateField(field, e.currentTarget.textContent ?? "")}
    >
      {value}
    </Tag>
  );
}
