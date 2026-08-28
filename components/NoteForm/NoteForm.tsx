"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NewNote, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setDraft({ [name]: value } as Partial<NewNote>);
  };

  const formAction = (formData: FormData) => {
    const note: NewNote = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      tag: String(formData.get("tag") ?? "Todo") as NoteTag,
    };

    mutation.mutate(note);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} action={formAction}>
      <label className={css.formGroup}>
        Title
        <input
          className={css.input}
          type="text"
          name="title"
          minLength={3}
          maxLength={50}
          required
          defaultValue={draft.title}
          onChange={handleChange}
        />
      </label>

      <label className={css.formGroup}>
        Content
        <textarea
          className={css.textarea}
          rows={8}
          name="content"
          maxLength={500}
          defaultValue={draft.content}
          onChange={handleChange}
        />
      </label>

      <label className={css.formGroup}>
        Tag
        <select
          className={css.select}
          name="tag"
          required
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>

      {mutation.isError && (
        <span className={css.error}>Failed to create note. Try again.</span>
      )}

      <div className={css.actions}>
        <button
          className={css.cancelButton}
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className={css.submitButton}
          type="submit"
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
