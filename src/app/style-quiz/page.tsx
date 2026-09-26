import type { Metadata } from "next";
import { StyleQuiz } from "@/components/quiz/StyleQuiz";

export const metadata: Metadata = {
  title: "Find Your Style",
  description: "Answer five questions and we'll recommend Rang-o-Riwaaj pieces for your occasion, colours and budget.",
};

export default function Page() {
  return <StyleQuiz />;
}
