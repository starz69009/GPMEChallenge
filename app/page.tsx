import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
          <span className="text-xl font-bold text-primary-foreground">PME</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">PME Challenge</h1>
        <p className="text-muted-foreground max-w-md">
          {"Serious Game de gestion d'entreprise pour BTS Gestion PME"}
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Se connecter
          </Link>
          <Link
            href="/signup-admin"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-secondary px-6 text-sm font-medium text-secondary-foreground hover:bg-accent"
          >
            Espace Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
