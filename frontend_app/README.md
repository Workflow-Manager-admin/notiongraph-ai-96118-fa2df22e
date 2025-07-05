# Athera

Athera is a clone of the popular note-taking application Notion. It's built with Next.js as a learning exercise,
following a tutorial on YouTube.

You can view the live version of the project [here](https://athera-osadhi.vercel.app/).

## About This Project

This project is a fun experiment to create a functional clone of Notion, a popular note-taking and productivity
application. If you're looking to understand how to build complex applications using Next.js, then examining the code of
this project might be a good start.

## Built With

This project is built with the following technologies:

- [Next.js](https://nextjs.org/)
- [@blocknote/core and @blocknote/react](https://blocknote.net/)
- [@clerk/nextjs](https://docs.clerk.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://github.com/colinhacks/zod)
- [Tailwind CSS](https://tailwindcss.com/)

For a complete list of the dependencies, refer to the `package.json` file.


# NotionGraph AI Frontend

## Features

- Markdown/block notes editor (Blocknote)
- **Offline/local notes**: Save, organize, and edit notes in a folder-like structure entirely in your browser using IndexedDB for effectively unlimited local storage. Local notes are accessible via the "Local Notes" navigation link and are available offline!

## Development

- Built with Next.js, Tailwind CSS, TypeScript, and Radix UI.
- Start in dev mode: `npm run dev`
- Build: `npm run build`

## Usage

- To use the local notes feature:  
  Click on **"Local Notes"** in the navigation sidebar to open the offline storage panel.  
  - Create folders and notes, edit and organize them.
  - All changes are saved instantly to your browser using IndexedDB.
  - Notes and folders remain available even when offline.

## Other Features

- Obsidian-style graph-view
- AI Assistant (AethraBot with Google Gemini)
- Dropbox backup/restore
- Clerk authentication
- Theme switching and beautiful, minimal UI
