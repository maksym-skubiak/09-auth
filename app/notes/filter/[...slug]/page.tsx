import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export const dynamic = "force-dynamic";

type NotesProps = {
  params: Promise<{
    slug: string[];
  }>;
};

const getSelectedTag = (slug: string[]) =>
  slug[0] === "all" ? undefined : slug[0];

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedTag = getSelectedTag(slug);
  const filterName = selectedTag ?? "All";
  const title = `${filterName} notes | NoteHub`;
  const description = selectedTag
    ? `Browse notes filtered by ${selectedTag} tag in NoteHub.`
    : "Browse all your notes in NoteHub.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${slug[0]}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub application preview",
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const selectedTag = getSelectedTag(slug);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", selectedTag],
    queryFn: () => fetchNotes({ page: 1, search: "", tag: selectedTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={selectedTag} />
    </HydrationBoundary>
  );
}
