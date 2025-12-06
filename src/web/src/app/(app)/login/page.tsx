import type { Metadata } from "next";
//import LoginForm from "@/components/auth/LoginForm";
// import { redirectIfAuthed } from "@/features/auth/redirectIfAuthed"; // opt

export const metadata: Metadata = {
  title: "Login — PocketPulse",
};

export default async function Page() {
  // await redirectIfAuthed(); //if there is an endpoint, who will say "already logged in" by cookie
  return "Login Page";
}
